import test from 'ava';

import Point from '../src/Point'
import {createEdge} from '../src/fillEdgeArray'

const p1 = new Point([0, 1])
const p2 = new Point([-4, -5])
const e = createEdge(p1, p2)
const e2 = createEdge(p2, p1)

test('Edge is correctly created', function (t) {
    t.is(e.leftPoint, p2)
    t.is(e.rightPoint, p1)

    t.is(e.pointWithMinY, p2)
    t.is(e.pointWithMaxY, p1)
})

test('Edge is correctly created in reverse', function (t) {
    t.is(e2.leftPoint, p2)
    t.is(e2.rightPoint, p1)

    t.is(e2.pointWithMinY, p2)
    t.is(e2.pointWithMaxY, p1)
})
