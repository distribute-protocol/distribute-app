import React from 'react'
import { connect } from 'react-redux'
import ValidateTaskComponent from '../../components/task/4Validate'
import { getValidations } from '../../actions/taskActions'
import gql from 'graphql-tag'

let validationQuery = gql`
  { taskValidations {
    id,
    amount,
    state,
    task,
    user,
    address
  }
}`

class ValidateTasks extends React.Component {
  constructor () {
    super()
    this.state = {
    }
  }

  componentWillMount () {
    // this.getValidations(this)
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
    tasks: state.projects[4][ownProps.address].tasks
  }
}

export default connect(mapStateToProps)(ValidateTasks)
