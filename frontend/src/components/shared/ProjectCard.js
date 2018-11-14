import React from 'react'
import { Card, Button } from 'antd'
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
    let image, style
    this.props.project.image !== undefined
      ? image = this.props.project.project.image
      : image = fillercardimage
    this.state.cardClicked
      ? style = {height: 200}
      : style = {height: 200, backgroundImage: `url(${image})`}
    return (
      <Card
        hoverable
        bordered={this.state.cardClicked}
        style={style}
        onClick={this.clickCard}
      >
        { this.state.cardClicked
          ? <div>
            <p>{this.props.project.name}</p>
            <hr />
            <p>{this.props.project.description}</p>
            <p>THIS WILL BE PIE CHARTS</p>
            <p>{this.props.project.cost}</p>
            <p>{this.props.project.stakingPeriod}</p>
            <Button>
              more
            </Button>
          </div>
          : <b><p style={{fontFamily: 'Lato', color: 'white', fontSize: 20, marginTop: 130, marginLeft: 10}}>{this.props.project.name}</p></b>
        }
      </Card>
    )
  }
}

export default ProjectCard
