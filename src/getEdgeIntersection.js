// This is a modified version of an edge intersection routine because
// we only need to return the location of the intersection on the x (not x,y)
// For the full version of the routine see https://github.com/rowanwins/shamos-hoey
export default function getEdgeIntersection (seg1, seg2) {
    const x1 = seg1.leftPoint.p.x
    const y1 = seg1.leftPoint.p.y
    const x2 = seg1.rightPoint.p.x
    const y2 = seg1.rightPoint.p.y
    const x3 = seg2.leftPoint.p.x
    const y3 = seg2.leftPoint.p.y
    const x4 = seg2.rightPoint.p.x
    const y4 = seg2.rightPoint.p.y

    const denom = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1))
    const numeA = ((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))

    const uA = numeA / denom

    return x1 + (uA * (x2 - x1))
}
