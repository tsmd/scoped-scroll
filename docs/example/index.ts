import { ScopedScroll } from 'scoped-scroll'

const element = document.querySelector('section')
const scopedScroll = new ScopedScroll(element)
scopedScroll.init()

document.querySelector('#enable').addEventListener('click', () => {
  scopedScroll.enable()
})

document.querySelector('#disable').addEventListener('click', () => {
  scopedScroll.disable()
})

console.log('scoped', scopedScroll)
