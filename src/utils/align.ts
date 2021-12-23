export const transformPoint = (point) => {
  return point.reduce((acc, cur) => [...acc, [cur.x, cur.y]], [])
}
