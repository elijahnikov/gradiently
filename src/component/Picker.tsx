import { useCallback, useMemo } from 'react'
import Draggable, { DraggableEventHandler } from 'react-draggable'
import { xy2polar, polar2xy, xy2Hex, Point } from './utils'
import React from 'react'

export default function Picker({
  radius,
  position,
  type,
  setPositions,
}: {
  radius: number
  position: { x: number; y: number }
  type: string
  setPositions: React.Dispatch<React.SetStateAction<Record<string, Point>>>
}) {
  const nodeRef = React.useRef(null)

  const handleDrag: DraggableEventHandler = useCallback(
    (e, data) => {
      e.stopPropagation()
      e.preventDefault()

      // eslint-disable-next-line prefer-const
      let [r, phi] = xy2polar(data.x - radius, data.y - radius)
      r = Math.min(r, radius)
      const [x, y] = polar2xy(r, phi)
      setPositions((prevPositions) => ({
        ...prevPositions,
        [type]: { x: x + radius, y: y + radius },
      }))
    },
    [radius, setPositions, type],
  )

  return (
    <Draggable nodeRef={nodeRef} position={position} onDrag={handleDrag}>
      <div
        ref={nodeRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: '-12px',
          left: '-12px',
          width: Math.min(radius / 3, 24) + 'px',
          height: Math.min(radius / 3, 24) + 'px',
          borderRadius: '99px',
          border: '2px solid rgba(255, 255, 255, 1)',
          boxShadow: '0 0 1px 2px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            borderRadius: '99px',
            backgroundColor: '#fff',
          }}
        />
      </div>
    </Draggable>
  )
}
