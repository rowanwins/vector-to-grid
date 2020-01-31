<template>
  <div id="app"></div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import marker2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import './coords';
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

const diamond = require('../../test/fixtures/almost-diamond.geojson')

export default {
  name: 'App',
  mounted: function () {
    
    const layer = L.geoJSON(diamond)
    let map = window.map = L.map('app', {
      crs: L.CRS.Simple
    }).fitBounds(layer.getBounds())  

    layer.addTo(map)

    map.addControl(new L.Coordinates());

    // L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    //   subdomains: 'abcd',
    //   maxZoom: 19
    // }).addTo(map)

    const pixelSizeInMetres = 10000
    const pixelSizeInDegrees = convertLength(pixelSizeInMetres, 'metres', 'degrees')
    console.time('rasterize')
    const values = rasterize(diamond, {
      pixelSizeMeters: pixelSizeInMetres
    });
    console.timeEnd('rasterize')

    const noDataValue = 0
    const projection = 4326
    // These could be derived from the rasterize process which generates a bbox
    const xmin = -4
    const ymax = 1
    const pixelWidth = pixelSizeInDegrees
    const pixelHeight = pixelSizeInDegrees
    const metadata = { noDataValue, projection, xmin, ymax, pixelWidth, pixelHeight };

    parse_georaster([values], metadata).then(georaster => {
      console.log("georaster:", georaster);
      var layer2 = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.7,
          pixelValuesToColorFn: values => values[0] === 0 ? 'red' : '#0000ff',
          resolution: 64 // optional parameter for adjusting display resolution
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
