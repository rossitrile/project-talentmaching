/* Social media JSX */
import React, { useState, useEffect } from 'react'
import { ChildSingleInput } from '../Form/SingleInput.jsx'
import { Popup, Button, Icon, Label, Input, Header } from 'semantic-ui-react'

const SocialMediaLinkedAccount = ({ linkedAccounts, saveProfileData }) => {
  const [state, setState] = useState(() => ({
    mode: 'view',
    linkedAccounts: {
      linkedIn: '',
      github: ''
    }
  }))

  useEffect(
    () => {
      setState({ ...state, linkedAccounts })
    },
    [linkedAccounts]
  )

  /**
   * Functions that change state
   */
  const toggleMode = () => {
    const mode = state.mode === 'view' ? 'edit' : 'view'
    setState({ ...state, mode })
  }
  const handleInputChange = ({ target: { name, value } }) => {
    const linkedAccounts = { ...state.linkedAccounts, [name]: value }
    setState({ ...state, linkedAccounts })
  }

  /**
   * Submit Button
   */
  const updateProfile = () => {
    const linkedAccounts = TalentUtil.deepCopy(state.linkedAccounts)
    const { linkedIn, github } = state.linkedAccounts

    if (!linkedIn && !github)
      return TalentUtil.notification.show(
        'Please fill in either github link or linkedin link before saving',
        'error',
        null,
        null
      )

    if (!linkedIn) delete linkedAccounts['linkedIn']
    if (!github) delete linkedAccounts['github']

    saveProfileData({ linkedAccounts: linkedAccounts })
    toggleMode()
  }

  /**
   * Functions that render jsx
   */

  const renderDataViewer = () => {
    const { github, linkedIn } = linkedAccounts
    return (
      <div style={{ padding: '10px 20px', display: 'flex', width: '100%' }}>
        <Button as="div" labelPosition="right">
          <Button color="blue">
            <Icon name="linkedin" />
          </Button>
          <Label
            as="a"
            href={linkedIn ? linkedIn : '#'}
            basic
            color="blue"
            pointing="left"
          >
            linkedIn
          </Label>
        </Button>
        <Button as="div" labelPosition="right">
          <Button color="black">
            <Icon name="github" />
          </Button>
          <Label
            as="a"
            href={github ? github : '#'}
            basic
            color="black"
            pointing="left"
          >
            Github
          </Label>
        </Button>
        <div style={{ flexGrow: 1 }} />
        <Button onClick={toggleMode} color="black">
          Edit
        </Button>
      </div>
    )
  }
  const renderDataEditor = () => {
    return (
      <div
        style={{
          padding: '10px 20px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Header size="tiny" style={{ margin: '0 0 10px 0' }}>
          LinkedIn
        </Header>
        <Input
          placeholder="Enter your LinkedIn Url"
          value={state.linkedAccounts.linkedIn}
          name="linkedIn"
          onChange={handleInputChange}
          style={{ marginBottom: 20 }}
        />
        <Header size="tiny" style={{ margin: '0 0 10px 0' }}>
          GitHub
        </Header>
        <Input
          placeholder="Enter your Github Url"
          value={state.linkedAccounts.github}
          name="github"
          onChange={handleInputChange}
          style={{ marginBottom: 20 }}
        />
        <div>
          <Button onClick={updateProfile} color="black">
            Save
          </Button>
          <Button onClick={toggleMode}>Cancel</Button>
        </div>
      </div>
    )
  }
  return <>{state.mode === 'view' ? renderDataViewer() : renderDataEditor()}</>
}

export default SocialMediaLinkedAccount
