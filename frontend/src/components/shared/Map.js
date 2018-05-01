import React, { Component } from 'react'
import mapboxgl from 'mapbox-gl'
mapboxgl.accessToken = 'pk.eyJ1IjoiY29uc2Vuc3lzIiwiYSI6ImNqOHBmY2w0NjBmcmYyd3F1NHNmOXJwMWgifQ.8-GlTlTTUHLL8bJSnK2xIA'

class Map extends Component {
  constructor () {
    super()
    this.state = {}
  }
  componentDidMount () {
    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v10',
      interactive: false
    })
    map.setCenter(this.props.lngLat)
    map.setZoom(18)
    this.setState({map: map})
  }

  componentWillReceiveProps (np) {
    if (typeof np.lngLat !== 'undefined') {
      this.state.map.setCenter(np.lngLat)
      if (typeof this.state.marker === 'undefined') {
        const marker = new mapboxgl.Marker()
          .setLngLat(np.lngLat)
          .addTo(this.state.map)
        this.setState({marker})
      }
    }
  }

  componentWillUnmount () {
    this.state.map.remove()
  }

  render () {
    return (
      <div id='map' style={{width: 300, height: 300}} ref={el => { this.mapContainer = el; return }} />
    )
  }
}

export default Map
