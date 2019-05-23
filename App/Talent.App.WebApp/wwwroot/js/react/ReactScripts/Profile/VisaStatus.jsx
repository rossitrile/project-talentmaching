import React, { useState, useEffect } from 'react'
import { Header, Dropdown, Button } from 'semantic-ui-react'
import { DateInput } from 'semantic-ui-calendar-react'
import moment from 'moment'

const getVisaOptions = () => {
  const visaOptions = [
    'Citizen',
    'Permanent Resident',
    'Work Visa',
    'Student Visa'
  ]
  return visaOptions.reduce((result, next) => {
    result.push({
      key: next,
      text: next,
      value: next
    })
    return result
  }, [])
}

const getFormatDateTime = date => {
  if (!date) return ''
  return moment(date).format('MM/DD/YYYY')
}

const VisaStatus = ({ visaStatus, visaExpiryDate, saveProfileData }) => {
  const [state, setState] = useState(() => ({
    visaStatus: '',
    visaExpiryDate: ''
  }))

  useEffect(
    () => {
      if (visaStatus || visaExpiryDate)
        setState({
          ...state,
          visaStatus,
          visaExpiryDate: getFormatDateTime(visaExpiryDate)
        })
    },
    [visaStatus, visaExpiryDate]
  )

  const handleChange = (e, { name, value }) =>
    setState({ ...state, [name]: value })

  const saveVisa = e => {
    e.preventDefault()
    saveProfileData({
      visaStatus: state.visaStatus,
      visaExpiryDate:
        state.visaStatus === 'Work Visa' || state.visaStatus === 'Student Visa'
          ? state.visaExpiryDate
          : ''
    })
  }
  return (
    <div className="row">
      <div className="ui sixteen wide column" style={{ display: 'flex' }}>
        <div style={{ marginRight: 20 }}>
          <Header size="tiny">Visa type</Header>
          <Dropdown
            selection
            search
            name="visaStatus"
            value={state.visaStatus}
            onChange={handleChange}
            options={getVisaOptions()}
          />
        </div>
        {(state.visaStatus === 'Work Visa' ||
          state.visaStatus === 'Student Visa') && (
          <div style={{ marginRight: 20 }}>
            <Header size="tiny">Visa expire date</Header>
            <DateInput
              name="visaExpiryDate"
              placeholder="Expire Date"
              value={state.visaExpiryDate}
              iconPosition="left"
              onChange={handleChange}
              dateFormat="MM/DD/YYYY"
            />
          </div>
        )}
        <Button
          onClick={saveVisa}
          style={{ alignSelf: 'flex-end' }}
          color="black"
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default VisaStatus
