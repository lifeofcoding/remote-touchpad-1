const hammerElement = document.querySelector('#hammer')
const hammertime = new Hammer(hammerElement, {})
hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
hammertime.add(new Hammer.Tap({ event: 'twotap', pointers: 2, taps: 1 }))
hammertime.add(new Hammer.Pan({ event: 'scroll', pointers: 2 }))

let lastCenter;
let lastScroll;

hammertime.on('panstart', (ev) => {
    lastCenter = ev.center
})

hammertime.on('pan', (ev) => {
    const deltaX = ev.center.x - lastCenter.x
    const deltaY = ev.center.y - lastCenter.y
    lastCenter = ev.center
    fetch('/move', {
        method: 'POST',
        body: new URLSearchParams(`deltaX=${deltaX}&deltaY=${deltaY}`)
    })
})

hammertime.on('tap', () => {
    const params = new URLSearchParams('button=left')
    fetch('/click', {
        method: 'POST',
        body: params,
    })
})

hammertime.on('twotap', () => {
    const params = new URLSearchParams('button=right')
    fetch('/click', {
        method: 'POST',
        body: params,
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
        body: new URLSearchParams(`deltaX=${deltaX}&deltaY=${deltaY}`)
    })
})