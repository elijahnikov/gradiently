export interface Point {
  x: number
  y: number
}

const directions = [
  'top',
  'top right',
  'right',
  'bottom right',
  'bottom',
  'bottom left',
  'left',
  'top left',
] as const
export type DirectionsIndex = (typeof directions)[number]

export const constructGradientString = ({
  direction,
  gradientType,
  hexValues,
}: {
  direction: string
  gradientType: string
  hexValues: string[]
}): string => {
  let output = ""
  if (hexValues.length === 1) {
    output = hexValues.join()
    return output;
  }
  if (gradientType.includes('linear')) {
    output = `${gradientType}-gradient(to ${direction}, ${hexValues.join(', ')})`
  }
  if (gradientType.includes("radial")){
    output = `${gradientType}-gradient(circle, ${hexValues.join(', ')})`
  }
  return output
}

export const xy2polar = (x: number, y: number): [number, number] => {
  const r = Math.sqrt(x * x + y * y)
  const phi = Math.atan2(y, x)
  return [r, phi]
}

export const polar2xy = (r: number, phi: number): [number, number] => {
  const x = r * Math.cos(phi)
  const y = r * Math.sin(phi)
  return [x, y]
}

export const rad2deg = (rad: number) => {
  return ((rad + Math.PI) / (2 * Math.PI)) * 360
}

export const hsv2rgb = (
  hue: number,
  saturation: number,
  value: number,
): [number, number, number] => {
  const chroma = value * saturation
  const hue1 = hue / 60
  const x = chroma * (1 - Math.abs((hue1 % 2) - 1))
  let r1: number = 0,
    g1: number = 0,
    b1: number = 0
  if (hue1 >= 0 && hue1 <= 1) {
    [r1, g1, b1] = [chroma, x, 0]
  } else if (hue1 >= 1 && hue1 <= 2) {
    [r1, g1, b1] = [x, chroma, 0]
  } else if (hue1 >= 2 && hue1 <= 3) {
    [r1, g1, b1] = [0, chroma, x]
  } else if (hue1 >= 3 && hue1 <= 4) {
    [r1, g1, b1] = [0, x, chroma]
  } else if (hue1 >= 4 && hue1 <= 5) {
    [r1, g1, b1] = [x, 0, chroma]
  } else if (hue1 >= 5 && hue1 <= 6) {
    [r1, g1, b1] = [chroma, 0, x]
  }

  const m = value - chroma
  const [r, g, b] = [r1 + m, g1 + m, b1 + m]

  return [255 * r, 255 * g, 255 * b]
}

export const xy2rgb = (x: number, y: number, radius: number) => {
  x -= radius
  y -= radius

  const [r, phi] = xy2polar(x, y)

  const hue = rad2deg(phi)
  const saturation = r / radius
  const value = 1.0

  return hsv2rgb(hue, saturation, value)
}

export const xy2Hex = (x: number, y: number, radius: number) => {
  x -= radius
  y -= radius

  const [r, phi] = xy2polar(x, y)

  const hue = rad2deg(phi)
  const saturation = r / radius
  const value = 1.0

  const rgb = hsv2rgb(hue, saturation, value)
  return rgb2Hex(~~rgb[0], ~~rgb[1], ~~rgb[2])
}

export const generateCoordinate = (pointNames: string[], radius: number) => {
  const range = 0.7 * radius
  return pointNames.reduce((obj: Record<string, Point>, pointName) => {
    obj[pointName] = {
      x: Math.abs(radius + Math.random() * range * 2 - range),
      y: Math.abs(radius + Math.random() * range * 2 - range),
    }
    return obj
  }, {})
}

const componentToHex = (c: number) => {
  const hex = c.toString(16)
  return hex.length == 1 ? '0' + hex : hex
}

export const rgb2Hex = (r: number, g: number, b: number) => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
}

export const drawCircle = (ctx: CanvasRenderingContext2D, radius: number) => {
  const image = ctx.createImageData(2 * radius, 2 * radius)
  const data = image.data

  for (let x = -radius; x < radius; x++) {
    for (let y = -radius; y < radius; y++) {
      const [r, phi] = xy2polar(x, y)

      const deg = rad2deg(phi)

      const rowLength = 2 * radius
      const adjustedX = x + radius
      const adjustedY = y + radius
      const pixelWidth = 4
      const index = (adjustedX + adjustedY * rowLength) * pixelWidth

      const hue = deg
      const saturation = r / radius
      const value = 1.0

      const [red, green, blue] = hsv2rgb(hue, saturation, value)
      const alpha = 255

      data[index] = red
      data[index + 1] = green
      data[index + 2] = blue
      data[index + 3] = alpha
    }
  }

  ctx.putImageData(image, 0, 0)
}
