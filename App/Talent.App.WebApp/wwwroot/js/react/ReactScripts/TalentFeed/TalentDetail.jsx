import React from 'react'
import { Image, Card, Header } from 'semantic-ui-react'

import PropTypes from 'prop-types'

const TalentDetail = ({ detailedTalentData }) => {
  return (
    <Card.Content style={{ display: 'flex', padding: 0 }}>
      <div style={{ width: '50%' }}>
        <Image
          src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
          ui={false}
          fluid
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ marginLeft: 20 }}>
        <Header style={{ margin: '20px 0 0 0' }} size="small">
          Talent snapshot
        </Header>
        <Header style={{ margin: '10px 0 0 0' }} size="tiny">
          CURRENT EMPLOYER
        </Header>
        <p>{detailedTalentData.currentEmployer || 'Data is not available'}</p>
        <Header style={{ margin: '10px 0 0 0' }} size="tiny">
          VISA STATUS
        </Header>
        <p>{detailedTalentData.visa || 'Data is not available'}</p>
        <Header style={{ margin: '10px 0 0 0' }} size="tiny">
          POSITION
        </Header>
        <p>{detailedTalentData.currentPosition || 'Data is not available'}</p>
      </div>
    </Card.Content>
  )
}

TalentDetail.prototype = {
  detailedTalentData: PropTypes.object.isRequired
}

export default TalentDetail
