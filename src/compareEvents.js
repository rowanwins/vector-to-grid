export function checkWhichSegmentIsTop (e1, e2) {

    if (e1.pointWithMaxY.p.y < e2.pointWithMaxY.p.y) return 1;
    if (e1.pointWithMaxY.p.y > e2.pointWithMaxY.p.y) return -1;

    if (e1.pointWithMaxY.p.y === e2.pointWithMaxY.p.y) {
        return e1.pointWithMaxY.p.x > e2.pointWithMaxY.p.x ? 1 : -1;
    }
    return -1
}

export function checkWhichPointIsLeft (p1, p2) {
    if (p1.p.x > p2.p.x) return 1;
    if (p1.p.x < p2.p.x) return -1;

    if (p1.p.y !== p2.p.y) return p1.p.y > p2.p.y ? 1 : -1;
    return 1
}

export function checkWhichSegmentIsLeft (e1, e2) {
    if (e1.leftPoint.p.x > e2.leftPoint.p.x) return 1;
    if (e1.leftPoint.p.x < e2.leftPoint.p.x) return -1;

    if (e1.leftPoint.p.y !== e2.leftPoint.p.y) return e1.leftPoint.p.y > e2.leftPoint.p.y ? 1 : -1;
    return 1
}
