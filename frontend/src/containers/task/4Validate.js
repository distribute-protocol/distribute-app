import React from 'react'
import { connect } from 'react-redux'
import ValidateTaskComponent from '../../components/task/4Validate'
import { getValidations } from '../../actions/taskActions'

class ValidateTasks extends React.Component {
  constructor () {
    super()
    this.state = {
    }
    this.getValidations = this.getValidations.bind(this)
  }

  componentWillMount () {
    this.getValidations()
  }

  getValidations () {
    this.props.getValidations(this.props.address, this.props.index)
  }

  render () {
    let yesValidations
    let noValidations
    if (typeof this.props.tasks !== 'undefined') {
      yesValidations = this.props.tasks.map((task, i) => {
        return {
          key: i,
          address: task.description
        }
      })
      noValidations = this.props.tasks.map((task, i) => {
        return {
          key: i,
          address: task.description
        }
      })
    } else {
      yesValidations = []
      noValidations = []
    }

    return (
      <ValidateTaskComponent
        yesValidations={yesValidations}
        noValidations={noValidations}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    validations: state.projects[4][ownProps.address].tasks[ownProps.index].validations
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    getValidations: (address, state) => dispatch(getValidations(address, state))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ValidateTasks)
