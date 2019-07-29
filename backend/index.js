const os = require('os');
const express = require('express')
const robot = require('robotjs')
const open = require('open')
const qr = require('qrcode')

const app = express()
const port = 3000

app.set('views', './frontend')
app.set('view engine', 'pug')

app.use(express.urlencoded({
    extended: true,
}))

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

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
    // open a web page with instructions on how to use the software
    open(`http://localhost:${port}/qr`)
})
