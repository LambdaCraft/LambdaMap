import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import L from 'leaflet'

import Sidebar from './Sidebar'
import Unmined from './unmined'

const Stretch = styled.div`
  height: 100%;
  background-color: #000;
`

const fetchJSON = (...args) => fetch(...args).then(r => r.json())
const getPlayerName = p => `${p.IsBot ? '[Bot]' : ''}${p.Name}`

export const App = ({
  serverAPIURI
}) => {
  const defaultDimension = 'overworld'

  const containerEl = React.useRef()
  const [server, setServer] = React.useState('tech')
  const [dimensions, setDimensions] = React.useState(
    [
      'overworld',
      'the_end',
    ]
  )
  const [mapConfigs, setMapConfigs] = React.useState(null)
  const [players, setPlayers] = React.useState([])
  const [unmined, setUnmined] = React.useState(null)
  const [dimension, setDimension] = React.useState(defaultDimension)

  // Fetch map properties for server and dimension
  React.useEffect(() => {
    const abortControl = new AbortController();
    const fetchAll = async () => {
      const configs = {}
      for (let i = 0; i < dimensions.length; i++) {
        const [properties, regions] = await Promise.all([
          fetchJSON(`${server}/${dimensions[i]}/unmined.map.properties.json`, {signal: abortControl.signal}),
          fetchJSON(`${server}/${dimensions[i]}/unmined.map.regions.json`, {signal: abortControl.signal}),
        ])
        configs[dimensions[i]] = { properties, regions }
      }
      setMapConfigs(configs)
    }

    fetchAll();
    return () => {
      abortControl.abort()
    }
  }, [server, dimensions])

  // Create and render map
  React.useEffect(() => {
    if (!containerEl.current || !mapConfigs) return

    const unmined = new Unmined(
      server,
      mapConfigs,
      defaultDimension,
      containerEl.current,
    )

    setUnmined(unmined)
  }, [containerEl.current, mapConfigs])

  React.useEffect(() => {
    if (!unmined || !serverAPIURI) return;
    const fetchStatus = async () => {
      const status = await fetchJSON(serverAPIURI)
      const players = status.Players
      setPlayers(players)
      Object.values(unmined.groups.players).forEach(dim => dim.clearLayers())

      players.forEach(p => {
        const icon = L.icon({
          iconUrl: `https://crafatar.com/renders/body/${p.UUID.replace('-','')}?scale=1`,
          iconSize: [20, 45],
          iconAnchor: [10, 45],
          className: 'icon-shadow'
        })
        const coord = unmined.map.unproject([p.X, p.Z], unmined.map.getMaxZoom())
        const marker = L.marker(coord, { icon })
          .bindTooltip(`${getPlayerName(p)}: (${Math.round(p.X)}, ${Math.round(p.Z)})`)
        
        const playerDimension = p.Dimension.split(':')[1]
        if (unmined.groups.players[playerDimension]) {
          marker.addTo(unmined.groups.players[playerDimension])
        }
      })
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 20000)

    return () => clearInterval(interval)
  }, [unmined])

  return (
    <React.Fragment>
      <Stretch ref={containerEl}></Stretch>
      {unmined ? (
        <Sidebar
          players={players}
          maps={unmined.dimensions}
          onMapChange={sel => {
            unmined.changeDimension(sel)
            setDimension(sel)
          }}
          currentMap={dimension}
        />
      ) : null}
    </React.Fragment>
  )
}

export const renderTo = (domEl, props) => ReactDOM.render(<App {...props} />, domEl);
