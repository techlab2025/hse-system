export default class DialogService {
  openDialog({
    dialogName,
    imageElement = null,
    titleContent = null,
    messageContent = null,
  }: {
    dialogName: string
    imageElement: string | null
    titleContent: string | null
    messageContent: string | null
  }) {
    const dialog = document.querySelector<HTMLDialogElement>('.' + dialogName)
    if (!dialog) return

    const title = dialog.querySelector<HTMLElement>('.dialog-title')
    const message = dialog.querySelector<HTMLElement>('.dialog-message')
    const image = dialog.querySelector<HTMLImageElement>('.dialog-icon')

    dialog.showModal()
    if (image && typeof imageElement === 'string') {
      image.src = imageElement
    }
    if (message) message.textContent = messageContent
    if (title) title.textContent = titleContent
    if (dialogName == 'dialog-success') {
      setTimeout(() => {
        dialog.close()
      }, 1000)
    }
  }

  closeDialog(dialogName: string) {
    const dialog: HTMLDialogElement | null = document.querySelector(`.${dialogName}`)
    if (dialog) dialog.close()
  }

  returnValue(dialogName: string) {
    const dialog: HTMLDialogElement | null = document.querySelector(`.${dialogName}`)
    if (dialog) return dialog.returnValue
  }
}
