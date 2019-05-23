import React, { useState, useEffect } from 'react'
import { Form, Checkbox, Header, Radio, Button } from 'semantic-ui-react'
import moment from 'moment'
import { DateInput } from 'semantic-ui-calendar-react'

const getFormatDateTime = date => {
  if (!date) return ''
  return moment(date).format('MM/DD/YYYY')
}

const TalentStatus = ({ status, saveProfileData }) => {
  const [jobSeekingStatus, setJobSeekingStatus] = useState(() => '')
  const [availableDate, setAvailableDate] = useState(() => '')

  useEffect(
    () => {
      if (status.status) setJobSeekingStatus(status.status)
      if (status.availableDate)
        setAvailableDate(getFormatDateTime(status.availableDate))
    },
    [status.status, status.availableDate]
  )

  const handleChange = (e, { value }) => {
    setJobSeekingStatus(value)
  }

  const handleDateChange = (e, { value }) => {
    setAvailableDate(value)
  }

  const saveJobSeekingStatus = e => {
    e.preventDefault()
    saveProfileData({
      jobSeekingStatus: {
        status: jobSeekingStatus,
        availableDate:
          jobSeekingStatus === 'Will be available on later date'
            ? availableDate
            : null
      }
    })
  }

  const renderOptions = () => {
    const options = [
      'Actively looking for a job',
      'Not looking for a job at the moment',
      'Currently employed but open to offers',
      'Will be available on later date'
    ]
    return options.map(option => {
      return (
        <Form.Field key={option}>
          <Radio
            label={option}
            name="radioGroup"
            checked={jobSeekingStatus === option}
            onChange={handleChange}
            value={option}
          />
        </Form.Field>
      )
    })
  }
  const renderDatePicker = () => {
    if (jobSeekingStatus !== 'Will be available on later date') return
    return (
      <Form.Field>
        <Header size="tiny">Date Available</Header>
        <DateInput
          placeholder="Date"
          value={availableDate}
          iconPosition="left"
          onChange={handleDateChange}
          dateFormat="MM/DD/YYYY"
        />
      </Form.Field>
    )
  }

  return (
    <div className="row">
      <div className="ui sixteen wide column">
        <Header size="tiny">Current Status</Header>
        {renderOptions()}
        {renderDatePicker()}
        <Button color="black" onClick={saveJobSeekingStatus}>
          Save
        </Button>
      </div>
    </div>
  )
}

export default TalentStatus
