const hammerElement = document.querySelector('#hammer')
const hammertime = new Hammer(hammerElement, {})
hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
hammertime.add(new Hammer.Tap({ event: 'twotap', pointers: 2, taps: 1 }))
hammertime.add(new Hammer.Pan({ event: 'scroll', pointers: 2 }))

let lastCenter;
let lastScroll;

const jsonContent = { 'Content-Type': 'application/json '}

hammertime.on('panstart', (ev) => {
    lastCenter = ev.center
})

hammertime.on('pan', (ev) => {
    const deltaX = ev.center.x - lastCenter.x
    const deltaY = ev.center.y - lastCenter.y
    lastCenter = ev.center
    fetch('/move', {
        method: 'POST',
        headers: jsonContent,
        body: JSON.stringify({
            deltaX,
            deltaY,
            velocity: ev.velocity,
            velocityX: ev.velocityX,
            velocityY: ev.velocityY,
        }),
    })
})

hammertime.on('tap', () => {
    fetch('/click', {
        method: 'POST',
        headers: jsonContent,
        body: JSON.stringify({button: 'left'}),
    })
})

hammertime.on('twotap', () => {
    fetch('/click', {
        method: 'POST',
        headers: jsonContent,
        body: JSON.stringify({button: 'right'}),
    })
})

hammertime.on('scrollstart', (ev) => {
    lastScroll = ev.center
})

hammertime.on('scroll', (ev) => {
    const deltaX = ev.center.x - lastScroll.x
    const deltaY = ev.center.y - lastScroll.y
    lastScroll = ev.center
    fetch('/scroll', {
        method: 'POST',
        headers: jsonContent,
        body: JSON.stringify({
            deltaX,
            deltaY
        }),
    })
})