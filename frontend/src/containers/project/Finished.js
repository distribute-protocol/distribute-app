import React from 'react'
import { connect } from 'react-redux'
import FinishedComponent from '../../components/project/Finished'
import { web3 } from '../../utilities/blockchain'
import { Icon } from 'antd'
import moment from 'moment'
import * as _ from 'lodash'

class FinishedProject extends React.Component {
  constructor () {
    super()
    this.state = {
      tasks: []
    }
  }
  componentWillMount () {
    // this.getProjectStatus()
  }

  // async getProjectStatus () {
  //   let states = ['none', 'proposed', 'staked', 'active', 'validation', 'voting', 'complete', 'failed', 'expired']
  //   let accounts
  //   let p = P.at(this.props.address)
  //   eth.getAccounts(async (err, result) => {
  //     if (!err) {
  //       accounts = result
  //       if (accounts.length) {
  //         let weiCost = (await p.weiCost()).toNumber()
  //         let reputationCost = (await p.reputationCost()).toNumber()
  //         let ipfsHash = web3.toAscii(await p.ipfsHash())
  //         let nextDeadline = (await p.nextDeadline()) * 1000
  //         let projectState = (await p.state())
  //         let projObj = {
  //           weiCost,
  //           reputationCost,
  //           ipfsHash,
  //           nextDeadline,
  //           state: states[projectState],
  //           project: p
  //         }
  //         ipfs.object.get(ipfsHash, (err, node) => {
  //           if (err) {
  //             throw err
  //           }
  //           let dataString = new TextDecoder('utf-8').decode(node.toJSON().data)
  //           projObj = Object.assign({}, projObj, JSON.parse(dataString))
  //           this.setState(projObj)
  //         })
  //       }
  //     }
  //   })
  // }

  render () {
    let tasks, votes
    if (typeof this.props.tasks !== 'undefined') {
      tasks = this.props.tasks.slice(0).sort(function (a, b) {
        return a.index - b.index
      })
      // console.log(this.props.votes, 'votes')
      // console.log(tasks, 'tasks')
      tasks = tasks.map((task, i) => {
        votes = _.filter(this.props.votes, (vote) => { return vote.task.id === task.id ? vote : null })
        let rewardVal, rewardWork, needsVote
        if (tasks[i].validationRewardClaimable) {
          if (tasks[i].workerRewardClaimable) {
            // validators and workers can claim
            // check to see if user can claim, then once they claim turn off the button
            // pull validations from task, filtered by current metamask address
            rewardVal = []
            rewardWork = []
            needsVote = <Icon type='close' />
          } else {
            // validators can claim, task fails
            rewardVal = []
            rewardWork = <Icon type='close' />
            needsVote = <Icon type='close' />
          }
        } else {
          // vote needs to happen
          rewardVal = <Icon type='clock-circle-o' />
          rewardWork = <Icon type='clock-circle-o' />
          votes = votes.map((vote, i) => {
            return !vote.revealed
              ? <div key={i}>
                <div>
                  <div>{`Poll ID: ${vote.pollID}`}</div>
                  <div>{`Amount: ${vote.amount}`}</div>
                  <div>{`Salt: ${vote.salt}`}</div>
                  <div>{`Vote: ${parseInt(vote.vote, 10) ? 'Approve' : 'Deny'}`}</div>
                </div>
              </div> : null
          })
          needsVote =
            <div>
              <div>
                <input
                  name={'tokVal' + i}
                  placeholder='tokens'
                  onChange={(e) => this.onChange(e)}
                  value={this.state['tokVal' + i] || ''}
                />
              </div>
              <div>
                <input
                  name={'repVal' + i}
                  placeholder='reputation'
                  onChange={(e) => this.onChange(e)}
                  value={this.state['repVal' + i] || ''}
                />
                {/* <Button
                  type='danger' onClick={() => this.revealTask(i, 'reputation', true)}> Reveal Vote (R)
                </Button>
                <Button
                  type='danger' onClick={() => this.revealTask(i, 'reputation', false)}> Reveal Vote (RF)
                </Button>
                <ButtonRescueVote
                user={this.props.user}
                address={this.props.address}
                i={i}
                type='reputation'
                /> */}
              </div>
            </div>
        }

        return {
          key: i,
          description: task.description,
          ethReward: `${web3.fromWei(this.props.project.weiCost) * (task.weighting / 100)} ETH`,
          rewardValidator: rewardVal,
          rewardWorker: rewardWork,
          taskNeedsVote: needsVote,
          votes: votes
        }
      })
    } else {
      tasks = []
    }

    return (
      <FinishedComponent
        name={this.props.project.name}
        address={this.props.address}
        photo={this.props.project.photo}
        summary={this.props.project.summary}
        location={this.props.project.location}
        cost={web3.fromWei(this.props.project.cost, 'ether')}
        reputationCost={this.props.project.reputationCost}
        date={moment(this.props.project.nextDeadline * 1000)}
        user={this.props.user}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(ownProps)
  return {
    project: state.projects[ownProps.state][ownProps.address],
    tasks: state.projects[ownProps.state][ownProps.address].tasks,
    votes: state.user.votes
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     getUserValidations: (address, user) => dispatch(getUserValidations(address, user))
//   }
// }

export default connect(mapStateToProps)(FinishedProject)
