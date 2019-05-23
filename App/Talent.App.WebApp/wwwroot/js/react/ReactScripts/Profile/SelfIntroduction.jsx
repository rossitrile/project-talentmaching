/* Self introduction section */
import React, { useState, useEffect } from 'react'
import { Input, Header, Button, TextArea } from 'semantic-ui-react'

const SelfIntroduction = ({ summary, description, updateProfileData }) => {
  const [inputs, setInputs] = useState(() => ({
    summary: '',
    description: ''
  }))

  useEffect(
    () => {
      if (summary || description) setInputs({ description, summary })
    },
    [summary, description]
  )

  const handleChange = ({ target: { value, name } }) =>
    setInputs({ ...inputs, [name]: value })

  const saveIntroduction = e => {
    e.preventDefault()
    if (inputs.summary.length > 150)
      return TalentUtil.notification.show(
        'Summary has to be less than 150 characters',
        'error',
        null,
        null
      )

    if (inputs.summary.length > 600)
      return TalentUtil.notification.show(
        'Summary has to be between 150 and 600 chracters',
        'error',
        null,
        null
      )

    updateProfileData({
      summary: inputs.summary,
      description: inputs.description
    })
  }

  return (
    <div className="row">
      <div className="ui sixteen wide column">
        <Input
          fluid
          value={inputs.summary}
          name="summary"
          onChange={handleChange}
          placeholder="please provide a short summary about yourself"
        />
        <Header size="small" style={{ margin: '10px 0' }}>
          Summary must be no more than 150 characters
        </Header>
        <TextArea
          value={inputs.description}
          name="description"
          onChange={handleChange}
          placeholder="Please tel us about any hobbies, additional expertise, or anything else you'd like to add."
        />
        <Header size="small" style={{ margin: '10px 0' }}>
          Description must be between 150-600 characters
        </Header>
        <div style={{ textAlign: 'right' }}>
          <Button color="black" onClick={saveIntroduction}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SelfIntroduction
