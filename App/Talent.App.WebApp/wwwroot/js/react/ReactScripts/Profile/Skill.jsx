/* Skill section */
import React, { useState } from 'react'
import Cookies from 'js-cookie'
import { Button, Table, Input, Dropdown, Icon } from 'semantic-ui-react'

const skillLevelOptions = () => {
  const levelOptions = ['Skill Level', 'Beginner', 'Intermediate', 'Expert']
  return levelOptions.reduce((result, next) => {
    result.push({
      key: next,
      text: next,
      value: next
    })
    return result
  }, [])
}

const Skill = ({ skillData, updateProfileData }) => {
  const [state, setState] = useState(() => ({
    mode: 'view',
    skill: {
      name: '',
      level: 'Skill Level'
    }
  }))
  /**
   * Level
   * Name
   */
  const handleChange = ({ target: { value, name } }) =>
    setState({ ...state, skill: { ...state.skill, [name]: value } })

  /**
   *  Functions that change state
   */
  const toggleMode = e => {
    if (e) e.preventDefault()
    const mode = state.mode === 'view' ? 'edit' : 'view'
    setState({ ...state, mode })
  }

  const handleDropDownValueChange = (e, { value }) =>
    setState({ ...state, skill: { ...state.skill, level: value } })

  const saveSkill = e => {
    e.preventDefault()
    if (state.skill.level === 'Skill Level')
      return TalentUtil.notification.show(
        'Please choose your skill level',
        'error',
        null,
        null
      )
    const { name: oldName } = state.skill
    const updatedSkills = [...skillData]
    const isSkillAlreadyExist =
      updatedSkills.findIndex(skill => skill.name === oldName) !== -1
    if (isSkillAlreadyExist)
      return TalentUtil.notification.show(
        'You already had this skill',
        'error',
        null,
        null
      )

    updatedSkills.push(state.skill)
    updateProfileData({ skills: updatedSkills })
    toggleMode()
  }

  const editSkill = (skillToEdit, newData) => {
    if (newData.level === 'Skill Level')
      return TalentUtil.notification.show(
        'Please choose your skill level',
        'error',
        null,
        null
      )
    let updatedSkills = [...skillData]
    const index = updatedSkills.findIndex(skill => skill.name === skillToEdit)
    const { name: oldName, level: oldLevel } = updatedSkills[index]
    updatedSkills[index] = newData

    if (newData.level === oldLevel && newData.name === oldName) return
    updateProfileData({ skills: updatedSkills })
  }
  const deleteSkill = name => {
    let updatedSkills = [...skillData]
    updatedSkills = updatedSkills.filter(skill => skill.name !== name)
    updateProfileData({ skills: updatedSkills })
  }

  /**
   * Funtions that return jsx
   */
  const renderHeaderViewer = () => {
    return (
      <>
        <Table.HeaderCell>Skill</Table.HeaderCell>
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
            placeholder="Add Skill"
            value={state.skill.name}
            name="name"
            onChange={handleChange}
            style={{ marginRight: 20 }}
          />
        </Table.HeaderCell>
        <Table.HeaderCell>
          <Dropdown
            options={skillLevelOptions()}
            selection
            search
            value={state.skill.level}
            onChange={handleDropDownValueChange}
            style={{ marginRight: 20 }}
          />
        </Table.HeaderCell>
        <Table.HeaderCell>
          <Button onClick={saveSkill} color="black">
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
              data={skillData}
              updateData={editSkill}
              deleteData={deleteSkill}
            />
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}

const TBody = ({ data, updateData, deleteData }) => {
  const [activeSkill, setActiveSkill] = useState(() => null)
  const [inputs, setInputs] = useState(() => ({
    name: '',
    level: ''
  }))

  const editData = () => {
    updateData(activeSkill, inputs)
    turnOffEditMode()
  }

  const turnOnEditMode = name => {
    const currentValue = data.find(d => d.name === name)
    setActiveSkill(name)
    setInputs(currentValue)
  }
  const turnOffEditMode = () => setActiveSkill(null)

  const handleInputChange = ({ target: { name, value } }) =>
    setInputs({ ...inputs, [name]: value })

  const handleDropDownValueChange = (e, { value }) =>
    setInputs({ ...inputs, level: value })

  const renderViewer = data => {
    if (!activeSkill || data.name !== activeSkill)
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
            placeholder="Skill"
          />
        </Table.Cell>
        <Table.Cell>
          <Dropdown
            options={skillLevelOptions()}
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

export default Skill
