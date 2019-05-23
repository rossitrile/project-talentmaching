/* Language section */
import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { Button, Table, Input, Dropdown, Icon } from 'semantic-ui-react'

const languageLevelOptions = () => {
  const levelOptions = ['Language Level', 'Basic', 'Fluent', 'Native']
  return levelOptions.reduce((result, next) => {
    result.push({
      key: next,
      text: next,
      value: next
    })
    return result
  }, [])
}

const Language = ({ languageData, updateProfileData }) => {
  const [state, setState] = useState(() => ({
    mode: 'view',
    language: {
      name: '',
      level: 'Language Level'
    }
  }))
  /**
   * Level
   * Name
   */
  const handleChange = ({ target: { value, name } }) =>
    setState({ ...state, language: { ...state.language, [name]: value } })

  /**
   *  Functions that change state
   */
  const toggleMode = e => {
    if (e) e.preventDefault()
    const mode = state.mode === 'view' ? 'edit' : 'view'
    setState({ ...state, mode })
  }

  const handleDropDownValueChange = (e, { value }) =>
    setState({ ...state, language: { ...state.language, level: value } })

  const saveLanguage = e => {
    e.preventDefault()
    if (state.language.level === 'Language Level')
      return TalentUtil.notification.show(
        'Please choose your language level',
        'error',
        null,
        null
      )
    const { name: oldName } = state.language
    const updatedLanguages = [...languageData]
    const isLanguageAlreadyExist =
      updatedLanguages.findIndex(language => language.name === oldName) !== -1
    if (isLanguageAlreadyExist)
      return TalentUtil.notification.show(
        'You already had this language',
        'error',
        null,
        null
      )

    updatedLanguages.push(state.language)
    updateProfileData({ languages: updatedLanguages })
    toggleMode()
  }

  const editLanguage = (languageToEdit, newData) => {
    if (newData.level === 'Language Level')
      return TalentUtil.notification.show(
        'Please choose your language level',
        'error',
        null,
        null
      )

    // If the data does not change -> do not send request to the server
    let updatedLanguages = [...languageData]
    const index = updatedLanguages.findIndex(
      language => language.name === languageToEdit
    )
    const { name: oldName, level: oldLevel } = updatedLanguages[index]
    updatedLanguages[index] = newData
    if (newData.level === oldLevel && newData.name === oldName) return

    updateProfileData({ languages: updatedLanguages })
  }
  const deleteLanguage = name => {
    let updatedLanguages = [...languageData]
    updatedLanguages = updatedLanguages.filter(
      language => language.name !== name
    )
    updateProfileData({ languages: updatedLanguages })
  }

  /**
   * Funtions that return jsx
   */
  const renderHeaderViewer = () => {
    return (
      <>
        <Table.HeaderCell>Language</Table.HeaderCell>
        <Table.HeaderCell>Level</Table.HeaderCell>
        <Table.HeaderCell textAlign="right">
          <Button color="black" onClick={toggleMode}>
            + Add New
          </Button>
        </Table.HeaderCell>
      </>
    )
  }
  const renderHeaderEditor = () => {
    return (
      <>
        <Table.HeaderCell>
          <Input
            placeholder="Add Language"
            value={state.language.name}
            name="name"
            onChange={handleChange}
            style={{ marginRight: 20 }}
          />
        </Table.HeaderCell>
        <Table.HeaderCell>
          <Dropdown
            options={languageLevelOptions()}
            selection
            search
            value={state.language.level}
            onChange={handleDropDownValueChange}
            style={{ marginRight: 20 }}
          />
        </Table.HeaderCell>
        <Table.HeaderCell>
          <Button onClick={saveLanguage} color="black">
            Add
          </Button>
          <Button onClick={toggleMode}>Cancel</Button>
        </Table.HeaderCell>
      </>
    )
  }

  return (
    <div className="row">
      <div className="ui sixteen wide column">
        <Table padded>
          <Table.Header>
            <Table.Row>
              {state.mode === 'view'
                ? renderHeaderViewer()
                : renderHeaderEditor()}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <TBody
              data={languageData}
              updateData={editLanguage}
              deleteData={deleteLanguage}
            />
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}

const TBody = ({ data, updateData, deleteData }) => {
  const [activeLanguage, setActiveLanguage] = useState(() => null)
  const [inputs, setInputs] = useState(() => ({
    name: '',
    level: ''
  }))

  const editData = () => {
    updateData(activeLanguage, inputs)
    turnOffEditMode()
  }

  const turnOnEditMode = name => {
    const currentValue = data.find(d => d.name === name)
    setActiveLanguage(name)
    setInputs(currentValue)
  }
  const turnOffEditMode = () => setActiveLanguage(null)

  const handleInputChange = ({ target: { name, value } }) =>
    setInputs({ ...inputs, [name]: value })

  const handleDropDownValueChange = (e, { value }) =>
    setInputs({ ...inputs, level: value })

  const renderViewer = data => {
    if (!activeLanguage || data.name !== activeLanguage)
      return (
        <>
          <Table.Cell>{data.name}</Table.Cell>
          <Table.Cell>{data.level}</Table.Cell>
          <Table.Cell textAlign="right">
            <Icon name="pencil" onClick={() => turnOnEditMode(data.name)} />
            <Icon name="close" onClick={() => deleteData(data.name)} />
          </Table.Cell>
        </>
      )
    return (
      <>
        <Table.Cell>
          <Input
            value={inputs.name}
            onChange={handleInputChange}
            name="name"
            placeholder="Language"
          />
        </Table.Cell>
        <Table.Cell>
          <Dropdown
            options={languageLevelOptions()}
            selection
            search
            value={inputs.level}
            onChange={handleDropDownValueChange}
          />
        </Table.Cell>
        <Table.Cell>
          <Button onClick={editData} basic color="blue">
            Update
          </Button>
          <Button onClick={turnOffEditMode} basic color="red">
            Cancel
          </Button>
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

export default Language
