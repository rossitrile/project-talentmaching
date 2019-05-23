import React, { useEffect, useState } from 'react'
import { Loader, Card, Icon, Header, Image, Dimmer } from 'semantic-ui-react'
import Cookies from 'js-cookie'

import { profileEndpoint } from '../Services/httpService'

const CompanyProfile = ({ updateCompany, companyData }) => {
  const [state, setState] = useState(() => ({
    isLoading: false,
    isError: false
  }))

  useEffect(() => {
    fetch()
  }, [])

  fetch = () => {
    setState({ ...status, isLoading: true })

    const cookies = Cookies.get('talentAuthToken')

    $.ajax({
      url: `${profileEndpoint}/profile/profile/getEmployerProfile`,
      headers: {
        Authorization: 'Bearer ' + cookies,
        'Content-Type': 'application/json'
      },
      type: 'GET',
      success: function(res) {
        setState({ isError: false, isLoading: false })
        if (res.success == true) {
          updateCompany({ companyDetails: res.employer })
        } else {
          setState({ isError: true, isLoading: false })
        }
      },
      error: function() {
        setState({ isError: true, isLoading: false })
      }
    })
  }

  if (state.isLoading)
    return (
      <Card style={{ padding: 20, alignSelf: 'flex-start' }}>
        <Loader active inline="centered" />
      </Card>
    )

  return (
    <>
      {companyData && (
        <Card style={{ margin: 0, alignSelf: 'flex-start' }}>
          <Card.Content
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Image
              src={
                companyData.profilePhotoUrl ||
                'https://react.semantic-ui.com/images/wireframe/square-image.png'
              }
              size="mini"
              circular
              style={{ width: 60 }}
            />
            <Header size="medium" style={{ margin: '10px 0 0 0' }}>
              {companyData.companyContact.name}
            </Header>
            <Header
              size="tiny"
              color="grey"
              style={{ margin: '10px 20px 0 0' }}
            >
              <Icon style={{ margin: 0 }} name="location arrow" />{' '}
              {companyData.companyContact.location.city} ,{' '}
              {companyData.companyContact.location.country}
            </Header>
            <div style={{ margin: '10px 0 0 0', fontSize: 16 }}>
              {companyData.skills.length === 0
                ? 'We currently do not have specific skills that we desire'
                : companyData.skills.length.map(skill => (
                    <React.Fragment key={skill.name}>
                      {skill.name}
                    </React.Fragment>
                  ))}
            </div>
          </Card.Content>
          <Card.Content
            extra
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ display: 'flex', marginBottom: 10 }}>
              <Icon name="phone" /> : {companyData.companyContact.phone}
            </div>
            <div style={{ display: 'flex' }}>
              <Icon name="mail" /> : {companyData.companyContact.email}
            </div>
          </Card.Content>
        </Card>
      )}
    </>
  )
}

export default CompanyProfile
