import { ScopedScroll } from '../../lib/scoped-scroll'

var element = document.querySelector('section')
var scopedScroll = new ScopedScroll(element)
scopedScroll.init()

document.querySelector('#enable').addEventListener('click', function () {
  scopedScroll.enable()
})

document.querySelector('#disable').addEventListener('click', function () {
  scopedScroll.disable()
})

console.log('scoped', scopedScroll)
