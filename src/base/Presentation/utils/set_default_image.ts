// import defaultLogo from '@/assets/images/logo.svg'

// export function setDefaultImage(
//   event: Event,
//   defaultImage: string = '/src/assets/images/logo.svg',
// ) {
//   if (event.target instanceof HTMLImageElement) event.target.src = defaultImage
// }

import defaultLogo from '@/assets/images/logo.svg'

export function setDefaultImage(event: Event) {
  const img = event.target as HTMLImageElement
  img.src = defaultLogo
}
