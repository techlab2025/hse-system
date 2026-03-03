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
    const dialog: HTMLDialogElement | null = document.querySelector(`.${dialogName}`)
    let title: HTMLElement | null
    let message: HTMLElement | null
    let image: HTMLImageElement | null

    // 0 is Main Dialog and Success Dialog
    // 1 is Error Dialog
    if (dialogName == 'dialog-success') {
      title = document.querySelectorAll(`.dialog-title`)[0]
      message = document.querySelectorAll(`.dialog-message`)[0]
      image = document.querySelectorAll(`.dialog-icon`)[0]
    } else {
      title = document.querySelectorAll(`.dialog-title`)[1]
      message = document.querySelectorAll(`.dialog-message`)[1]
      image = document.querySelectorAll(`.dialog-icon`)[1]
    }

    if (dialog) {
      dialog.showModal()
      if (image)
        if (typeof imageElement === 'string') {
          image.src = imageElement
        }
      if (message) message.textContent = messageContent
      if (title) title.textContent = titleContent
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
