export function checkWhichSegmentIsTop (e1, e2) {
    if (e1.pointWithMaxY.p.y < e2.pointWithMaxY.p.y) return 1;
    if (e1.pointWithMaxY.p.y > e2.pointWithMaxY.p.y) return -1;
    return -1
}

export function checkWhichPointIsLeft (p1, p2) {
    if (p1.p.x > p2.p.x) return 1;
    if (p1.p.x < p2.p.x) return -1;
    return -1
}
