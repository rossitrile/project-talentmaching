/* Experience section */
import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { Table, Button, Input, Header, Icon } from 'semantic-ui-react'
import { DateInput } from 'semantic-ui-calendar-react'
import moment from 'moment'

import { ChildSingleInput } from '../Form/SingleInput.jsx'

const initialState = {
  mode: 'view',
  experience: {
    company: '',
    position: '',
    responsibilities: '',
    start: '',
    end: ''
  }
}

const Experience = ({ experienceData, updateProfileData }) => {
  const [state, setState] = useState(() => initialState)

  /**
   * Calculating Functions
   */
  const getFormatDateTime = date => {
    return moment(date).format('MM/DD/YYYY')
  }

  /**
   * Functions that change state
   */
  const toggleMode = e => {
    if (e) e.preventDefault()
    const mode = state.mode === 'view' ? 'Add' : 'view'
    setState({ ...state, mode })
  }

  const setInitialState = () => setState(initialState)

  const handleChange = ({ target: { name, value } }) =>
    setState({ ...state, experience: { ...state.experience, [name]: value } })

  const handleDateChange = (e, { name, value }) =>
    setState({ ...state, experience: { ...state.experience, [name]: value } })

  /**
   * Functions that save / change data
   */

  const saveExperience = e => {
    e.preventDefault()
    const { start, end, company, position, responsibilities } = state.experience
    const startDate = moment(start, 'MM-DD-YYYY')
    const endDate = moment(end, 'MM-DD-YYYY')

    const isDateValid = endDate.isAfter(startDate)
    if (!isDateValid)
      return TalentUtil.notification.show(
        'Start Date has to be before End Date',
        'error',
        null,
        null
      )

    if (!company && !position && !responsibilities)
      return TalentUtil.notification.show(
        'Please fill out all the field',
        'error',
        null,
        null
      )

    const updatedExperience = [...experienceData]
    const isExperienceAlreadyExist =
      updatedExperience.findIndex(
        experience =>
          experience.company === state.experience.company &&
          experience.position === state.experience.position
      ) !== -1
    if (isExperienceAlreadyExist)
      return TalentUtil.notification.show(
        'You already had this experience on your list',
        'error',
        null,
        null
      )

    updatedExperience.push(state.experience)
    updateProfileData({ experience: updatedExperience })
    setInitialState()
  }

  const editExperience = newData => {
    setState({
      mode: 'Update',
      experience: {
        company: newData.company,
        position: newData.position,
        responsibilities: newData.responsibilities,
        start: getFormatDateTime(newData.start),
        end: getFormatDateTime(newData.end)
      }
    })
  }
  const deleteExperience = data => {
    let updatedExperience = [...experienceData]
    if (data.id) {
      updatedExperience = updatedExperience.filter(experience => {
        return experience.id !== data.id
      })
    } else {
      updatedExperience = updatedExperience.filter(experience => {
        return experience.company !== data.company
      })
    }

    updateProfileData({ experience: updatedExperience })
  }

  const renderEditor = () => {
    if (state.mode === 'view') return null
    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ width: '49%' }}>
          <Header style={{ margin: '10px 0' }} size="tiny">
            Company
          </Header>
          <Input
            placeholder="Company"
            value={state.experience.company}
            name="company"
            fluid
            onChange={handleChange}
          />
        </div>
        <div style={{ width: '49%' }}>
          <Header style={{ margin: '10px 0' }} size="tiny">
            Position
          </Header>
          <Input
            placeholder="Position"
            value={state.experience.position}
            name="position"
            fluid
            onChange={handleChange}
          />
        </div>
        <div style={{ width: '49%' }}>
          <Header style={{ margin: '10px 0' }} size="tiny">
            Start Date
          </Header>
          <DateInput
            name="start"
            placeholder="Start Date"
            value={state.experience.start}
            iconPosition="left"
            onChange={handleDateChange}
            dateFormat="MM/DD/YYYY"
          />
        </div>
        <div style={{ width: '49%' }}>
          <Header style={{ margin: '10px 0' }} size="tiny">
            End Date
          </Header>
          <DateInput
            name="end"
            placeholder="End Date"
            value={state.experience.end}
            iconPosition="left"
            onChange={handleDateChange}
            dateFormat="MM/DD/YYYY"
          />
        </div>
        <div style={{ width: '100%' }}>
          <Header style={{ margin: '10px 0' }} size="tiny">
            Responsibilities
          </Header>
          <Input
            name="responsibilities"
            placeholder="Responsibilities"
            value={state.experience.responsibilities}
            fluid
            onChange={handleChange}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <Button onClick={saveExperience} color="black">
            {state.mode}
          </Button>
          <Button onClick={setInitialState}>Cancel</Button>
        </div>
      </div>
    )
  }
  return (
    <div className="row">
      <div className="ui sixteen wide column">
        {renderEditor()}
        <Table padded>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Company</Table.HeaderCell>
              <Table.HeaderCell>Position</Table.HeaderCell>
              <Table.HeaderCell>Responsibilities</Table.HeaderCell>
              <Table.HeaderCell>Start</Table.HeaderCell>
              <Table.HeaderCell>End</Table.HeaderCell>
              <Table.HeaderCell textAlign="right">
                <Button
                  disabled={state.mode !== 'view'}
                  color="black"
                  onClick={toggleMode}
                >
                  + Add New
                </Button>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <TBody
              data={experienceData}
              updateData={editExperience}
              deleteData={deleteExperience}
            />
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}

const TBody = ({ data, updateData, deleteData }) => {
  const getFormatDateTime = date => {
    return moment(date).format('Do MMMM, YYYY')
  }
  const renderViewer = data => {
    return (
      <>
        <Table.Cell>{data.company}</Table.Cell>
        <Table.Cell>{data.position}</Table.Cell>
        <Table.Cell>{data.responsibilities}</Table.Cell>
        <Table.Cell>{getFormatDateTime(data.start)}</Table.Cell>
        <Table.Cell>{getFormatDateTime(data.end)}</Table.Cell>
        <Table.Cell textAlign="right">
          <Icon name="pencil" onClick={() => updateData(data)} />
          <Icon name="close" onClick={() => deleteData(data)} />
        </Table.Cell>
      </>
    )
  }
  return (
    <>
      {data.length !== 0 &&
        data.map((d, index) => (
          <Table.Row key={index}>{renderViewer(d)}</Table.Row>
        ))}
    </>
  )
}

export default Experience
