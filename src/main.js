import {checkWhichSegmentIsTop, checkWhichSegmentIsLeft} from './compareEvents'
import {fillEdgeArray} from './fillEdgeArray'
import Edge from './Edge'
import Point from './Point'
import {convertLength} from '@turf/helpers'
import {testSegmentIntersect} from './utils'
// import {debugEventAndSegments, debugRemovingSegment} from './debug'

export default function vectorToGrid (geojson, options) {
    const pixelSizeAsDegrees = convertLength(options.pixelSizeMeters, 'metres', 'degrees')

    const allEdges = []
    const bbox = [Infinity, Infinity, -Infinity, -Infinity]
    fillEdgeArray(geojson, allEdges, bbox)
    allEdges.sort(checkWhichSegmentIsTop)
    console.log(bbox)
    const bboxHeight = bbox[3] - bbox[1]
    const requiredRowHeightInDegrees = Math.round(bboxHeight / pixelSizeAsDegrees)
    const outRaster = new Array(requiredRowHeightInDegrees)

    const bboxWidth = bbox[2] - bbox[0]
    const requireRowWidth = Math.round(bboxWidth / pixelSizeAsDegrees)

    let activeEdges = []

    // Here is where we starting checking what needs to be filled in the output
    for (let i = 0; i < outRaster.length; i++) {
        // A Uint8Array initialises as 0 which is good for our null value
        const outRow = new Uint8Array(requireRowWidth)
        outRaster[i] = outRow
        const rowMinY = bbox[3] - (pixelSizeAsDegrees * i)
        for (let ii = 0; ii < allEdges.length; ii++) {
            const edge = allEdges[ii]
            if (edge.done) continue
            if (edge.intersectsRow(rowMinY)) activeEdges.push(edge)
        }

        activeEdges.sort(checkWhichSegmentIsLeft)
        const fauxEdge = new Edge(new Point([bbox[0], rowMinY]), new Point([bbox[2], rowMinY]))

        // This will be an array of pairs, each pair represents a start & finish stretch
        const intersections = []
        for (let ii = 0; ii < activeEdges.length; ii = ii + 2) {
            intersections.push([testSegmentIntersect(activeEdges[ii], fauxEdge), testSegmentIntersect(activeEdges[ii + 1], fauxEdge)])
        }

        for (let ii = 0; ii < intersections.length; ii++) {
            const requiredWidthOfCells = Math.round((intersections[ii][1] - intersections[ii][0]) / pixelSizeAsDegrees)
            const arrayToFill = new Uint8Array(requiredWidthOfCells).fill(1)
            const startPosition = Math.round(interpolate(intersections[ii][0], 0, requireRowWidth, bbox[0], bbox[2]))
            outRow.set(arrayToFill, startPosition)

        }


        activeEdges = []
    }


    return outRaster
}

function interpolate(fauxY, minAllowed, maxAllowed, min, max) {
    return (((maxAllowed - minAllowed) * (fauxY - min)) / (max - min) + minAllowed)
}

