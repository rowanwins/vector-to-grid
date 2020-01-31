import rasterize from './src/main'

const diamond = {
    type: 'Polygon',
    coordinates: [
        [
            [0, 1],
            [-4, -5],
            [0, -10],
            [4, -5],
            [0, 1]
        ]
    ]}

const out = rasterize(diamond, {
    pixelSizeMeters: 10000
});
