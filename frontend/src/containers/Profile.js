import React from 'react'
import { connect } from 'react-redux'
import ProfileComponent from '../components/Profile'
import TextContinue from '../components/modals/TextContinue'
import { getUserStatusWallet, saveUserProfile } from '../actions/userActions'
import { eth } from '../utilities/blockchain'

class Profile extends React.Component {
  constructor () {
    super()
    this.state = {
      firstProfile: true,
      data: {
        expertise: [],
        interests: [],
        contactDetails: [],
        wantToLearn: [],
        wantToTeach: [],
        affiliations: []
      }
    }
    this.roleSelection = this.roleSelection.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.addItem = this.addItem.bind(this)
  }

  componentWillMount () {
    eth.getAccounts(async (err, accounts) => {
      if (!err) {
        if (accounts.length) {
          this.props.getUserStatusWallet(accounts[0])
        }
      }
    })
  }

  closeModal () {
    this.setState({firstProfile: false})
  }

  roleSelection () {
    this.props.history.push('/roleselection')
  }

  deleteItem (i, category) {
    let data = this.state.data
    let categoryData = data[category]
    categoryData.splice(i, 1)
    data = Object.assign({}, data, {[category]: categoryData})
    this.setState({data})
  }

  addItem (i, category) {
    let arr = this.state.data[category]
    arr.push(i)
    let newData = Object.assign(this.state.data, {[category]: arr})
    this.setState({data: newData})
    // console.log('add', i)
  }

  render () {
    return (
      <div>
        {this.state.firstProfile
          ? <TextContinue visible={this.state.firstProfile} text={'firstprofile'} continue={this.closeModal} handleCancel={this.closeModal} />
          : null
        }
        <ProfileComponent
          name={this.props.user.name}
          location={'Brooklyn, NY'}
          handleSave={this.roleSelection}
          deleteItem={(i, category) => this.deleteItem(i, category)}
          addItem={this.addItem}
          data={this.state.data}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user || {},
    network: state.network
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserStatusWallet: (userAccount) => dispatch(getUserStatusWallet(userAccount)),
    saveUserProfile: (userData) => dispatch(saveUserProfile(userData))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
