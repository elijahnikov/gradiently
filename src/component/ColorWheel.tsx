import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  DirectionsIndex,
  Point,
  constructGradientString,
  drawCircle,
  generateCoordinate,
  xy2Hex,
} from './utils'
import Picker from './Picker'

type LinearGradientProps = {
  gradientType: 'linear'
  direction?: DirectionsIndex
}

type RadialConicProps = {
  gradientType: 'radial'
  direction?: never
}

export type ColorWheelProps = {
  radius?: number
  pickers?: number
  onChange?: React.Dispatch<React.SetStateAction<string>>
} & (LinearGradientProps | RadialConicProps)

export const ColorWheel = ({
  radius = 100,
  onChange,
  direction = 'right',
  pickers = 3,
  gradientType = 'linear',
}: ColorWheelProps) => {
  const ref = useRef<HTMLCanvasElement>(null)
  const pointerArr = useMemo(() => ['to', 'from', 'via'].slice(0, pickers), [pickers])
  const initPointerObj = useMemo(() => generateCoordinate(pointerArr, radius), [pointerArr, radius])
  const [positions, setPositions] = useState<Record<'to' | 'from' | 'via', Point>>(initPointerObj)

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

  const toHex = useMemo(
    () => xy2Hex(positions.to.x, positions.to.y, radius),
    [positions.to.x, positions.to.y, radius],
  )
  const fromHex = useMemo(
    () => xy2Hex(positions.from?.x, positions.from?.y, radius),
    [positions.from?.x, positions.from?.y, radius],
  )
  const viaHex = useMemo(
    () => xy2Hex(positions.via?.x, positions.via?.y, radius),
    [positions.via?.x, positions.via?.y, radius],
  )

  const hexArray = useMemo(
    () => [toHex, fromHex, viaHex].slice(0, pickers),
    [fromHex, pickers, toHex, viaHex],
  )

  useEffect(() => {
    setPositions(generateCoordinate(pointerArr, radius))
  }, [pointerArr, radius])

  useEffect(() => {
    onChange &&
      onChange(
        constructGradientString({
          direction,
          gradientType,
          hexValues: hexArray,
        }),
      )
  }, [direction, gradientType, hexArray, onChange])

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
