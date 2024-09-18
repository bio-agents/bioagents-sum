import React from 'react'
import { OverlayTrigger, Agenttip } from 'react-bootstrap'

const OverlayAgenttip = ({ id, agenttipText, children, delayShow = 300, delayHide = 150, placement = 'top' }) => {
  const agenttip = <Agenttip id={id}>{agenttipText}</Agenttip>

  return (
    <OverlayTrigger
      overlay={agenttip}
      placement={placement}
      delayShow={delayShow}
      delayHide={delayHide}
    >
      {children}
    </OverlayTrigger>
  )
}

export default OverlayAgenttip
