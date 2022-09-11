// import Counter from "../root/modules/Counter"


// required
export const rootSelector = '#root'
// required
export const $root = document.querySelector(rootSelector)

export const $body = document.body

export const viewportWidth = $body.offsetWidth

export const viewportHeight = $body.offsetHeight

export const pageWidth = $root.offsetWidth

export const pageHeight = $root.offsetHeight

export const viewportPoints = {
   desktopWide: 1920,
   desktop: 1280,
   tabletWide: 1024,
   tablet: 768,
   mobile: 480,
}
// required
export const modules = {
   // 'Counter': new Counter('#counter'),
}