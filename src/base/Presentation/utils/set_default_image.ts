export function setDefaultImage(event: Event, defaultImage: string = '/src/assets/images/logo.svg') {
  if (event.target instanceof HTMLImageElement) event.target.src = defaultImage
}
