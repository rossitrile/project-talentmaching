import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import TalentCardDetail from './TalentCardDetail.jsx'
import { Loader } from 'semantic-ui-react'

const TalentCard = ({ talentData, loadNewData }) => {
  const element = useRef(null)
  const [showLoading, setShowLoading] = useState(() => false)
  useEffect(() => {
    element.current.addEventListener('scroll', handleScroll)
    return element.current.removeEventListener('scroll', () =>
      console.log('cleaned up event')
    )
  }, [])

  const handleScroll = e => {
    const { scrollHeight, scrollTop, offsetHeight } = e.target
    const isBottom = scrollHeight - offsetHeight <= scrollTop

    if (isBottom) {
      setShowLoading(true)
      loadNewData()
    } else {
      setShowLoading(false)
    }
  }
  if (talentData.length === 0)
    return <div>There are no talents found for your recruitment company</div>
  return (
    <div
      ref={element}
      style={{ width: '45%', padding: 2, height: 700, overflow: 'auto' }}
    >
      {talentData.map(talent => (
        <TalentCardDetail key={talent.id} talentData={talent} />
      ))}
      {showLoading && <Loader active />}
    </div>
  )
}

TalentCard.prototype = {
  talentData: PropTypes.array.isRequired
}

export default TalentCard
