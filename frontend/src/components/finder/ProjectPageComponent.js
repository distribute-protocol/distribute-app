import React from 'react'
import Map from '../shared/Map'
import fillercardimage from '../../images/fillercardimage.svg'

export default (
  project
) => {
  return (
    <div style={{paddingLeft: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', paddingTop: 45, paddingBottom: 30}}>
      <div>
        {project.project !== undefined && project.project.photo !== null
          ? <img style={{maxHeight: 500, maxWidth: 400, marginTop: -115}} src={project.project.photo} alt='projectPhoto' />
          : <img style={{maxHeight: 500, maxWidth: 400, marginTop: -115}} src={fillercardimage} alt='projectPhoto' />
        }
        <p style={{fontFamily: 'Lato', fontSize: 24, color: 'black', marginTop: 50}}>Project Description</p>
        {project.project !== undefined && project.project.summary !== null
          ? <p style={{fontFamily: 'Lato', fontSize: 18, color: 'black', maxWidth: 400}}>{project.project.summary}</p>
          : <p style={{fontFamily: 'Lato', fontSize: 18, color: 'black', maxWidth: 400}}>
            This project was not proposed with a description.
          </p>
        }
      </div>
      <div>
        <div style={{height: 240, width: 500, border: '1px solid black', marginBottom: 10}}>token info</div>
        <div style={{height: 240, width: 500, border: '1px solid black', marginBottom: 10}}>reputation info</div>
        {project.project !== undefined && project.project.nextDeadline !== null
          ? <p style={{fontFamily: 'Lato', fontSize: 24, color: 'black'}}>
            <b>{(Math.floor((project.project.nextDeadline - Date.now()) / 86400000))}</b>
             days to go
          </p>
          : <p style={{fontFamily: 'Lato', fontSize: 24, color: 'black'}}><b>...</b> days to go</p>
        }
        <p style={{fontFamily: 'Lato', fontSize: 24, color: 'black'}}>Location</p>
        {project.project !== undefined && project.project.location !== null
          ? <Map
            lngLat={project.project.location} />
          : <p style={{fontFamily: 'Lato', fontSize: 18, color: 'black', maxWidth: 500}}>
            This project was not proposed with a location.
          </p>
        }
      </div>
    </div>
  )
}
