// this file serves the frontend to the user

const express = require('express')
const qr = require('qrcode')
const open = require('open')
const os = require('os')

function startFrontendServer() {
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
        } else if (addresses.length === 0) {
            console.warn('Could not determine the address of your computer. Check your internet connection and restart the server')
        }
        // qr.toString(`http://${addresses[0]}:${port}`, { type: 'svg' })
        qr.toDataURL(`http://${addresses[0]}:${port}`)
            .then(url => res.render('qr', {
                port,
                address: addresses[0],
                qr: url,
            }))
            .catch(err => console.error(err))
    })

    app.listen(port, () => {
        console.log(`Listening on port ${port}`)
        // open a web page with instructions on how to use the software
        open(`http://localhost:${port}/qr`)
    })
}

module.exports = startFrontendServer
