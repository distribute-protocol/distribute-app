import React from 'react'
import { Button, Input } from 'antd'
import ProfileTable from './shared/ProfileTable'
import addavatar from 'images/addavatar.svg'
import styles from 'styles'
let { colors, fonts, typography, container } = styles

const ConnectionTable = (props) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
      <p style={{ fontSize: 20, fontFamily: fonts.font1 }}>Connections</p>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300, width: 315, backgroundColor: 'rgba(218, 218, 218, 0.5)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <b><p style={{ fontSize: 18, fontFamily: fonts.font1, color: '#989898', textAlign: 'center' }}>You don't currently have<br />any connections.</p></b>
          <Input style={{ fontSize: 14, fontFamily: fonts.font1, textAlign: 'center' }} placeholder='Enter Email Address' />
          <Button style={{ backgroundColor: 'rgba(60, 142, 185, 0.8)', marginTop: 10, paddingTop: 4 }}>
            <p style={{ color: 'white', fontSize: 14, fontFamily: 'Avenir Next' }}>Send Invite</p>
          </Button>
        </div>
      </div>
      <Button style={{ backgroundColor: colors.brandColor, width: 222, height: 50, marginTop: 30, justifyContent: 'center', alignItems: 'center', display: 'flex', marginBottom: 30 }} onClick={props.handleSave}>
        <div style={{ color: 'white', fontFamily: 'Avenir Next', margin: 0, padding: 0 }}>Save & Continue</div>
      </Button>
    </div>
  )
}
export default ({
  name,
  location,
  handleSave,
  editContent,
  deleteItem,
  addItem,
  data,
  avatar
}) => {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 50, marginLeft: 100 }}>
        <div>
          <img style={{ cursor: 'pointer', height: 150, width: 150, borderRadius: 75 }} src={avatar} alt={addavatar} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', fontSize: 20, paddingLeft: 25, paddingTop: 20 }}>
          <p>{name}</p>
          <p>{location}</p>
        </div>
      </div>
      <div style={{ display: 'flex', paddingTop: 40, flexWrap: 'wrap', flexDirection: 'row', marginLeft: 50, marginRight: 50 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', flexBasis: '75%', flex: 3, alignItems: 'center', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            <ProfileTable title={'Expertise / Skills'} datakey={'expertise'} input={data.expertise} add={'Add Expertise'} deleteItem={(i) => deleteItem(i, 'expertise')} addItem={addItem} />
            <ProfileTable title={'Interests'} datakey={'interests'} input={data.interests} add={'Add Interest'} deleteItem={(i) => deleteItem(i, 'interests')} addItem={addItem} />
            <ProfileTable title={'Contact Details'} datakey={'contactDetails'} input={data.contactDetails} add={'Add Contact Details'} deleteItem={(i) => deleteItem(i, 'contactDetails')} addItem={addItem} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            <ProfileTable title={'Want To Learn'} datakey={'wantToLearn'} input={data.wantToLearn} add={'Add Skill To Learn'} deleteItem={(i) => deleteItem(i, 'wantToLearn')} addItem={addItem} />
            <ProfileTable title={'Want To Teach'} datakey={'wantToTeach'}input={data.wantToTeach} add={'Add Skill To Teach'} deleteItem={(i) => deleteItem(i, 'wantToTeach')} addItem={addItem} />
            <ProfileTable title={'Affiliations'} datakey={'affiliations'} input={data.affiliations} add={'Add Affiliation'} deleteItem={(i) => deleteItem(i, 'affiliations')} addItem={addItem} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', flexBasis: '25%', flex: 1 }}>
          <ConnectionTable handleSave={handleSave} />
        </div>
      </div>
    </div>
  )
}
