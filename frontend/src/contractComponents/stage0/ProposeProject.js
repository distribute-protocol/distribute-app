import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { proposeProject } from '../../actions/projectActions'
import ipfs from '../../utilities/ipfs'
import { eth } from '../../utilities/blockchain'

class ButtonProposeProject extends React.Component {
  constructor () {
    super()
    this.proposeProject = this.proposeProject.bind(this)
  }

  async proposeProject () {
    const obj = {
      Data: JSON.stringify(this.props.data),
      Links: []
    }
    let multiHash
    await ipfs.object.put(obj, { enc: 'json' }, (err, node) => {
      if (err) {
        throw err
      }
      multiHash = node.toString()
      eth.getAccounts(async (err, accounts) => {
        if (!err) {
          await this.props.proposeProject(
            this.props.collateralType,
            {
              cost: this.props.data.cost,
              stakingEndDate: this.props.data.stakingEndDate,
              multiHash
            }, { from: accounts[0] })
        }
      })
    })
  }

  render () {
    let style
    this.props.style !== undefined
      ? style = this.props.style
      : style = null
    return (<Button style={style}
      onClick={this.proposeProject}>
        Initiate
    </Button>)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    proposeProject: (type, projObj, txObj) => dispatch(proposeProject(type, projObj, txObj))
  }
}

export default connect(null, mapDispatchToProps)(ButtonProposeProject)
