import React from 'react'
import ReactDOM from 'react-dom'
import Cookies from 'js-cookie'
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx'
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx'
import { JobSummaryCard } from './JobSummaryCard.jsx'
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx'
import {
  Pagination,
  Icon,
  Dropdown,
  Checkbox,
  Accordion,
  Form,
  Segment,
  Card,
  Button,
  Grid,
  Label
} from 'semantic-ui-react'

import { listingEndpoint } from '../../Services/httpService'

const sortOptions = [
  {
    key: 'asc',
    text: 'Oldest first',
    value: 'asc'
  },
  {
    key: 'desc',
    text: 'Newest first',
    value: 'desc'
  }
]

const filterOptions = [
  {
    key: 'showClosed',
    text: 'Closed Jobs',
    value: 'showClosed'
  },
  {
    key: 'showActive',
    text: 'Active Jobs',
    value: 'showActive'
  },
  {
    key: 'showDraft',
    text: 'Drafted Jobs',
    value: 'showDraft'
  },
  {
    key: 'showExpired',
    text: 'Expired Jobs',
    value: 'showExpired'
  },
  {
    key: 'showUnexpired',
    text: 'Unexpired Jobs',
    value: 'showUnexpired'
  }
]

export default class ManageJob extends React.Component {
  constructor(props) {
    super(props)
    let loader = loaderData
    loader.allowedUsers.push('Employer')
    loader.allowedUsers.push('Recruiter')
    //console.log(loader)
    const initialFilter = {
      showActive: true,
      showClosed: false,
      showDraft: false,
      showExpired: false,
      showUnexpired: false
    }
    this.state = {
      loadJobs: [],
      loaderData: loader,
      activePage: 1,
      sortBy: {
        date: 'desc'
      },
      filter: initialFilter,
      totalPages: 1,
      activeIndex: ''
    }
    this.loadData = this.loadData.bind(this)
    this.init = this.init.bind(this)
    this.loadNewData = this.loadNewData.bind(this)
    //your functions go here
    this.updateWithoutSave = this.updateWithoutSave.bind(this)
    this.handleSort = this.handleSort.bind(this)
    this.handleCloseJob = this.handleCloseJob.bind(this)
    this.handleFilter = this.handleFilter.bind(this)
    this.getCurrentFilterValue = this.getCurrentFilterValue.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
  }

  init() {
    let loaderData = TalentUtil.deepCopy(this.state.loaderData)
    loaderData.isLoading = false

    //set loaderData.isLoading to false after getting data
    this.loadData(() => this.setState({ loaderData }))
  }

  componentDidMount() {
    this.init()
  }

  loadData(callback) {
    const { sortBy } = this.state
    const { filter } = this.state
    const { activePage } = this.state

    const query = [
      `sortbyDate=${sortBy.date}`,
      `showActive=${filter.showActive}`,
      `showClosed=${filter.showClosed}`,
      `showDraft=${filter.showDraft}`,
      `showExpired=${filter.showExpired}`,
      `showUnexpired=${filter.showUnexpired}`,
      `activePage=${activePage}`
    ].join('&')
    let url =
      listingEndpoint + '/listing/listing/getSortedEmployerJobs?' + query
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
        let loadJobs = null
        let totalPages = 1
        if (res.myJobs) {
          loadJobs = res.myJobs
          totalPages = Math.ceil(res.totalCount / 6)
        }
        this.updateWithoutSave(loadJobs, totalPages)
        callback()
      }.bind(this),
      error: function(res) {
        console.log(res.status)
      }
    })
  }

  updateWithoutSave(newData, totalPages) {
    this.setState({
      loadJobs: newData,
      totalPages
    })
  }

  loadNewData(data) {
    var loader = this.state.loaderData
    loader.isLoading = true
    data[loaderData] = loader
    this.setState(data, () => {
      this.loadData(() => {
        loader.isLoading = false
        this.setState({
          loadData: loader
        })
      })
    })
  }

  /**
   * Get Dropdown options
   */

  getCurrentFilterValue() {
    const currentValues = []
    const {
      showActive,
      showClosed,
      showDraft,
      showExpired,
      showUnexpired
    } = this.state.filter

    if (showActive) currentValues.push('showActive')
    if (showClosed) currentValues.push('showClosed')
    if (showDraft) currentValues.push('showDraft')
    if (showExpired) currentValues.push('showExpired')
    if (showUnexpired) currentValues.push('showUnexpired')

    return currentValues
  }

  /**
   * Handling Event
   */
  handleSort(e, { value }) {
    this.setState(
      () => {
        return { sortBy: { date: value } }
      },
      () => this.loadNewData(this.state.loaderData)
    )
  }
  handleFilter(e, { value }) {
    const filter = TalentUtil.deepCopy(this.state.filter)
    if (value.length === 0) return

    Object.keys(filter).forEach(k => {
      if (value.includes(k)) filter[k] = true
      else filter[k] = false
    })
    if (filter['showActive'] && filter['showClosed']) {
      const shouldShow = value[value.length - 1]
      if (shouldShow === 'showActive') {
        filter['showActive'] = true
        filter['showClosed'] = false
      } else {
        filter['showActive'] = false
        filter['showClosed'] = true
      }
    }

    if (filter['showUnexpired'] && filter['showExpired']) {
      const shouldShow = value[value.length - 1]
      if (shouldShow === 'showUnexpired') {
        filter['showUnexpired'] = true
        filter['showExpired'] = false
      } else {
        filter['showUnexpired'] = false
        filter['showExpired'] = true
      }
    }

    this.setState(
      prev => {
        return { filter }
      },
      () => this.loadNewData(this.state.loaderData)
    )
  }

  handleCloseJob(id) {
    const currentLoadJobs = TalentUtil.deepCopy(this.state.loadJobs)
    const index = currentLoadJobs.findIndex(job => job.id === id)
    if (currentLoadJobs[index].status === 1) {
      return TalentUtil.notification.show(
        'Job already closed',
        'error',
        null,
        null
      )
    }
    const updatedLoadJobs = currentLoadJobs.filter(job => job.id !== id)
    this.setState({ loadJobs: updatedLoadJobs })
    TalentUtil.notification.show('Job closed', 'error', null, null)
  }

  handlePageChange(e, { activePage }) {
    this.setState(
      () => {
        return { activePage }
      },
      () => this.loadNewData(this.state.loaderData)
    )
  }

  render() {
    return (
      <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
        <div className="ui container">
          <h3>List of Jobs</h3>
          <div className="filter">
            <Icon name="filter" /> Filter:{' '}
            <Dropdown
              inline
              options={filterOptions}
              closeOnChange
              value={this.getCurrentFilterValue()}
              onChange={this.handleFilter}
              placeholder="Choose filters"
              multiple
              style={{ padding: 0 }}
            />{' '}
            <Icon name="calendar alternate outline" />
            Sort by date:
            <Dropdown
              inline
              options={sortOptions}
              defaultValue={this.state.sortBy.date}
              onChange={this.handleSort}
            />
          </div>
          <JobSummaryCard
            closeJob={this.handleCloseJob}
            jobs={this.state.loadJobs}
          />
          <div className="pagniation">
            <Pagination
              boundaryRange={0}
              defaultActivePage={this.state.activePage}
              ellipsisItem={null}
              firstItem={null}
              lastItem={null}
              siblingRange={1}
              onPageChange={this.handlePageChange}
              totalPages={this.state.totalPages}
            />
          </div>
        </div>
      </BodyWrapper>
    )
  }
}
