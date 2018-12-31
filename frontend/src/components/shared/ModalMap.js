import React from 'react'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = 'pk.eyJ1IjoiY29uc2Vuc3lzIiwiYSI6ImNqOHBmY2w0NjBmcmYyd3F1NHNmOXJwMWgifQ.8-GlTlTTUHLL8bJSnK2xIA'

class Map extends React.Component {
  constructor () {
    super()
    this.state = {}
  }
  componentDidMount () {
    const map = new mapboxgl.Map({
      container: this.mapContainer2,
      style: 'mapbox://styles/mapbox/streets-v10'
    })
    map.setCenter(this.props.location)
    map.setZoom(18)
    new mapboxgl.Marker()
      .setLngLat(this.props.location)
      .addTo(map)
    this.setState({ map })
  }
  componentWillUnmount () {
    this.state.map.remove()
  }
  render () {
    return (
      <div id='map' style={{ width: 375, height: 375, textAlign: 'left', overflow: 'hidden', position: 'relative' }} ref={el => { this.mapContainer2 = el }} />
    )
  }
}

export default Map
