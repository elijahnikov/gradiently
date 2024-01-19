import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Point, drawCircle, generateCoordinate, xy2Hex } from './utils'
import Picker from './Picker'

export type ColorWheelProps = {
  radius: number
  via?: boolean
  onChange?: React.Dispatch<React.SetStateAction<string>>
}

export const ColorWheel = ({ via = false, radius = 100, onChange }: ColorWheelProps) => {
  const ref = useRef<HTMLCanvasElement>(null)
  const pointerArr = via ? ['to', 'from', 'via'] : ['to', 'from']
  const pointerObject = generateCoordinate(pointerArr, radius)
  const [positions, setPositions] = useState<Record<'to' | 'from' | 'via', Point>>(pointerObject)

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

  const fromHex = useMemo(
    () => 'from-[' + xy2Hex(positions.from.x, positions.from.y, radius) + '] ',
    [positions.from.x, positions.from.y, radius],
  )
  const toHex = useMemo(
    () => 'to-[' + xy2Hex(positions.to.x, positions.to.y, radius) + '] ',
    [positions.to.x, positions.to.y, radius],
  )
  const viaHex = useMemo(
    () => (via ? 'via-[' + xy2Hex(positions.via.x, positions.via.y, radius) + ']' : ''),
    [positions.via?.x, positions.via?.y, radius, via],
  )

  onChange && onChange(fromHex + toHex + viaHex)

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
          position={positions[type as keyof typeof positions]}
          radius={radius}
        />
      ))}
    </div>
  )
}
