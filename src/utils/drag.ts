export const distance = (p0, p1) => {
    const dx = p1.x - p0.x
    const dy = p1.y - p0.y
    return Math.sqrt(dx * dx + dy * dy)
}
export const distanceXY = (x0, y0, x1, y1) => {
    const dx = x1 - x0
    const dy = y1 - y0
    return Math.sqrt(dx * dx + dy * dy)
}
export const circleCollision = (c0, c1) => {
    return distance(c0, c1) <= c0.radius + c1.radius
}
export const circlePointCollision = (x, y, circle) => {
    return distanceXY(x, y, circle.x, circle.y) < circle.radius
}