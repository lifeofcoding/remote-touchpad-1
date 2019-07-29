const os = require('os');
const express = require('express')
const robot = require('robotjs')
const open = require('open')
const qr = require('qrcode')

function acceleratedDelta(body, sensitivity) {
    return {
        x: Math.sign(body.deltaX) * Math.ceil(body.deltaX * sensitivity * body.velocityX),
        y: Math.sign(body.deltaY) * Math.ceil(body.deltaY * sensitivity * body.velocityY),
    }
}

const app = express()
const port = 3000

app.set('views', './frontend')
app.set('view engine', 'pug')

app.use(express.json())

app.use('/', express.static('frontend'))

app.get('/qr', (req, res) => {
    // what's my ip
    // inspired by https://stackoverflow.com/a/8440736
    const addresses = Object.values(os.networkInterfaces()).reduce((prev, ifaces) => {
        const ifAddresses = ifaces
        .map((iface) => {
            if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return undefined
            }
            return iface.address
        })
        .filter(v => v !== undefined)
        return [...prev, ...ifAddresses]
    }, []);
    if (addresses.length > 1) {
        console.warn('Not tested')
    }
    qr.toDataURL(`http://${addresses[0]}:${port}`)
        .then(url => res.render('qr', {
            port,
            address: addresses[0],
            qr: url,
        }))
        .catch(err => console.error(err))
})

app.post('/click', (req, res) => {
    res.sendStatus(200)
    robot.mouseClick(req.body.button)
})

app.post('/move', (req, res) => {
    res.sendStatus(200)
    const mousePos = robot.getMousePos()
    const move = acceleratedDelta(req.body, 2.0)
    robot.moveMouse(mousePos.x + move.x, mousePos.y + move.y)
})

app.post('/scroll', (req, res) => {
    res.sendStatus(200)
    const move = acceleratedDelta(req.body, 2.0)
    robot.scrollMouse(move.x, move.y)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
    // open a web page with instructions on how to use the software
    open(`http://localhost:${port}/qr`)
})
