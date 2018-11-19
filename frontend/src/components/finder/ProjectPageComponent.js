import React from 'react'
import Map from '../shared/Map'
import FundingStatus from './FundingStatus'
import fillercardimage from '../../images/fillercardimage.svg'

export default (props) => {
  return (
    <div style={{paddingLeft: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', paddingTop: 45, paddingBottom: 30}}>
      <div>
        {props.project !== undefined && props.project.photo !== null
          ? <img style={{maxHeight: 500, maxWidth: 400}} src={props.project.photo} alt='projectPhoto' />
          : <img style={{maxHeight: 500, maxWidth: 400}} src={fillercardimage} alt='projectPhoto' />
        }
        {props.project !== undefined && props.project.name !== null
          ? <p style={{fontFamily: 'Lato', fontSize: 20, color: 'black', marginTop: 50}}>{props.project.name}</p>
          : <p style={{fontFamily: 'Lato', fontSize: 16, color: 'black', maxWidth: 400}}>
            This project was not proposed with a name.
          </p>
        }
        {props.project !== undefined && props.project.summary !== null
          ? <p style={{fontFamily: 'Lato', fontSize: 16, color: 'black', maxWidth: 400}}>{props.project.summary}</p>
          : <p style={{fontFamily: 'Lato', fontSize: 16, color: 'black', maxWidth: 400}}>
            This project was not proposed with a description.
          </p>
        }
      </div>
      <div>
        {props.project !== undefined
          ? <FundingStatus fundingType={'Token'} project={props.project} usdPerEth={props.usdPerEth} />
          : null
        }
        {props.project !== undefined
          ? <FundingStatus fundingType={'Clout'} project={props.project} usdPerEth={props.usdPerEth} />
          : null
        }
        {props.project !== undefined && props.project.nextDeadline !== null
          ? <p style={{fontFamily: 'Lato', fontSize: 20, color: 'black'}}>
            <b>{(Math.floor((props.project.nextDeadline - Date.now()) / 86400000))}</b> days to go
          </p>
          : <p style={{fontFamily: 'Lato', fontSize: 20, color: 'black'}}><b>...</b> days to go</p>
        }
        <p style={{fontFamily: 'Lato', fontSize: 20, color: 'black'}}>Location</p>
        {props.project !== undefined && props.project.location.length <= 0
          ? <Map
            lngLat={props.project.location} />
          : <p style={{fontFamily: 'Lato', fontSize: 16, color: 'black', maxWidth: 500}}>
            This project was not proposed with a location.
          </p>
        }
      </div>
    </div>
  )
}
