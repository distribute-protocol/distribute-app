import React from 'react'
import { connect } from 'react-redux'
import ProfileComponent from '../components/Profile'
import TextContinue from '../components/shared/modals/TextContinue'
import { getUserStatus } from '../actions/userActions'
import { eth } from '../utilities/blockchain'

class Profile extends React.Component {
  constructor () {
    super()
    this.state = {
      firstProfile: true,
      data: {
        expertise: ['electrical wiring'],
        interests: ['land trusts'],
        contactDetails: ['twitter: @ashokafinley'],
        wantToLearn: ['mesh node installation'],
        wantToTeach: ['urban gardening'],
        affiliations: ['distribute.network']
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
          this.props.getUserStatus(accounts[0])
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
    console.log(data)
    this.setState({data})
  }

  addItem (i) {
    console.log('add', i)
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
    getUserStatus: (userAccount) => dispatch(getUserStatus(userAccount))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
