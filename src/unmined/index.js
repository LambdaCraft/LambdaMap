import L from 'leaflet'

import './L.TileLayer.NoGap'
import './leaflet-svg-shape-markers.min'
import { FunctionalTileLayer } from './leaflet.functionaltilelayer'

export const getMeasurementsFromProperties = props => {
  return {
    minMapX: props.minRegionX * 512,
    minMapY: props.minRegionZ * 512,
    mapWidth: (props.maxRegionX + 1 - props.minRegionX) * 512,
    mapHeight: (props.maxRegionZ + 1 - props.minRegionZ) * 512,
    zoomOffset: 0 - props.minZoom,
  }
}

export const createBaseLayer = (server, dimension, config) => {
  const msr = getMeasurementsFromProperties(config.properties)
  return new FunctionalTileLayer(
    function (view) {
      let zoom = view.zoom - msr.zoomOffset
      const zoomFactor = Math.pow(2, zoom)

      let tileSize = 256

      let minTileX = Math.floor(msr.minMapX * zoomFactor / tileSize)
      let minTileY = Math.floor(msr.minMapY * zoomFactor / tileSize)
      let maxTileX = Math.ceil((msr.minMapX + msr.mapWidth) * zoomFactor / tileSize) - 1
      let maxTileY = Math.ceil((msr.minMapY + msr.mapHeight) * zoomFactor / tileSize) - 1

      let tileX = view.tile.column
      let tileY = view.tile.row

      let tileBlockSize = tileSize / zoomFactor
      let tileBlockPoint = {
        x: tileX * tileBlockSize,
        z: tileY * tileBlockSize
      }

      let intersectsWithTile = function (region) {
        return (tileBlockPoint.x < (region.x + 1) * 512)
          && (tileBlockPoint.x + tileBlockSize > region.x * 512)
          && (tileBlockPoint.z < (region.z + 1) * 512)
          && (tileBlockPoint.z + tileBlockSize > region.z * 512)
      };

      if (tileX >= minTileX
        && tileY >= minTileY
        && tileX <= maxTileX
        && tileY <= maxTileY
        && ((config.regions === undefined) || config.regions.some(intersectsWithTile))) {
        let url = (server + '/' + dimension + '/tiles/zoom.{z}/{xd}/{yd}/tile.{x}.{y}.' + config.properties.imageFormat)
          .replace('{z}', zoom)
          .replace('{yd}', Math.floor(tileY / 10))
          .replace('{xd}', Math.floor(tileX / 10))
          .replace('{y}', view.tile.row)
          .replace('{x}', view.tile.column);
        return url;
      } else
        return server + '/' + dimension + "/tiles/empty." + config.properties.imageFormat;
    },
    {
      detectRetina: false,
      bounds: [[msr.minMapX, msr.minMapY], [msr.minMapX + msr.mapWidth, msr.minMapY + msr.mapHeight]]
    }
  )
}

export default class Unmined {
  constructor(server, mapConfigs, defaultDimension, renderTarget) {
    this.groups = {
      base: {},
      poi: {},
      players: {},
    }
    this.dimension = defaultDimension
    this.mapConfigs = mapConfigs
    this.dimensions = Object.keys(mapConfigs)
  
    for (const dimension of this.dimensions) {
      const layers = [
        createBaseLayer(server, dimension, this.mapConfigs[dimension])
      ]
      this.groups.players[dimension] = new L.LayerGroup()
      this.groups.poi[dimension] = new L.LayerGroup()
      this.groups.base[dimension] = L.layerGroup(layers)
    }
  
    this.map = L.map(renderTarget, {
      crs: L.CRS.Simple,
      maxBoundsViscosity: 1.0,
      layers: [
        this.groups.base[defaultDimension],
        this.groups.poi[defaultDimension],
        this.groups.players[defaultDimension],
      ]
    })
  
    // L.control.layers(groups.base).addTo(map)
  
    this.map.on('baselayerchange', e => {
      console.log('CHANGE', e)
      configureMap(e.name)
    })
  
    this.configureMap(defaultDimension)
  }
  
  configureMap = (dimension) => {
    const props = this.mapConfigs[dimension].properties
    const msr = getMeasurementsFromProperties(props)
    this.map.setMinZoom(props.minZoom + msr.zoomOffset)
    this.map.setMaxZoom(props.maxZoom + msr.zoomOffset)
    this.map.setView([0, 0], props.defaultZoom + msr.zoomOffset)
    const northWest = this.map.unproject([msr.minMapX, msr.minMapY], this.map.getMaxZoom())
    const southEast = this.map.unproject([msr.minMapX + msr.mapWidth, msr.minMapY + msr.mapHeight], this.map.getMaxZoom())
    this.map.setMaxBounds(new L.LatLngBounds(northWest, southEast))
  }

  changeDimension = dimension => {
    for (const group of Object.values(this.groups)) {
      this.map.removeLayer(group[this.dimension])
      this.map.addLayer(group[dimension])
    }
    this.configureMap(dimension)
    this.dimension = dimension
  }
}

