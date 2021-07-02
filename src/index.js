// import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React from 'react'
import PropTypes from 'react-proptypes'
import styled from 'styled-components'
import L from 'leaflet'
import { Map as LMap, Marker, Tooltip, TileLayer, useLeaflet } from 'react-leaflet'

import Sidebar from './Sidebar'
import MouseCoordinates from './MouseCoordinates'

const Container = styled.div`
  height: 100%;
  background-color: #000;
  position: relative;

  & .icon-shadow {
    filter: drop-shadow(3px 5px 5px #222);
  }
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

const calcLeafletBoundsFromRegBounds = (regionBounds, tileSize, pad = 0.75) => {
  const{ minX, maxX, minZ, maxZ } = regionBounds
  const minMapX = minX * tileSize
  const minMapY = minZ * tileSize
  const mapWidth = (maxX + 1 - minX) * tileSize
  const mapHeight = (maxZ + 1 - minZ) * tileSize
  return L.latLngBounds(
    L.latLng(minMapY, minMapX),
    L.latLng(minMapY + mapHeight, minMapX + mapWidth)
  ).pad(pad)
}

const TileLayerWrapper = (props) => {
  const { map } = useLeaflet()

  React.useEffect(() => {
    map.options.minZoom = props.minZoom

    if (props.defaultZoom !== undefined) {
      map.setView(props.defaultCenter || [0,0], props.defaultZoom)
    } else {
      map.fitBounds(props.bounds)
    }
  }, [props.bounds, props.defaultCenter, props.defaultZoom, props.minZoom])

  return <TileLayer {...props} />
}

export const LambdaMap = ({
  serverAPIURI,
  pollInterval,
  tilesURI,
  maps,
  ...props
}) => {
  const [configs, setConfigs] = React.useState(null)
  const [players, setPlayers] = React.useState([])
  const [error, setError] = React.useState(null)
  const [selectedMap, setSelectedMap] = React.useState(props.selectedMap || maps[0])

  // Fetch map properties for server and dimension
  React.useEffect(() => {
    const abortControl = new AbortController();
    let errorWait = 1000
    const fetchAll = async () => {
      const configs = {}
      try {
        const properties = await Promise.all(maps.map(name => 
          fetchJSON(
            `${tilesURI}/${name}/tile.properties.json`,
            {signal: abortControl.signal}
          ).then(props => [name, props]))
        )
        properties.forEach(([name, props]) => {
          configs[name] = props
        })
        setConfigs(configs)
        errorWait = 1000
      } catch(e) {
        console.warn('Failed to get map properties')
        setTimeout(() => fetchAll(), errorWait)
        errorWait = Math.min(20000, errorWait * (Math.random()*0.5+1.75))
      }
    }

    fetchAll()
    return () => {
      abortControl.abort()
    }
  }, [maps])

  React.useEffect(() => {
    const fetchStatus = async () => {
      try {
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
        setError(null)
      } catch(err) {
        setError('Could not get player status')
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, pollInterval*1000)
    return () => clearInterval(interval)
  }, [])

  const bounds = React.useMemo(() => {
    if (!configs) return
    const cfg = configs[selectedMap]
    return calcLeafletBoundsFromRegBounds(cfg.regions, cfg.tileSize)
  }, [selectedMap, configs])

  return configs ? (
    <Container>
      <style>{".leaflet-container { height: 100%; background-color: #000; }"}</style>
      <LMap
        crs={L.CRS.Simple}
        zoom={0}
        center={[0,0]}
        maxBounds={bounds}
        maxBoundsViscosity={0.0}
      >
        <TileLayerWrapper
          url={`${tilesURI}/${selectedMap}/z.{z}/r.{x}.{y}.png`}
          attribution=""
          zoomOffset={0}
          maxZoom={1.6}
          maxNativeZoom={0}
          minZoom={configs[selectedMap].minZoom}
          tileSize={configs[selectedMap].tileSize}
          detectRetina={false}
          updateWhenZooming={false}
          bounds={bounds}
          defaultZoom={configs[selectedMap].default?.zoom}
          defaultCenter={configs[selectedMap].default?.center}
        />
        <PlayerMarkers players={players} dimension={configs[selectedMap].dimension} />

        <MouseCoordinates />
        <Sidebar
          players={players}
          maps={maps.map(id => ({
            name: configs[id].mapName,
            dimension: configs[id].dimension,
            id,
          }))}
          error={error}
          onMapChange={sel => {
            setSelectedMap(sel)
          }}
          currentMap={selectedMap}
        />
      </LMap>
    </Container>
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
