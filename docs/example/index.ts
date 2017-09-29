import { ScopedScroll } from '../../lib/scoped-scroll'

const element = document.querySelector('section')
const scopedScroll = new ScopedScroll(element)
scopedScroll.init()

console.log('scoped', scopedScroll)
