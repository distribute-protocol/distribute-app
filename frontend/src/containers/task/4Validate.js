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
    console.log(typeof this.props.validations, this.props.validations)
    let validations
    if (typeof this.props.validations !== 'undefined') {
      validations = this.props.validations.map((validation, i) => {
        console.log(validation, i)
        return {
          key: i,
          address: validation.user,
          amount: validation.amount,
          state: (validation.state).toString()
        }
      })
    } else {
      console.log('else')
      validations = []
    }
    console.log('return?')
    return (
      <ValidateTaskComponent
        validations={validations}
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
    getValidations: (address, index) => dispatch(getValidations(address, index))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ValidateTasks)
