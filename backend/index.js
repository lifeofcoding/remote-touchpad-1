// this is file contains the main functionality of the remote touchpad
// you can connect with any WebSocket library and control the mouse

const robot = require('robotjs')
const WebSocket = require('ws')

const startFrontendServer = require('./serve_frontend')

function acceleratedDelta(body, sensitivity) {
    return {
        x: Math.sign(body.deltaX) * Math.ceil(body.deltaX * sensitivity * body.velocityX),
        y: Math.sign(body.deltaY) * Math.ceil(body.deltaY * sensitivity * body.velocityY),
    }
}

const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message)
        if (data.type === 'click') {
            robot.mouseClick(data.button)
        } else if (data.type === 'move') {
            const mousePos = robot.getMousePos()
            const move = acceleratedDelta(data, 2.0)
            robot.moveMouse(mousePos.x + move.x, mousePos.y + move.y)
        } else if (data.type === 'scroll') {
            const move = acceleratedDelta(data, 2.0)
            robot.scrollMouse(move.x, move.y)
        }
    })
})

startFrontendServer()
