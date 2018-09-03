/* global alert */

import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { submitHashedTaskList } from '../../actions/projectActions'
import { hashTasksArray } from '../../utilities/hashing'

const ButtonSubmitTaskList = (props) => {
  let submitHashedTaskList = () => {
    let tasks = JSON.parse(props.taskList)
    console.log(tasks)
    let sumTotal = tasks.map(el => el.percentage).reduce((prev, curr) => {
      return prev + curr
    }, 0)
    if (sumTotal !== 100) {
      alert('percentages must add up to 100!')
    } else {
      let taskArray = tasks.map(task => ({
        description: task.description,
        percentage: task.percentage
      }))
      let taskHash = hashTasksArray(taskArray)
      props.submitHashedTaskList(tasks, taskHash, props.address, {from: props.user})
    }
  }
  return (<Button
    style={{marginTop: 10}}
    onClick={() => submitHashedTaskList()}>
    Submit Tasks
  </Button>)
}

const mapStateToProps = (state, ownProps) => {
  return {
    taskList: state.projects[2][ownProps.address].taskList
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    submitHashedTaskList: (tasks, taskHash, projectAddress, txObj) => dispatch(submitHashedTaskList(tasks, taskHash, projectAddress, txObj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonSubmitTaskList)
