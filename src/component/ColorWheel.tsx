import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Point, drawCircle, generateCoordinate } from './utils'
import Picker from './Picker'

export type ColorWheelProps = {
  radius: number
  via: boolean
  onChange?: React.Dispatch<React.SetStateAction<Record<string, Point>>>
}

export const ColorWheel = ({ radius, onChange, via }: ColorWheelProps) => {
  const ref = useRef<HTMLCanvasElement>(null)
  const pointerArr = via ? ['to', 'from', 'via'] : ['to', 'from']
  const pointerObject = generateCoordinate(pointerArr, radius)
  const [positions, setPositions] = useState<Record<string, Point>>(pointerObject)

  const drawCircleCallback = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      drawCircle(ctx, radius)
    },
    [radius],
  )

  useEffect(() => {
    if (!ref.current) return
    const ctx = ref.current.getContext('2d')

    if (!ctx) return

    ctx.canvas.width = radius * 2
    ctx.canvas.height = radius * 2

    drawCircleCallback(ctx)
  }, [drawCircleCallback, radius])

  useEffect(() => {
    onChange && onChange(positions)
  }, [onChange, positions])

  // useEffect(() => {
  //   Object.entries(positions).forEach(([key, value]) => {
  //     console.log({
  //       key,
  //       values: {
  //         x: value.x,
  //         y: value.y,
  //       },
  //     })
  //   })
  // }, [positions])

  return (
    <div
      style={{
        position: 'relative',
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
      }}
    >
      <canvas
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '9999px',
        }}
      />
      {pointerArr.map((type, index) => (
        <Picker
          setPositions={setPositions}
          type={type}
          key={index}
          position={positions[type]}
          radius={radius}
        />
      ))}
    </div>
  )
}
