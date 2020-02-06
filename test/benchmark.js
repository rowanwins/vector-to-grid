const path = require('path')
const Benchmark = require('benchmark')
const loadJsonFile = require('load-json-file')
const rasterize = require('../dist/vectorToGrid')

const switzerland = loadJsonFile.sync(path.join(__dirname, 'fixtures', 'switzerland.geojson'))

const options = {
    onStart () { console.log(this.name) },
    onError (event) { console.log(event.target.error) },
    onCycle (event) { console.log(String(event.target)) },
}

// Switzerland - 1km grid x 998 ops/sec ±1.89% (86 runs sampled)
// Switzerland - 100m grid x 90.50 ops/sec ±3.78% (66 runs sampled)
// Switzerland - 10m grid x 0.75 ops/sec ±5.09% (6 runs sampled)
const suite = new Benchmark.Suite('rasterize', options)
suite
    .add('Switzerland - 1km grid', function () {
        rasterize(switzerland, {
            pixelSizeMeters: 1000
        });
    })
    .add('Switzerland - 100m grid', function () {
        rasterize(switzerland, {
            pixelSizeMeters: 100
        });
    })
    .add('Switzerland - 10m grid', function () {
        rasterize(switzerland, {
            pixelSizeMeters: 10
        });
    })
    .run()

