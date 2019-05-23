import React from 'react'
import ReactDOM from 'react-dom'
import Cookies from 'js-cookie'
import TalentCard from '../TalentFeed/TalentCard.jsx'
import { Loader } from 'semantic-ui-react'
import CompanyProfile from '../TalentFeed/CompanyProfile.jsx'
import FollowingSuggestion from '../TalentFeed/FollowingSuggestion.jsx'
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx'
import { profileEndpoint } from '../Services/httpService'

export default class TalentFeed extends React.Component {
  constructor(props) {
    super(props)

    let loader = loaderData
    loader.allowedUsers.push('Employer')
    loader.allowedUsers.push('Recruiter')

    this.state = {
      loadNumber: 5,
      loadPosition: 0,
      feedData: [],
      watchlist: [],
      loaderData: loader,
      loadingFeedData: false,
      companyDetails: null
    }
    this.init = this.init.bind(this)
    this.updateData = this.updateData.bind(this)
    this.loadNewData = this.loadNewData.bind(this)
  }

  init() {
    let loaderData = TalentUtil.deepCopy(this.state.loaderData)
    loaderData.isLoading = false

    this.loadData(() => this.setState({ loaderData }))
  }

  componentDidMount() {
    this.init()
  }

  loadData(callback) {
    const { loadNumber: number } = this.state
    const { loadPosition: position } = this.state

    const query = [`position=${position}`, `number=${number}`].join('&')
    let url = profileEndpoint + '/profile/profile/getTalent?' + query
    let cookies = Cookies.get('talentAuthToken')
    // your ajax call and other logic goes here

    $.ajax({
      url,
      headers: {
        Authorization: 'Bearer ' + cookies,
        'Content-Type': 'application/json'
      },
      type: 'GET',
      contentType: 'application/json',
      dataType: 'json',
      success: function(res) {
        if (res.success) {
          const newData = [...this.state.feedData, ...res.data]
          this.updateData({ feedData: newData })
          callback()
        } else {
          TalentUtil.notification.show(
            'Something wrong happened while loading data, please refresh your browser',
            'error',
            null,
            null
          )
        }
      }.bind(this),
      error: function() {
        TalentUtil.notification.show(
          'Something wrong happened while loading data, please refresh your browser',
          'error',
          null,
          null
        )
      }
    })
  }

  loadNewData() {
    this.setState({ ...this.state, loadPosition: this.state.loadPosition + 5 })

    let loaderData = TalentUtil.deepCopy(this.state.loaderData)
    loaderData.isLoading = false
    this.loadData(() => this.setState({ loaderData }))
  }

  updateData(newValues) {
    let newState = { ...this.state, ...newValues }
    this.setState(newState)
  }

  render() {
    return (
      <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
        <div
          className="ui container"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <CompanyProfile
            companyData={this.state.companyDetails}
            updateCompany={this.updateData}
          />
          <TalentCard
            loadNewData={this.loadNewData}
            talentData={this.state.feedData}
          />
          <FollowingSuggestion />
        </div>
      </BodyWrapper>
    )
  }
}
