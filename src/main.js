import {checkWhichSegmentIsTop} from './compareEvents'
import {fillEdgeArray} from './fillEdgeArray'
import Edge from './Edge'
import Point from './Point'
import convertLength from './convertLength'
import getEdgeIntersection from './getEdgeIntersection'
// import {debugIntersections} from './debug'

export default function vectorToGrid (geojson, options) {
    const pixelSizeAsDegrees = convertLength(options.pixelSizeMeters, 'metres', 'degrees')

    const allEdges = []
    const bbox = [Infinity, Infinity, -Infinity, -Infinity]
    fillEdgeArray(geojson, allEdges, bbox)
    allEdges.sort(checkWhichSegmentIsTop)

    const bboxHeight = bbox[3] - bbox[1]
    const requiredRowHeightInDegrees = Math.round(bboxHeight / pixelSizeAsDegrees)
    const outRaster = new Array(requiredRowHeightInDegrees)

    const bboxWidth = bbox[2] - bbox[0]
    const requireRowWidth = Math.round(bboxWidth / pixelSizeAsDegrees)

    // Here is where we starting checking what needs to be filled in the output
    const activeEdges = []
    let indexOfLastActiveEdgeAdded = 0
    for (let i = 0; i < outRaster.length; i++) {
        const rowMinY = bbox[3] - (pixelSizeAsDegrees * i)

        // A Uint8Array initialises as 0 which is good for our null value
        const outRow = new Uint8Array(requireRowWidth)

        // first cull anything in active edges that is no longer active
        // This is probably a bit expensive particularly with larger grids
        for (let ii = 0; ii < activeEdges.length; ii++) {
            const edge = activeEdges[ii]
            if (!edge.intersectsRow(rowMinY)) {
                activeEdges.splice(ii, 1)
                ii--
            }
        }

        let ii = indexOfLastActiveEdgeAdded
        for (ii; ii < allEdges.length; ii++) {
            const edge = allEdges[ii]
            if (edge.intersectsRow(rowMinY)) {
                // I wonder if I could flag that this edge is valid until row...
                // That might make the culling of edges quicker..
                activeEdges.push(edge)
            } else if (edge.pointWithMinY.p.y < rowMinY) break
        }
        indexOfLastActiveEdgeAdded = ii

        // This edge represents the row of the raster
        const fauxEdge = new Edge(new Point([bbox[0], rowMinY]), new Point([bbox[2], rowMinY]))

        // Stores the intersections points
        const intersections = []
        for (let ii = 0; ii < activeEdges.length; ii++) {
            intersections.push(getEdgeIntersection(activeEdges[ii], fauxEdge))
        }
        // Sort the intersection points from left to right
        intersections.sort(function (a, b) { return a - b })

        // And then we modify the values of the row output
        for (let ii = 0; ii < intersections.length; ii = ii + 2) {
            const requiredWidthOfCells = Math.round((intersections[ii + 1] - intersections[ii]) / pixelSizeAsDegrees)
            const startPosition = Math.round(interpolate(intersections[ii], 0, requireRowWidth, bbox[0], bbox[2]))
            outRow.set(new Uint8Array(requiredWidthOfCells).fill(1), startPosition)
        }
        outRaster[i] = outRow
    }

    return {
        bbox: bbox,
        grid: outRaster
    }
}

function interpolate(fauxY, minAllowed, maxAllowed, min, max) {
    return (((maxAllowed - minAllowed) * (fauxY - min)) / (max - min) + minAllowed)
}

