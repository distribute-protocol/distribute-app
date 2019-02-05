import React from 'react'
import { Button, Progress } from 'antd'
import moment from 'moment'
import Map from '../shared/Map'
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
    <div style={{ marginLeft: 60, display: 'flex', alignItems: 'center', flexDirection: 'column', minHeight: '100vh', marginTop: 30 }}>
      <div style={{ minWidth: '70vw', backgroundColor: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ width: 400, flex: 1, flexDirection: 'column', alignItems: 'center', display: 'flex' }}>
            <div style={{ fontFamily: font1, fontSize: 20, fontWeight: '500', alignSelf: 'flex-start', marginTop: 15, marginLeft: 30 }}>Project Status: Funded</div>
            <div style={{ marginTop: 15, marginLeft: 35, marginRight: 35 }}>
              { typeof project === 'undefined' && project.photo !== null
                ? <img style={{ height: 400, width: 400 }} src={project.photo} alt='projectPhoto' />
                : <img style={{ height: 400, width: 400 }} src={fillercardimage} alt='projectPhoto' />
              }
              <p style={{ fontFamily: font1, fontSize: 20, color: 'black', margin: 0, marginTop: 15, marginLeft: 10 }}>
                Expires {moment(parseInt(project.nextDeadline * 1000)).fromNow()}
              </p>
              <p style={{ fontFamily: font1, fontSize: 20, color: 'black', margin: 0, marginTop: 10, marginLeft: 10 }}>
                Initiator: <span style={{ marginLeft: 10 }}>
                  <img style={{ height: 36, width: 36, borderRadius: 18 }} src={fillercardimage} alt='initiatorPhoto' />
                </span>
              </p>
              <p style={{ fontFamily: font1, fontSize: 20, color: 'black', margin: 0, marginTop: 10, marginLeft: 10 }}>
                Finders: <span style={{ marginLeft: 10 }}>
                  <img style={{ height: 36, width: 36, borderRadius: 18, marginRight: 15 }} src={fillercardimage} alt='initiatorPhoto' />
                  <img style={{ height: 36, width: 36, borderRadius: 18, marginRight: 15 }} src={fillercardimage} alt='initiatorPhoto' />
                  <img style={{ height: 36, width: 36, borderRadius: 18, marginRight: 15 }} src={fillercardimage} alt='initiatorPhoto' />
                  <img style={{ height: 36, width: 36, borderRadius: 18, marginRight: 15 }} src={fillercardimage} alt='initiatorPhoto' />
                </span>
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', height: 500, width: 400, flex: 1, paddingLeft: 20 }}>
              <h3 style={{ fontSize: 24, fontFamily: font1, marginTop: 15 }}>
                Description
              </h3>
              <p style={{ paddingRight: 30 }}>{project.description}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: 400, flex: 1, paddingLeft: 20 }}>
              <h3 style={{ fontSize: 24, fontFamily: font1, marginTop: 15 }}>
                Timeline
              </h3>
              <div style={{ height: 100, width: '85%', margin: 20, marginTop: 10, marginBottom: 10, borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 1px rgba(0, 0, 0, 0.25)', border: `1px solid ${grey1}` }}>
                Event #1
              </div>
              <div style={{ height: 100, width: '85%', margin: 20, marginTop: 10, marginBottom: 10, borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 1px rgba(0, 0, 0, 0.25)', border: `1px solid ${grey1}` }}>
                Event #2
              </div>
              <div style={{ height: 100, width: '85%', margin: 20, marginTop: 10, marginBottom: 10, borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 1px rgba(0, 0, 0, 0.25)', border: `1px solid ${grey1}` }}>
                Event #3
              </div>
              <div style={{ height: 100, width: '85%', margin: 20, marginTop: 10, marginBottom: 10, borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 1px rgba(0, 0, 0, 0.25)', border: `1px solid ${grey1}` }}>
                Event #4
              </div>
            </div>
          </div>
          <div style={{ height: 500, width: 400, flex: 1, flexDirection: 'column' }}>
            <div style={{ fontFamily: font1, fontSize: 20, fontWeight: '500', alignSelf: 'flex-start', marginTop: 15, marginLeft: 30 }}>Project Location</div>
            {project !== undefined && project.location.length === 2
              ? <Map
                lngLat={project.location} />
              : <div style={{ height: 400, width: 400, display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, marginTop: 20, marginRight: 35 }}>
                <p style={{ fontFamily: 'Lato', fontSize: 16, color: 'black', width: 400, textAlign: 'center' }}>
                 This project was not proposed with a location.
                </p>
              </div>
            }
            <div>
              <div style={{ fontFamily: font1, fontWeight: '500', fontSize: 20, marginLeft: 20, marginTop: 30 }}>Current Winning Plan:</div>
              <div style={{ border: '8px solid rgba(227, 105, 131, 0.3)', marginLeft: 20, marginRight: 20, padding: 15, paddingTop: 10, paddingBottom: 10 }}>
                <div>Details:</div>
                <div style={{ marginTop: 10 }}># of Tasks in Plan</div>
                <div style={{ fontFamily: font1, fontSize: 18, color: 'black', margin: 0, marginTop: 10 }}>
                  Submitter: <span style={{ marginLeft: 10 }}>
                    <img style={{ height: 30, width: 30, borderRadius: 15 }} src={fillercardimage} alt='initiatorPhoto' />
                  </span>
                </div>
                <div style={{ fontFamily: font1, fontSize: 18, color: 'black', margin: 0, marginTop: 10 }}>
                  Backers: <span style={{ marginLeft: 10 }}>
                    <img style={{ height: 26, width: 26, borderRadius: 13, marginRight: 10 }} src={fillercardimage} alt='initiatorPhoto' />
                    <img style={{ height: 26, width: 26, borderRadius: 13, marginRight: 10 }} src={fillercardimage} alt='initiatorPhoto' />
                    <img style={{ height: 26, width: 26, borderRadius: 13, marginRight: 10 }} src={fillercardimage} alt='initiatorPhoto' />
                    <img style={{ height: 26, width: 26, borderRadius: 13, marginRight: 10 }} src={fillercardimage} alt='initiatorPhoto' />
                  </span>
                </div>
                <div style={{ marginTop: 10 }}>
                  Current Weighting:
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Button>View</Button>
                  <Button>Boost</Button>
                </div>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: font1, fontWeight: '500', fontSize: 20, marginLeft: 20, marginTop: 30 }}>All Plans:</div>
              <div style={{ backgroundColor: 'rgba(227, 105, 131, 0.3)', marginLeft: 20, marginRight: 20, padding: 15, paddingTop: 10, paddingBottom: 10 }}>
                <div style={{ backgroundColor: 'white' }}>
                  <div>Details:</div>
                  <div style={{ marginTop: 10 }}># of Tasks in Plan</div>
                  <div style={{ fontFamily: font1, fontSize: 18, color: 'black', margin: 0, marginTop: 10 }}>
                    Submitter: <span style={{ marginLeft: 10 }}>
                      <img style={{ height: 30, width: 30, borderRadius: 15 }} src={fillercardimage} alt='initiatorPhoto' />
                    </span>
                  </div>
                  <div style={{ fontFamily: font1, fontSize: 18, color: 'black', margin: 0, marginTop: 10 }}>
                    Backers: <span style={{ marginLeft: 10 }}>
                      <img style={{ height: 26, width: 26, borderRadius: 13, marginRight: 10 }} src={fillercardimage} alt='initiatorPhoto' />
                      <img style={{ height: 26, width: 26, borderRadius: 13, marginRight: 10 }} src={fillercardimage} alt='initiatorPhoto' />
                      <img style={{ height: 26, width: 26, borderRadius: 13, marginRight: 10 }} src={fillercardimage} alt='initiatorPhoto' />
                      <img style={{ height: 26, width: 26, borderRadius: 13, marginRight: 10 }} src={fillercardimage} alt='initiatorPhoto' />
                    </span>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    Current Weighting:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Button>View</Button>
                    <Button>Boost</Button>
                  </div>
                </div>
                <div style={{ backgroundColor: 'white', marginTop: 15 }}>
                  <div>Details:</div>
                  <div style={{ marginTop: 10 }}># of Tasks in Plan</div>
                  <div style={{ fontFamily: font1, fontSize: 18, color: 'black', margin: 0, marginTop: 10 }}>
                    Submitter: <span style={{ marginLeft: 10 }}>
                      <img style={{ height: 30, width: 30, borderRadius: 15 }} src={fillercardimage} alt='initiatorPhoto' />
                    </span>
                  </div>
                  <div style={{ fontFamily: font1, fontSize: 18, color: 'black', margin: 0, marginTop: 10 }}>
                    Backers: <span style={{ marginLeft: 10 }}>
                      <img style={{ height: 26, width: 26, borderRadius: 13, marginRight: 10 }} src={fillercardimage} alt='initiatorPhoto' />
                      <img style={{ height: 26, width: 26, borderRadius: 13, marginRight: 10 }} src={fillercardimage} alt='initiatorPhoto' />
                      <img style={{ height: 26, width: 26, borderRadius: 13, marginRight: 10 }} src={fillercardimage} alt='initiatorPhoto' />
                      <img style={{ height: 26, width: 26, borderRadius: 13, marginRight: 10 }} src={fillercardimage} alt='initiatorPhoto' />
                    </span>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    Current Weighting:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Button>View</Button>
                    <Button>Boost</Button>
                  </div>
                </div>
                <div style={{ backgroundColor: 'white', marginTop: 15  }}>
                  <div>Details:</div>
                  <div style={{ marginTop: 10 }}># of Tasks in Plan</div>
                  <div style={{ fontFamily: font1, fontSize: 18, color: 'black', margin: 0, marginTop: 10 }}>
                    Submitter: <span style={{ marginLeft: 10 }}>
                      <img style={{ height: 30, width: 30, borderRadius: 15 }} src={fillercardimage} alt='initiatorPhoto' />
                    </span>
                  </div>
                  <div style={{ fontFamily: font1, fontSize: 18, color: 'black', margin: 0, marginTop: 10 }}>
                    Backers: <span style={{ marginLeft: 10 }}>
                      <img style={{ height: 26, width: 26, borderRadius: 13, marginRight: 10 }} src={fillercardimage} alt='initiatorPhoto' />
                      <img style={{ height: 26, width: 26, borderRadius: 13, marginRight: 10 }} src={fillercardimage} alt='initiatorPhoto' />
                      <img style={{ height: 26, width: 26, borderRadius: 13, marginRight: 10 }} src={fillercardimage} alt='initiatorPhoto' />
                      <img style={{ height: 26, width: 26, borderRadius: 13, marginRight: 10 }} src={fillercardimage} alt='initiatorPhoto' />
                    </span>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    Current Weighting:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <Button>View</Button>
                    <Button>Boost</Button>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '85%', flex: 1, paddingLeft: 20 }}>
              <h3 style={{ fontSize: 24, fontFamily: font1, marginTop: 15 }}>
                Discussion
              </h3>
              <div style={{ height: 80, width: '85%', margin: 20, marginTop: 10, marginBottom: 10, borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 1px rgba(0, 0, 0, 0.25)', border: `1px solid ${grey1}` }}>
                Discussion #1
              </div>
              <div style={{ height: 80, width: '85%', margin: 20, marginTop: 10, marginBottom: 10, borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 1px rgba(0, 0, 0, 0.25)', border: `1px solid ${grey1}` }}>
                Discussion #2
              </div>
              <div style={{ height: 80, width: '85%', margin: 20, marginTop: 10, marginBottom: 10, borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 1px rgba(0, 0, 0, 0.25)', border: `1px solid ${grey1}` }}>
                Discussion #3
              </div>
              <div style={{ height: 80, width: '85%', margin: 20, marginTop: 10, marginBottom: 10, borderRadius: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 1px rgba(0, 0, 0, 0.25)', border: `1px solid ${grey1}` }}>
                Discussion # 4
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
// <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap'}}>
//
//   <div style={{ display: 'flex', flexDirection: 'column', height: 500, width: 400, flex: 1, paddingRight: 20 }}>
//
//   </div>
// </div>
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
