import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { default as Countries } from '../../../../util/jsonFiles/countries.json'
import { ChildSingleInput } from '../Form/SingleInput.jsx'
import { Input, Header, Dropdown, Button } from 'semantic-ui-react'

const getCountryOptions = () => {
  return Object.keys(Countries).reduce((result, next) => {
    result.push({
      key: next,
      text: next,
      value: next
    })
    return result
  }, [])
}

export const Address = ({ addressData, saveProfileData }) => {
  const [state, setState] = useState(() => ({
    mode: 'view',
    address: {
      city: '',
      country: '',
      number: '',
      postCode: '',
      street: '',
      postCode: 0,
      suburb: ''
    },
    cityOptions: []
  }))

  useEffect(
    () => {
      setState({ ...state, address: addressData })
    },
    [addressData]
  )

  /**
   * Calculating Function
   */

  const getCityOptions = country => {
    return Countries[state.address.country]
  }

  /**
   * Submit Button
   */
  const updateProfile = e => {
    e.preventDefault()
    saveProfileData({ address: state.address })
    toggleMode()
  }

  /**
   * Functions that change state
   */
  const toggleMode = () => {
    const mode = state.mode === 'view' ? 'edit' : 'view'
    setState({ ...state, mode })
  }
  const handleChange = ({ target: { name, value } }) =>
    setState({ ...state, address: { ...state.address, [name]: value } })
  const handleDropDownValueChange = (event, { value, name }) =>
    setState({ ...state, address: { ...state.address, [name]: value } })

  /**
   *  Function that return jsx
   */
  const renderAddress = () => {
    const address = []
    if (addressData.number) address.push(addressData.number)
    if (addressData.street) address.push(addressData.street)
    if (addressData.suburb) address.push(addressData.suburb)
    if (addressData.postCode) address.push(addressData.postCode)

    return address.join(', ')
  }
  const renderDataViewer = () => {
    return (
      <div className="row">
        <div className="ui sixteen wide column">
          <>
            <p>Address: {renderAddress()}</p>
            <p>City: {addressData.city}</p>
            <p>Country: {addressData.country}</p>
          </>
          <button
            type="button"
            className="ui right floated teal button"
            onClick={toggleMode}
          >
            Edit
          </button>
        </div>
      </div>
    )
  }

  const renderDataEditor = () => {
    return (
      <form
        style={{
          padding: '10px 20px',
          width: '100%'
        }}
        onSubmit={updateProfile}
      >
        <div style={{ display: 'flex' }}>
          <ChildSingleInput
            inputType="text"
            label="Number"
            name="number"
            value={state.address.number}
            controlFunc={handleChange}
            style={{ width: '25%', marginRight: 20 }}
            placeholder="House number"
          />
          <ChildSingleInput
            inputType="text"
            label="Street"
            name="street"
            value={state.address.street}
            style={{ width: '40%', marginRight: 20 }}
            controlFunc={handleChange}
            placeholder="Street name"
          />
          <ChildSingleInput
            inputType="text"
            label="Surburb"
            name="suburb"
            value={state.address.suburb}
            style={{ width: '25%' }}
            controlFunc={handleChange}
            placeholder="Suburb"
          />
        </div>
        <div style={{ display: 'flex' }}>
          <div className="field" style={{ width: '35%', marginRight: 20 }}>
            <label>Country</label>
            <Dropdown
              options={getCountryOptions()}
              placeholder="Your Country"
              selection
              search
              value={state.address.country}
              name="country"
              onChange={handleDropDownValueChange}
            />
          </div>
          <div className="field" style={{ width: '35%', marginRight: 20 }}>
            <label>City</label>
            <Dropdown
              options={getCityOptions(
                state.address.city || addressData.city || ''
              )}
              placeholder="Your City"
              selection
              search
              value={state.address.city}
              name="city"
              onChange={handleDropDownValueChange}
              //   onOpen={getCityOptions}
            />
          </div>
          <ChildSingleInput
            inputType="text"
            label="Post Code"
            name="postCode"
            value={state.address.postCode}
            controlFunc={handleChange}
            style={{ width: '20%' }}
            placeholder="Post Code"
          />
        </div>
        <div>
          <Button type="submit" color="black">
            Save
          </Button>
          <Button onClick={toggleMode}>Cancel</Button>
        </div>
      </form>
    )
  }
  return <>{state.mode === 'view' ? renderDataViewer() : renderDataEditor()}</>
}

export const Nationality = ({ saveProfileData, nationalityData }) => {
  const [nationality, setNationality] = useState(() => '')

  useEffect(
    () => {
      if (nationalityData) {
        setNationality(nationalityData)
      }
    },
    [nationalityData]
  )

  const handleDropDownValueChange = (e, { value }) => {
    if (value !== nationalityData) {
      setNationality(value)
      saveProfileData({ nationality: value })
    }
  }
  return (
    <div className="row">
      <div className="ui sixteen wide column">
        <Dropdown
          options={getCountryOptions()}
          placeholder="Your Country"
          selection
          search
          value={nationality}
          name="country"
          onChange={handleDropDownValueChange}
        />
      </div>
    </div>
  )
}
