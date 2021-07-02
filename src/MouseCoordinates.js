import React from 'react'
import { useLeaflet } from 'react-leaflet'
import styled from 'styled-components'
import throttle from 'lodash/throttle'

const DisplayBox = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 500;
  margin: 15px;
  margin-bottom: 40px;
  color: white;
  background: rgba(0,0,0,.24);
  padding: 5px 10px;
  font-size: 16px;
`

const MouseCoordinates = React.memo(() => {
  const [coord, setCoord] = React.useState('X: ?, Z: ?');
  const { map } = useLeaflet()
  const cb = React.useCallback(throttle(function(evt) {
    const { lat, lng } = evt.latlng
    setCoord(`X: ${Math.round(lng)}, Z: ${-Math.round(lat)}`)
  }, 16), [])
  
  React.useEffect(() => {
    map.addEventListener('mousemove', cb)
    return () => {
      map.removeEventListener('mousemove', cb)
    }
  }, [])

  return (
    <DisplayBox>
      { coord }
    </DisplayBox>
  )
})

export default MouseCoordinates