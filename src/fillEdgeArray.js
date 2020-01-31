import Point from './Point'
import Edge from './Edge'
import {checkWhichPointIsLeft} from './compareEvents'

export function fillEdgeArray (geojson, edgeArray, bbox) {
    const geom = geojson.type === 'Feature' ? geojson.geometry : geojson

    let coords = geom.coordinates
    // standardise the input
    if (geom.type === 'Polygon') coords = [coords]

    for (let i = 0; i < coords[0].length; i++) {
        let currentP = coords[0][i][0]
        let nextP = null

        for (let ii = 0; ii < coords[0][i].length - 1; ii++) {
            if (currentP[0] < bbox[0]) bbox[0] = currentP[0]
            if (currentP[1] < bbox[1]) bbox[1] = currentP[1]
            if (currentP[0] > bbox[2]) bbox[2] = currentP[0]
            if (currentP[1] > bbox[3]) bbox[3] = currentP[1]
            nextP = coords[0][i][ii + 1]

            const p1 = new Point(currentP)
            const p2 = new Point(nextP)

            edgeArray.push(createEdge(p1, p2))
            currentP = nextP
        }
    }
}

export function createEdge (p1, p2) {
    p1.otherPoint = p2;
    p2.otherPoint = p1;

    if (checkWhichPointIsLeft(p1, p2) > 0) {
        p2.isLeftEndpoint = true;
        p1.isLeftEndpoint = false
    } else {
        p1.isLeftEndpoint = true;
        p2.isLeftEndpoint = false
    }
    return p1.isLeftEndpoint ? new Edge(p1, p2) : new Edge(p2, p1)
}
