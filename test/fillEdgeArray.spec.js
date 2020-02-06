import test from 'ava';
import path from 'path'
import loadJsonFile from 'load-json-file'

import {fillEdgeArray} from '../src/fillEdgeArray'
import {checkWhichSegmentIsTop} from '../src/compareEvents'

const diamond = loadJsonFile.sync(path.join(__dirname, 'fixtures', 'diamond.geojson'))

const edgeArray = []
const bbox = [Infinity, Infinity, -Infinity, -Infinity]

fillEdgeArray(diamond, edgeArray, bbox)

test('Edge Array is correctly filled', function (t) {
    t.is(edgeArray.length, 4)
    t.deepEqual(edgeArray[0].leftPoint.p, {x: -4, y: -5})
    t.deepEqual(edgeArray[0].rightPoint.p, {x: 0, y: 1})

    t.deepEqual(edgeArray[1].leftPoint.p, {x: -4, y: -5})
    t.deepEqual(edgeArray[1].rightPoint.p, {x: 0, y: -10})

    t.deepEqual(edgeArray[2].leftPoint.p, {x: 0, y: -10})
    t.deepEqual(edgeArray[2].rightPoint.p, {x: 4, y: -5})

    t.deepEqual(edgeArray[3].leftPoint.p, {x: 0, y: 1})
    t.deepEqual(edgeArray[3].rightPoint.p, {x: 4, y: -5})
})

test('Bbox computation is correct', function (t) {
    t.deepEqual(bbox, [-4, -10, 4, 1])
})

test('Edge Array is correctly sorted ', function (t) {
    edgeArray.sort(checkWhichSegmentIsTop)

    t.deepEqual(edgeArray[0].leftPoint.p, {x: -4, y: -5})
    t.deepEqual(edgeArray[0].rightPoint.p, {x: 0, y: 1})

    t.deepEqual(edgeArray[1].leftPoint.p, {x: 0, y: 1})
    t.deepEqual(edgeArray[1].rightPoint.p, {x: 4, y: -5})

    t.deepEqual(edgeArray[2].leftPoint.p, {x: -4, y: -5})
    t.deepEqual(edgeArray[2].rightPoint.p, {x: 0, y: -10})

    t.deepEqual(edgeArray[3].leftPoint.p, {x: 0, y: -10})
    t.deepEqual(edgeArray[3].rightPoint.p, {x: 4, y: -5})
})
