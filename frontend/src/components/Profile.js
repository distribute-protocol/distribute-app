import React from 'react'
import { Button, Input } from 'antd'
import ProfileTable from './shared/ProfileTable'
import addavatar from '../images/addavatar.svg'

export default ({
  name,
  location,
  handleSave
}) => {
  return (
    <div>
      <div style={{display: 'flex', alignItems: 'center', paddingTop: 47, paddingLeft: 100}}>
        <div>
          <img src={addavatar} alt='add avatar' />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: 20, fontFamily: 'NowAltRegular', paddingLeft: 25, paddingTop: 20}}>
          <p>{name}</p>
          <p>{location}</p>
        </div>
      </div>
      <div style={{display: 'flex', paddingTop: 40}}>
        <div style={{display: 'flex', justifyContent: 'space-between', flexGrow: 3, flexWrap: 'wrap', paddingLeft: 100, paddingRight: 46}}>
          <ProfileTable title={'Expertise / Skills'} input={'Electrical Wiring'} add={'Add Expertise'} />
          <ProfileTable title={'Interests'} input={'Land Trusts'} add={'Add Interest'} />
          <ProfileTable title={'Contact Details'} input={'twitter: @ashokafinley'} add={'Add Contact Details'} />
          <ProfileTable title={'Want To Learn'} input={'Mesh Node Installation'} add={'Add Skill To Learn'} />
          <ProfileTable title={'Want To Teach'} input={'Urban Gardening'} add={'Add Skill To Teach'} />
          <ProfileTable title={'Affiliations'} input={'distribute.network'} add={'Add Affiliation'} />
        </div>
        <div style={{display: 'flex', justifyContent: 'center', flexGrow: 1}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, paddingRight: 105}}>
            <p style={{fontSize: 20, fontFamily: 'NowAltRegular'}}>Connections</p>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300, width: 315, backgroundColor: 'rgba(218, 218, 218, 0.5)'}}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <b><p style={{fontSize: 18, fontFamily: 'Avenir Next', color: '#989898', textAlign: 'center'}}>You don't currently have<br />any connections.</p></b>
                <Input style={{fontSize: 14, fontFamily: 'Avenir Next', textAlign: 'center'}} placeholder='Enter Email Address' />
                <Button style={{backgroundColor: 'rgba(60, 142, 185, 0.8)', marginTop: 10, paddingTop: 4}}>
                  <p style={{color: 'white', fontSize: 14, fontFamily: 'Avenir Next'}}>Send Invite</p>
                </Button>
              </div>
            </div>
            <Button style={{backgroundColor: '#A4D573', width: 222, height: 56, paddingTop: 10, marginTop: 30}} onClick={handleSave}>
              <p style={{color: 'white', fontSize: 24, fontFamily: 'Avenir Next'}}>Save</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
