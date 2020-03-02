import React from 'react'
import styled from 'styled-components'

const DRAWER_WIDTH = 200

const Drawer = styled.div`
  position: fixed;
  height: 100vh;
  width: ${DRAWER_WIDTH}px;
  top: 0;
  right: 0;
  padding: 0 15px;
  background-color: rgba(0,0,0,0.6);
  z-index: 500;
  color: #999;

  & h3 {
    color: white;
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
}) => {
  // const [open, setOpen] = React.useState(true)

  return (
    <Drawer>
      <h3>Maps</h3>
      <ul>
        {maps.map(name =>
          <ListItem
            key={name}
            onClick={() => onMapChange(name)}
            active={currentMap === name}
          >
            {name}
          </ListItem>
        )}
      </ul>
      <h3>Online</h3>
      <ul>
        {players.map(p =>
          <PlayerListItem
            key={p.UUID}
            name={p.Name}
            uuid={p.UUID}
            active={p.Dimension.split(':')[1] === currentMap}
          />  
        )}
      </ul>
    </Drawer>
  )
}

export default Sidebar