import { watch } from 'vue'
import { i18n } from '@/localization/i18n'
import { translateMessage } from '@/localization/messages'
const openMessages = new Map<HTMLDialogElement, { title: string | null; message: string | null }>()
const renderMessage = (
  dialog: HTMLDialogElement,
  value: { title: string | null; message: string | null },
) => {
  const title = dialog.querySelector<HTMLElement>('.dialog-title')
  const message = dialog.querySelector<HTMLElement>('.dialog-message')
  if (title) title.textContent = translateMessage(value.title)
  if (message) message.textContent = translateMessage(value.message)
}
watch(i18n.global.locale, () => {
  for (const [dialog, value] of openMessages) {
    if (dialog.isConnected && dialog.open) renderMessage(dialog, value)
    else openMessages.delete(dialog)
  }
})

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

    const image = dialog.querySelector<HTMLImageElement>('.dialog-icon')

    dialog.showModal()
    if (image && typeof imageElement === 'string') {
      image.src = imageElement
    }
    const value = { title: titleContent, message: messageContent }
    openMessages.set(dialog, value)
    renderMessage(dialog, value)
    dialog.addEventListener('close', () => openMessages.delete(dialog), { once: true })
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
