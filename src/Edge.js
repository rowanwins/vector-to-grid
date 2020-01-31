export default class Edge {

    constructor (p1, p2) {
        this.leftPoint = p1
        this.rightPoint = p2
        this.done = false
    }

    get pointWithMinY() {
        return this.leftPoint.p.y < this.rightPoint.p.y ? this.leftPoint : this.rightPoint
    }

    get pointWithMaxY() {
        return this.leftPoint.p.y > this.rightPoint.p.y ? this.leftPoint : this.rightPoint
    }

    intersectsRow (rowMinY) {
        return this.pointWithMinY.p.y <= rowMinY && this.pointWithMaxY.p.y >= rowMinY
    }
}
