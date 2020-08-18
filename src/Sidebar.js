import React from 'react'
import styled from 'styled-components'
import { MdErrorOutline } from 'react-icons/md'
import { useLeaflet } from 'react-leaflet'

const DRAWER_WIDTH = 200

const Drawer = styled.div`
  position: absolute;
  box-sizing: border-box;
  height: 100%;
  width: ${DRAWER_WIDTH}px;
  top: 0;
  right: 0;
  padding: 0 15px;
  background-color: rgba(0,0,0,0.6);
  z-index: 500;
  color: #999;
  cursor: default;

  & h3 {
    color: white;
    font-size: 18px;
    & svg {
      vertical-align: text-top;
      cursor: help;
    }
  }
  transition: transform 0.25s ease;
  transform: translate3d(0,0,0);

  @media (max-width: 500px) {
    width: 100%;
    padding: 0 65px;
    ${props => !props.open ? `
      transform: translate3d(0,0,0);
    ` : `
      transform: translate3d(0,calc(100% - 32px),0);
    `}
  }
`

const Bar = styled.div`
  width: 150px;
  height: 2px;
  background-color: white;
  margin: 0 auto;
`

const ShowMore = styled((props) => (
  <div {...props}><Bar /></div>
))`
  padding: 15px 25px;
  margin: 0 auto;
  @media (min-width: 501px) {
    display: none;
  }
`

const Avatar = styled.img.attrs(({
  size = 24,
  uuid
}) => ({
  src: `https://crafatar.com/avatars/${uuid.replace('-', '')}?size=${size}`,
}))``

const ListItem = styled.li`
  list-style-type: none;
  display: flex;
  align-items: center;
  margin: 12px 0;
  font-size: 18px;

  ${props => props.active ? `color: #fff;` : ''}

  ${props => props.onClick ? `
    cursor: pointer;

    &:hover {
      color: #fff;
    }
  ` : ''}
`

const PlayerListItem = ({ name, uuid, ...rest }) => {
  return (
    <ListItem {...rest}>
      <Avatar uuid={uuid} aria-hidden="true" style={{marginRight: 10}} />
      { name }
    </ListItem>
  )
}

const Sidebar = ({
  players,
  maps,
  onMapChange,
  currentMap,
  error,
}) => {
  const [open, setOpen] = React.useState(true)
  const leaflet = useLeaflet()
  const cmap = maps.find(m => m.id === currentMap)

  return (
    <Drawer open={open}>
      <ShowMore onClick={() => setOpen(!open)} />
      <h3>Maps</h3>
      <ul>
        {maps.map(map =>
          <ListItem
            key={map.id}
            onClick={() => onMapChange(map.id)}
            active={cmap.id === map.id}
          >
            {map.name}
          </ListItem>
        )}
      </ul>
      <h3>Online { error ? <MdErrorOutline title={error} /> : null }</h3>
      <ul>
        {players.map(p =>
          <PlayerListItem
            onClick={p.dimension === cmap.dimension ? () => {
              leaflet.map.setView(p.markerPosition, 0)
            } : null}
            key={p.UUID}
            name={p.Name}
            uuid={p.UUID}
            active={p.dimension === cmap.dimension}
          />  
        )}
      </ul>
    </Drawer>
  )
}

export default Sidebar