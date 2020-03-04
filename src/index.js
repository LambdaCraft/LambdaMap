// import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React from 'react'
import PropTypes from 'react-proptypes'
import styled from 'styled-components'
import L from 'leaflet'
import { Map as LMap, Marker, Tooltip, TileLayer } from 'react-leaflet'

import Sidebar from './Sidebar'

const Stretch = styled.div`
  height: 100%;
  background-color: #000;
  position: relative;
`

const fetchJSON = (...args) => fetch(...args).then(r => r.json())
const getPlayerName = p => `${p.IsBot ? '[Bot]' : ''}${p.Name}`

const PlayerMarkers = ({ players, dimension }) => {
  return (
    <React.Fragment>
      {players.filter(p => dimension === p.dimension).map(p =>
        <Marker position={p.markerPosition} icon={p.icon} key={p.name}>
          <Tooltip>{p.name}</Tooltip>
        </Marker>
      )}
    </React.Fragment>
  )
}

export const LambdaMap = ({
  serverAPIURI,
  pollInterval,
  tilesURI,
  ...props
}) => {
  const mapRef = React.useRef(null)
  const [maps] = React.useState(props.maps)
  const [configs, setConfigs] = React.useState(null)
  const [players, setPlayers] = React.useState([])
  const [selectedMap, setSelectedMap] = React.useState(props.selectedMap || maps[0])

  // Fetch map properties for server and dimension
  React.useEffect(() => {
    const abortControl = new AbortController();
    const fetchAll = async () => {
      const configs = {}
      for (let i = 0; i < maps.length; i++) {
        const properties = await fetchJSON(
          `${tilesURI}/${maps[i]}/tile.properties.json`,
          {signal: abortControl.signal}
        )
        configs[maps[i]] = properties
      }
      console.log(configs)
      setConfigs(configs)
    }

    fetchAll()
    return () => {
      abortControl.abort()
    }
  }, [maps])

  React.useEffect(() => {
    const fetchStatus = async () => {
      const status = await fetchJSON(serverAPIURI)
      const players = status.Players

      const mapped = players.map(p => ({
        ...p,
        icon: L.icon({
          iconUrl: `https://crafatar.com/renders/body/${p.UUID.replace('-','')}?scale=1`,
          iconSize: [20, 45],
          iconAnchor: [10, 45],
          className: 'icon-shadow'
        }),
        markerPosition: [-p.Z, p.X],
        position: [p.X, p.Z],
        dimension: p.Dimension.split(':')[1],
        name: `${getPlayerName(p)}: (${Math.round(p.X)}, ${Math.round(p.Z)})`,
      }))

      setPlayers(mapped)
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 20000)
    return () => clearInterval(interval)
  }, [])

  const getMapBounds = sel => {
    const cfg = configs[sel]
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

    return bounds
  }

  React.useEffect(() => {
    if (!mapRef.current) return
    const leafmap = mapRef.current.leafletElement
    leafmap.options.minZoom = configs[selectedMap].minZoom
    leafmap.setView([0,0], 0)
  }, [mapRef.current, selectedMap])

  return configs ? (
    <Stretch>
      <style>{".leaflet-container { height: 100%; background-color: #000; }"}</style>
      <LMap
        ref={mapRef}
        crs={L.CRS.Simple}
        center={[0,0]}
        zoom={0}
        maxBounds={getMapBounds(selectedMap)}
      >
        <TileLayer
          url={`${tilesURI}/${selectedMap}/z.{z}/r.{x}.{y}.png`}
          attribution=""
          zoomOffset={0}
          maxZoom={1.6}
          maxNativeZoom={0}
          minZoom={configs[selectedMap].minZoom}
          tileSize={configs[selectedMap].tileSize}
          detectRetina={false}
          updateWhenZooming={false}
          bounds={getMapBounds(selectedMap)}
        />
        <PlayerMarkers players={players} dimension={configs[selectedMap].dimension} />
      </LMap>
      <Sidebar
        players={players}
        maps={maps}
        onMapChange={sel => {
          setSelectedMap(configs[sel].mapName)
        }}
        currentMap={selectedMap}
      />
    </Stretch>
  ) :  null
}

LambdaMap.propTypes = {
  serverAPIURI: PropTypes.string.isRequired,
  maps: PropTypes.arrayOf(PropTypes.string),
  selectedMap: PropTypes.string,
  tilesURI: PropTypes.string,
  pollInterval: PropTypes.number,
}

LambdaMap.defaultProps = {
  tilesURI: '/tiles',
  pollInterval: 3,
}
