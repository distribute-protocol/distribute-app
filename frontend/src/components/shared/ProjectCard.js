import React from 'react'
import { Card, Button, Progress } from 'antd'
import moment from 'moment'
import fillercardimage from '../../images/fillercardimage.svg'
import { font1 } from '../../styles/fonts'
import { color3, color4 } from '../../styles/colors'
import { eth, web3, dt, rr } from '../../utilities/blockchain'


class ProjectCard extends React.Component {
  constructor () {
    super()
    this.state = {

    }
    this.clickCard = this.clickCard.bind(this)
  }

  clickCard () {
    this.props.redirect(`/${this.props.role.toLowerCase()}/project/${this.props.project.address}`, { project: this.props.project, ethPrice: this.props.ethPrice })
  }

  render () {
    let project = this.props.project
    let image, description
    project.photo !== undefined
      ? image = project.photo
      : image = fillercardimage
    project.summary !== undefined
      ? description = project.summary
      : description = 'This project does not have a description.'
    let cardBottom
    switch (this.props.role) {
      case 'Find':
        cardBottom = <div>
          <p style={{ fontFamily: font1, fontSize: 14, textAlign: 'center', marginTop: 15 }}>{description}</p>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 3, paddingLeft: 15 }}>
              <Progress style={{ fontFamily: 'Arimo', fontSize: 12, width: 200 }} strokeColor={color3} width={75} strokeWidth={8} percent={parseInt(project.weiBal) / parseInt(project.weiCost * 100)} format={percent => `${percent}%`} />
              <p style={{ fontFamily: font1, fontSize: 12 }}>${(web3.fromWei(project.weiCost - project.weiBal, 'ether') * this.props.ethPrice).toFixed(2)} Remaining</p>
              <Progress style={{ fontFamily: 'Arimo', fontSize: 12, width: 200 }} strokeColor={color4} width={75} strokeWidth={8} percent={project.reputationBalance / project.reputationCost * 100} format={percent => `${percent}%`} />
              <p style={{ fontFamily: font1, fontSize: 12 }}>{project.reputationCost - project.reputationBalance} Clout Remaining</p>
            </div>
            <div style={{ flex: 1, paddingRight: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontFamily: font1, fontSize: 12, marginBottom: 0 }}>Expires in:</p>
              <b><p style={{ fontFamily: font1, fontSize: 12, textAlign: 'center' }}>{moment(parseInt(project.nextDeadline * 1000)).fromNow()}</p></b>
            </div>
          </div>
        </div>
        break
      case 'Plan':
        cardBottom = <div>
          <p style={{ fontFamily: font1, fontSize: 14, textAlign: 'center', marginTop: 15 }}>{description}</p>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 3, paddingLeft: 15 }}>
              <p style={{ fontFamily: font1, fontSize: 18 }}>{`Project Cost: $${project.cost || 0}`}</p>
              <p style={{ fontFamily: font1, fontSize: 18 }}>{`Plans Submitted: ${project.plansSubmitted || 0}`}</p>
            </div>
            <div style={{ flex: 1, paddingRight: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontFamily: font1, fontSize: 12, marginBottom: 0 }}>Expires in:</p>
              <b><p style={{ fontFamily: font1, fontSize: 12, textAlign: 'center' }}>{moment(parseInt(project.nextDeadline * 1000)).fromNow()}</p></b>
            </div>
          </div>
        </div>
        break
      default:
        cardBottom = <div />
        break
    }
    return (
      <Card
        bordered={false}
        style={{ height: 350, width: 300, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)' }}
        bodyStyle={{ padding: 0, height: 150, width: 300, backgroundColor: 'white', position: 'fixed' }}
        cover={<div style={{ display: 'flex', flexDirection: 'row', height: 200, overflow: 'hidden', backgroundImage: `url(${image})`, backgroundPosition: 'center', backgroundSize: 'cover' }}>
          <p style={{ fontFamily: font1, fontWeight: '400', color: 'white', fontSize: 20, marginLeft: 20, marginBottom: 15, alignSelf: 'flex-end' }}>
            {project.name}
          </p>
        </div>}
        onClick={this.clickCard}
      >
        {cardBottom}
      </Card>
    )
  }
}

export default ProjectCard
