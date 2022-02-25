import { useRef, useEffect, useState } from 'react'
import { circlePointCollision } from 'utils/drag'

export const DragImage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvas = canvasRef.current

  if (canvas) {
    const ctx = canvas?.getContext('2d')
    const w = window.innerWidth
    const h = window.innerHeight
    const handle = {
      x: (canvas.width = w) / 2,
      y: (canvas.height = h) / 2,
      radius: 20,
    }
    const offset: {
      x?: number
      y?: number
    } = {}

    const draw = () => {
      if (ctx) {
        ctx.clearRect(0, 0, w, h)
        ctx.fillStyle = 'blue'
        ctx.beginPath()
        ctx.arc(handle.x, handle.y, handle.radius, 0, Math.PI * 2, false)
        ctx.fill()
      }
    }
    draw()

    const onMouseMove = (event) => {
      handle.x = event.clientX // - offset.x;
      handle.y = event.clientY // - offset.y;
      draw()
    }
    const onMouseUp = (event) => {
      document.body.removeEventListener('mousemove', onMouseMove)
      document.body.removeEventListener('mouseup', onMouseUp)
    }

    document.body.addEventListener('mousedown', function (event) {
      if (circlePointCollision(event.clientX, event.clientY, handle)) {
        document.body.addEventListener('mousemove', onMouseMove)
        document.body.addEventListener('mouseup', onMouseUp)
        offset.x = event.clientX - handle.x
        offset.y = event.clientY - handle.y
      }
    })
  }
  return <canvas height={500} width={500} ref={canvasRef} />
}
