const path = require('path')
const Benchmark = require('benchmark')
const loadJsonFile = require('load-json-file')
const rasterize = require('../dist/vectorToGrid')

const switzerland = loadJsonFile.sync(path.join(__dirname, 'fixtures', 'switzerland.geojson'))

const options = {
    onStart () { console.log(this.name) },
    onError (event) { console.log(event.target.error) },
    onCycle (event) { console.log(String(event.target)) },
    onComplete () {
        console.log(`- Fastest is ${this.filter('fastest').map('name')}`)
    }
}

const suite = new Benchmark.Suite('rasterize', options)
suite
    .add('switzerland', function () {
        rasterize(switzerland, {
            pixelSizeMeters: 1000
        });
    })
    .run()

