import React from 'react'
import { Card, Button, Progress } from 'antd'
import fillercardimage from '../../images/fillercardimage.svg'

class ProjectCard extends React.Component {
  constructor () {
    super()
    this.state = {
      cardClicked: false
    }
    this.clickCard = this.clickCard.bind(this)
  }

  clickCard () {
    this.setState({cardClicked: !this.state.cardClicked})
  }

  render () {
    let image, style, description
    this.props.project.image !== undefined
      ? image = this.props.project.project.image
      : image = fillercardimage
    this.state.cardClicked
      ? style = {height: 300}
      : style = {height: 300, backgroundImage: `url(${image})`}
    this.props.project.summary !== undefined
      ? description = this.props.project.summary
      : description = 'This project does not have a description.'
    return (
      <Card
        hoverable
        bordered={this.state.cardClicked}
        style={style}
        onClick={this.clickCard}
      >
        { this.state.cardClicked
          ? <div>
            <p style={{fontFamily: 'Lato', fontSize: 15}}>{this.props.project.name}</p>
            <hr />
            <p style={{fontFamily: 'Lato', fontSize: 12, textAlign: 'center', marginTop: 15}}>{description}</p>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 15}}>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Progress style={{fontFamily: 'Arimo', fontSize: 8}} type='circle' strokeColor='#326BC1' width={75} strokeWidth={8} percent={75} format={percent => `${percent}% Funded`} />
                <p style={{fontFamily: 'Lato', fontSize: 12, color: '#989898', marginTop: 5}}>Tokens</p>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Progress type='circle' strokeColor='#F5A623' width={75} strokeWidth={8} percent={75} format={percent => `${percent}% Funded`} />
                <p style={{fontFamily: 'Lato', fontSize: 12, color: '#989898', marginTop: 5}}>Reputation</p>
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10}}>
              <div style={{fontFamily: 'Lato', fontSize: 12}}>
                <b><p style={{color: '#CDCDCD'}}>Project Cost: {this.props.project.cost}</p></b>
                <b><p>{this.props.project.nextDeadline} days to go</p></b>
              </div>
              <Button style={{justifyContent: 'flex-end', height: 30, width: 67, color: 'white', backgroundColor: '#CDCDCD', borderRadius: 5}}>
                <b>More</b>
              </Button>
            </div>
          </div>
          : <b><p style={{fontFamily: 'Lato', color: 'white', fontSize: 20, marginTop: 230, marginLeft: 10}}>{this.props.project.name}</p></b>
        }
      </Card>
    )
  }
}

export default ProjectCard
