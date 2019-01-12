import React from 'react'
import { Card, Button, Progress } from 'antd'
import Map from '../shared/Map'
import FundingStatus from './FundingStatus'
import fillercardimage from '../../images/fillercardimage.svg'
import { color3, color4 } from '../../styles/colors'
import { font1 } from '../../styles/fonts'
import { web3 } from '../../utilities/blockchain'

export default (props) => {
  let { project } = props
  let amount = (web3.fromWei(project.weiCost, 'ether') * props.ethPrice).toFixed(2)
  console.log(amount)
  return (
    <div style={{ marginLeft: 60, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <div style={{ width: '70vw', backgroundColor: 'white', minHeight: '100vh' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' }}>
          <div style={{ height: 500, width: 400, flex: 1, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
            {typeof props.project === 'undefined' && props.project.photo !== null
              ? <img style={{ height: 500, width: 400 }} src={props.project.photo} alt='projectPhoto' />
              : <img style={{ height: 500, width: 400 }} src={fillercardimage} alt='projectPhoto' />
            }
          </div>
          <div style={{ height: 500, width: 400, flex: 1, flexDirection: 'column', padding: 20 }}>
            <Progress strokeWidth={20} style={{ fontFamily: 'Arimo', fontSize: 12, width: '33vw' }} strokeColor={color3} strokeLinecap='square' percent={parseInt(project.weiBal) / parseInt(project.weiCost) * 100} showInfo={false} />
            <p style={{ fontFamily: font1, fontSize: 32, color: color3, margin: 0 }}>${isNaN(amount) ? 0 : amount}</p>
            <p style={{ fontFamily: font1, fontSize: 24, color: 'black', margin: 0 }}>staked out of <span style={{ fontFamily: font1, fontWeight: '400', fontSize: 24 }}>{(web3.fromWei(project.weiCost, 'ether') *  props.ethPrice).toFixed(2)}</span> goal</p>
            <Progress strokeWidth={20} style={{ fontFamily: 'Arimo', fontSize: 12, width: '33vw' }} strokeColor={color4} strokeLinecap='square' percent={50} showInfo={false} />
            <p style={{ fontFamily: font1, fontSize: 32, color: color4, margin: 0 }}>{project.reputationBalance}</p>
            <p style={{ fontFamily: font1, fontSize: 24, color: 'black', margin: 0 }}>staked out of <span style={{ fontFamily: font1, fontWeight: '400', fontSize: 24 }}>{project.reputationCost}</span> goal</p>

          </div>
        </div>
        {props.project !== undefined && props.project.location.length === 2
          ? <Map
            lngLat={props.project.location} />
          : <div style={{ height: 500, width: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <p style={{ fontFamily: 'Lato', fontSize: 16, color: 'black', width: 400, textAlign: 'center' }}>
              This project was not proposed with a location.
            </p>
          </div>
        }
      </div>
    </div>
  )
}
// <div>

//   {props.project !== undefined && props.project.name !== null
//     ? <p style={{fontFamily: 'Lato', fontSize: 20, color: 'black', marginTop: 50}}>{props.project.name}</p>
//     : <p style={{fontFamily: 'Lato', fontSize: 16, color: 'black', maxWidth: 400}}>
//       This project was not proposed with a name.
//     </p>
//   }
//   {props.project !== undefined && props.project.summary !== null
//     ? <p style={{fontFamily: 'Lato', fontSize: 16, color: 'black', maxWidth: 400}}>{props.project.summary}</p>
//     : <p style={{fontFamily: 'Lato', fontSize: 16, color: 'black', maxWidth: 400}}>
//       This project was not proposed with a description.
//     </p>
//   }
// </div>
// <div>
//   {props.project !== undefined
//     ? <FundingStatus fundingType={'Token'} project={props.project} usdPerEth={props.usdPerEth} />
//     : null
//   }
//   {props.project !== undefined
//     ? <FundingStatus fundingType={'Clout'} project={props.project} usdPerEth={props.usdPerEth} />
//     : null
//   }
//   {props.project !== undefined && props.project.nextDeadline !== null
//     ? <p style={{fontFamily: 'Lato', fontSize: 20, color: 'black'}}>
//       <b>{(Math.floor((props.project.nextDeadline - Date.now()) / 86400000))}</b> days to go
//     </p>
//     : <p style={{fontFamily: 'Lato', fontSize: 20, color: 'black'}}><b>...</b> days to go</p>
//   }
//   <p style={{fontFamily: 'Lato', fontSize: 20, color: 'black'}}>Location</p>
// </div>
