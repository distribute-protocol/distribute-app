import React from 'react'
import { Modal } from 'antd'
import { font1 } from 'styles/fonts'

export default (props) => (
  <Modal
    centered
    closable={false}
    visible={props.visible}
    footer={null}
    maskClosable={false}
    width={930}
    bodyStyle={{ height: 850, backgroundColor: 'white', padding: 0, overflow: 'hidden' }}
  >
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 90, color: 'black' }}>
      <div style={{ fontFamily: font1, fontSize: 30, textAlign: 'center' }}>{props.title}</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'row', color: 'black' }}>
      <div style={{ width: '50%', flexDirection: 'column', alignItems: 'center', textAlign: 'center', overflow: 'auto' }}>
        <div style={{ fontFamily: font1, fontSize: 24 }}>
          {props.headerLeft}
        </div>
        {props.leftSide}
      </div>
      <div style={{ flexDirection: 'column', alignItems: 'center', width: '50%', textAlign: 'center' }}>
        <div style={{ fontFamily: font1, fontSize: 24 }}>
          {props.headerRight}
        </div>
        {props.rightSide}
      </div>
    </div>
  </Modal>
)
