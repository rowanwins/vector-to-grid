const path = require('path')
const Benchmark = require('benchmark')
const loadJsonFile = require('load-json-file')

const switzerland = loadJsonFile.sync(path.join(__dirname, 'fixtures', 'simple', 'switzerland.geojson'))

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
    })
    .run()

