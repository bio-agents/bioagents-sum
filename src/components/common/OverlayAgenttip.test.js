import React from 'react'
import renderer from 'react-test-renderer'
import OverlayAgenttip from './OverlayAgenttip'

it('Renders OverlayAgenttip correctly', () => {
  const tree = renderer
    .create(
      <OverlayAgenttip id='overlay_snapshot' agenttipText='This is overlay snapshot'>
        <span>{'OverlayAgenttip child'}</span>
      </OverlayAgenttip>
    )
    .toJSON()

  expect(tree).toMatchSnapshot()
})
