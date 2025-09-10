export function setDefaultImage(event: Event, defaultImage: string = '/src/assets/images/logo.png') {
  if (event.target instanceof HTMLImageElement) event.target.src = defaultImage
}
