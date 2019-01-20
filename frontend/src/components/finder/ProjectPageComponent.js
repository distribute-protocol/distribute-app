import React from 'react'
import { Card, Button, Progress } from 'antd'
import moment from 'moment'
import Map from '../shared/Map'
import FundingStatus from './FundingStatus'
import fillercardimage from '../../images/fillercardimage.svg'
import { grey1, color3, color4 } from '../../styles/colors'
import { font1 } from '../../styles/fonts'
import { web3, P } from '../../utilities/blockchain'

export default (props) => {
  //let { project, ethPrice } = props
  let ethPrice = 132.34

  let project = {
    address: '0xA4AE3a0cebE0Eb5AB4EC4a541d8F2BF7a14C9B3A',
    weiCost: web3.toWei('1', 'ether'),
    weiBal: web3.toWei('.25', 'ether'),
    reputationBalance: 20000,
    reputationCost: 100000,
    nextDeadline: 1548070343,
    location: [],
    funders: [],
    supporters: [],
    photo: null,
    description: `Morbi fringilla lorem ipsum, ac maximus neque ornare eget. Nulla facilisi.
    Integer velit orci, pellentesque sed est eu, ultrices elementum tortor.
    Vivamus quis mauris fringilla, pulvinar nibh vitae, sagittis ex.
    Proin ut nunc at felis gravida mollis. Fusce lectus lorem,
    faucibus vel nisl a, finibus feugiat nulla. In hac habitasse platea dictumst.
    Ut scelerisque maximus felis et vestibulum.`
  }
  // let projectInstance = Project.at(project.address)
  let usdPerEth = { price: 132.34 }
  let amount = (web3.fromWei(project.weiCost, 'ether') * ethPrice).toFixed(2)
  return (
    <div style={{ marginLeft: 60, display: 'flex', alignItems: 'center', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ width: '70vw', backgroundColor: 'white', minHeight: '100vh' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' }}>
          <div style={{ height: 500, width: 400, flex: 1, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
            {typeof project === 'undefined' && project.photo !== null
              ? <div>
                <img style={{ height: 500, width: 400 }} src={project.photo} alt='projectPhoto' />
              </div>
              : <div>
                <img style={{ height: 500, width: 400 }} src={fillercardimage} alt='projectPhoto' />
                <p style={{ fontFamily: font1, fontSize: 24, color: 'black', margin: 0 }}>
                  Initiator: <span style={{ marginLeft: 10 }}>
                    <img style={{ height: 36, width: 36, borderRadius: 18 }} src={fillercardimage} alt='initiatorPhoto' />
                  </span>
                </p>
              </div>
            }
          </div>
          <div style={{ height: 500, width: 400, flex: 1, flexDirection: 'column', padding: 20, marginTop: 30, paddingTop: 0 }}>
            <Progress strokeWidth={20} style={{ fontFamily: 'Arimo', fontSize: 12, width: '33vw' }} strokeColor={color3} strokeLinecap='square' percent={parseInt(project.weiBal) / parseInt(project.weiCost) * 100} showInfo={false} />
            <p style={{ fontFamily: font1, fontSize: 32, color: color3, margin: 0, marginTop: 15 }}>${isNaN(amount) ? 0 : amount}</p>
            <p style={{ fontFamily: font1, fontSize: 24, color: 'black', margin: 0, marginBottom: 10 }}>staked out of <span style={{ fontFamily: font1, fontWeight: '400', fontSize: 24 }}>{(web3.fromWei(project.weiCost, 'ether') * ethPrice).toFixed(2)}</span> goal</p>
            <FundingStatus fundingType={'Token'} project={project} usdPerEth={usdPerEth} participants={project.funders} />
            <Progress strokeWidth={20} style={{ fontFamily: 'Arimo', fontSize: 12, width: '33vw', marginTop: 15 }} strokeColor={color4} strokeLinecap='square' percent={project.reputationBalance / project.reputationCost * 100} showInfo={false} />
            <p style={{ fontFamily: font1, fontSize: 32, color: color4, margin: 0, marginTop: 15 }}>{project.reputationBalance}</p>
            <p style={{ fontFamily: font1, fontSize: 24, color: 'black', margin: 0, marginBottom: 10 }}>staked out of <span style={{ fontFamily: font1, fontWeight: '400', fontSize: 24 }}>{project.reputationCost}</span> goal</p>
            <FundingStatus fundingType={'Reputation'} project={project} usdPerEth={usdPerEth} participants={project.supporters} />
            <p style={{ fontFamily: font1, fontSize: 24, color: 'black', margin: 0 }}>
              Expires {moment(parseInt(project.nextDeadline * 1000)).fromNow()}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', marginTop: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: 500, width: 400, flex: 1, paddingLeft: 20 }}>
            <h3 style={{ fontSize: 24, fontFamily: font1, marginTop: 15 }}>
              Description
            </h3>
            <p style={{ paddingRight: 30 }}>{project.description}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', height: 500, width: 400, flex: 1, paddingRight: 20 }}>
            <h3 style={{ fontSize: 24, fontFamily: font1, marginTop: 15 }}>
              Location
            </h3>
            {project !== undefined && project.location.length === 2
              ? <Map
                lngLat={project.location} />
              : <div style={{ height: 400, width: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <p style={{ fontFamily: 'Lato', fontSize: 16, color: 'black', width: 400, textAlign: 'center' }}>
                 This project was not proposed with a location.
                </p>
              </div>
            }
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', marginTop: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: 400, flex: 1, paddingLeft: 20 }}>
            <h3 style={{ fontSize: 24, fontFamily: font1, marginTop: 15 }}>
              Timeline
            </h3>
            <div style={{ height: 100, width: 400, margin: 20, marginTop: 10, marginBottom: 10, borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 1px rgba(0, 0, 0, 0.25)', border: `1px solid ${grey1}` }}>
              Event #1
            </div>
            <div style={{ height: 100, width: 400, margin: 20, marginTop: 10, marginBottom: 10, borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 1px rgba(0, 0, 0, 0.25)', border: `1px solid ${grey1}` }}>
              Event #2
            </div>
            <div style={{ height: 100, width: 400, margin: 20, marginTop: 10, marginBottom: 10, borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 1px rgba(0, 0, 0, 0.25)', border: `1px solid ${grey1}` }}>
              Event #3
            </div>
            <div style={{ height: 100, width: 400, margin: 20, marginTop: 10, marginBottom: 10, borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 1px rgba(0, 0, 0, 0.25)', border: `1px solid ${grey1}` }}>
              Event #4
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', width: 400, flex: 1, paddingLeft: 20 }}>
            <h3 style={{ fontSize: 24, fontFamily: font1, marginTop: 15 }}>
              Discussion
            </h3>
            <div style={{ height: 80, width: 400, margin: 20, marginTop: 10, marginBottom: 10, borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 1px rgba(0, 0, 0, 0.25)', border: `1px solid ${grey1}` }}>
              Discussion #1
            </div>
            <div style={{ height: 80, width: 400, margin: 20, marginTop: 10, marginBottom: 10, borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 1px rgba(0, 0, 0, 0.25)', border: `1px solid ${grey1}` }}>
              Discussion #2
            </div>
            <div style={{ height: 80, width: 400, margin: 20, marginTop: 10, marginBottom: 10, borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 1px rgba(0, 0, 0, 0.25)', border: `1px solid ${grey1}` }}>
              Discussion #3
            </div>
            <div style={{ height: 80, width: 400, margin: 20, marginTop: 10, marginBottom: 10, borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 1px rgba(0, 0, 0, 0.25)', border: `1px solid ${grey1}` }}>
              Discussion # 4
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
// <div>

//   {project !== undefined && project.name !== null
//     ? <p style={{fontFamily: 'Lato', fontSize: 20, color: 'black', marginTop: 50}}>{project.name}</p>
//     : <p style={{fontFamily: 'Lato', fontSize: 16, color: 'black', maxWidth: 400}}>
//       This project was not proposed with a name.
//     </p>
//   }
//   {project !== undefined && project.summary !== null
//     ? <p style={{fontFamily: 'Lato', fontSize: 16, color: 'black', maxWidth: 400}}>{project.summary}</p>
//     : <p style={{fontFamily: 'Lato', fontSize: 16, color: 'black', maxWidth: 400}}>
//       This project was not proposed with a description.
//     </p>
//   }
// </div>
// <div>
//   {project !== undefined
//     ? <FundingStatus fundingType={'Token'} project={project} usdPerEth={props.usdPerEth} />
//     : null
//   }
//   {project !== undefined
//     ? <FundingStatus fundingType={'Clout'} project={project} usdPerEth={props.usdPerEth} />
//     : null
//   }
//   {project !== undefined && project.nextDeadline !== null
//     ? <p style={{fontFamily: 'Lato', fontSize: 20, color: 'black'}}>
//       <b>{(Math.floor((project.nextDeadline - Date.now()) / 86400000))}</b> days to go
//     </p>
//     : <p style={{fontFamily: 'Lato', fontSize: 20, color: 'black'}}><b>...</b> days to go</p>
//   }
//   <p style={{fontFamily: 'Lato', fontSize: 20, color: 'black'}}>Location</p>
// </div>
