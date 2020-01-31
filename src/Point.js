
export default class Point {

    constructor (p) {
        this.p = {
            x: p[0],
            y: p[1]
        }

        this.otherPoint = null
        this.isLeftEndpoint = null
    }
}

