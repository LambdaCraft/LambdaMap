import L from 'leaflet'

import './L.TileLayer.NoGap'

export default class WebMap {
  constructor(server, configs, selected, renderTarget) {
    this.groups = {
      base: {},
      poi: {},
      players: {},
    }
    this.server = server
    this.configs = configs
    this.selected = selected
    this.dimension = this.configs[selected].dimension
  
    const dimensions = new Set()
    for (const map of Object.keys(configs)) {
      const layers = [
        this.createBaseLayer(map)
      ]
      this.groups.base[map] = L.layerGroup(layers)
      dimensions.add(configs[map].dimension)
    }
    for (const dimension of dimensions) {
      this.groups.players[dimension] = new L.LayerGroup()
      this.groups.poi[dimension] = new L.LayerGroup()
    }
  
    this.map = L.map(renderTarget, {
      crs: L.CRS.Simple,
      maxBoundsViscosity: 1.0,
      layers: [
        this.groups.base[this.selected],
        this.groups.poi[this.dimension],
        this.groups.players[this.dimension],
      ],
    })
  
    this.map.on('baselayerchange', e => {
      console.log('CHANGE', e)
      this.configureMap(e.name)
    })
  
    this.configureMap()
  }

  createBaseLayer(map) {
    const tileLayer = L.tileLayer(`/tiles/${map}/z.{z}/r.{x}.{y}.png`, {
      attribution: 'LambdaCraft',
      maxZoom: 1.6,
      maxNativeZoom: 0,
      minZoom: this.configs[map].minZoom,
      tileSize: this.configs[map].tileSize,
      zoomOffset: 0,
      defaultZoom: 0,
      bounds: this.getMapBounds(map),
      detectRetina: false,
      updateWhenZooming: false,
    })

    return tileLayer
  }

  selectTiles = sel => {
    const dimension = this.configs[sel].dimension
    console.log('REMOVING', this.selected, this.dimension)
    this.map.removeLayer(this.groups.base[this.selected])
    this.map.removeLayer(this.groups.players[this.dimension])
    this.map.removeLayer(this.groups.poi[this.dimension])
    console.log('ADDING', sel, dimension)
    this.map.addLayer(this.groups.base[sel])
    this.map.addLayer(this.groups.players[dimension])
    this.map.addLayer(this.groups.poi[dimension])
    this.selected = sel
    this.dimension = dimension
    this.configureMap(this.selected)
  }

  configureMap() {
    this.map.setMaxBounds(this.getMapBounds(this.selected))
    this.map.setView([0,0], 0)
  }

  getMapBounds(sel) {
    const cfg = this.configs[sel]
    const ts = cfg.tileSize

    const minMapX = cfg.regions.minX * ts
    const minMapY = cfg.regions.minZ * ts
    const mapWidth = (cfg.regions.maxX + 1 - cfg.regions.minX) * ts
    const mapHeight = (cfg.regions.maxZ + 1 - cfg.regions.minZ) * ts
    const bounds = [[
      minMapX, minMapY
    ],[
      minMapX + mapWidth, minMapY + mapHeight
    ]]

    console.log(sel, cfg.regions, bounds)
    return bounds
  }
}