<template>
  <div id="app"></div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import marker2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import rasterize from '../../src/main'
import parse_georaster from "georaster"
import GeoRasterLayer from "georaster-layer-for-leaflet"
import {convertLength} from '@turf/helpers'

// Hack to get the markers into Vue correctly
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

const fixture = require('../../test/fixtures/switzerland.geojson')

export default {
  name: 'App',
  mounted: function () {
    
    let map = window.map = L.map('app', {
      crs: L.CRS.Simple
    })  
    const layer = L.geoJSON(fixture).addTo(map)
    map.fitBounds(layer.getBounds())

    const pixelSizeInMetres = 1000
    console.time('rasterize')
    const grid = rasterize(fixture, {
      pixelSizeMeters: pixelSizeInMetres
    });
    console.timeEnd('rasterize')

    const noDataValue = 0
    const projection = 4326

    const xmin = grid.bbox[0]
    const ymax = grid.bbox[3]
    const pixelSizeInDegrees = convertLength(pixelSizeInMetres, 'metres', 'degrees')
    const pixelWidth = pixelSizeInDegrees
    const pixelHeight = pixelSizeInDegrees
    const metadata = { noDataValue, projection, xmin, ymax, pixelWidth, pixelHeight };

    parse_georaster([grid.grid], metadata).then(georaster => {
      console.log("georaster:", georaster);
      var layer2 = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.7,
          pixelValuesToColorFn: values => values[0] === 0 ? 'red' : '#0000ff'
      });
      layer2.addTo(map);
    })

  }
}

</script>

<style>
 html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0px;
 }
</style>
