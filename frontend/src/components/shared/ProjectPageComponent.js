import React from 'react'
import Map from './Map'
import fillercardimage from '../../images/fillercardimage.svg'

export default (
  project
) => {
  return (
    <div style={{paddingLeft: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 45}}>
      <div>
        <img style={{maxHeight: 500, maxWidth: 400, marginTop: -115}} src={fillercardimage} alt='projectPhoto' />
        <p style={{fontFamily: 'Lato', fontSize: 24, color: 'black', marginTop: 50}}>Project Description</p>
        <p style={{fontFamily: 'Lato', fontSize: 18, color: 'black', maxWidth: 400}}>
          t Morbi fringilla lorem ipsum, ac maximus neque ornare eget. Nulla facilisi. Integer velit orci,
          pellentesque sed est eu, ultrices elementum tortor. Vivamus quis mauris fringilla, pulvinar nibh vitae, sagittis ex. Proin ut nunc at felis gravida mollis. Fusce lectus lorem, faucibus vel nisl a, finibus feugiat nulla. In hac habitasse platea dictumst. Ut scelerisque maximus felis et vestibulum.
        </p>
      </div>
      <div>
        <div style={{height: 240, width: 500, border: '1px solid black', marginBottom: 10}}>token info</div>
        <div style={{height: 240, width: 500, border: '1px solid black', marginBottom: 10}}>reputation info</div>
        <p style={{fontFamily: 'Lato', fontSize: 24, color: 'black'}}>Location</p>
        <Map lngLat={[100, 30]} />
      </div>
    </div>
  )
}
