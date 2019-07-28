const express = require('express')
const robot = require('robotjs')

const app = express()
const port = 3000

app.use(express.urlencoded({
    extended: true,
}))

app.use('/', express.static('frontend'))

app.post('/click', (req, res) => {
    res.send(`Got click on button ${req.body.button}`)
    robot.mouseClick(req.body.button)
})

app.post('/drag', (req, res) => {
    res.send(`Drag in ${req.body.deltaX}, ${req.body.deltaY} direction`)
    const delta = {
        x: parseInt(req.body.deltaX),
        y: parseInt(req.body.deltaY),
    }
    const mousePos = robot.getMousePos()
    robot.moveMouse(mousePos.x + delta.x, mousePos.y + delta.y)
})

app.post('/scroll', (req, res) => {
    res.send(`Scroll in ${req.body.deltaX}, ${req.body.deltaY} direction`)
    robot.scrollMouse(parseInt(req.body.deltaX), parseInt(req.body.deltaY))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
