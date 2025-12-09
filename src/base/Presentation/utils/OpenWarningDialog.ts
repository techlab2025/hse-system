import DialogSelector from '../Dialogs/dialog_selector'
import warning from '@/assets/images/warning.png'

export class OpenWarningDilaog extends Error {
  constructor(public errorMessage: string) {
    super(`Validation failed: ${errorMessage}`)
    this.name = 'ValidationError'
  }

  openDialog() {
    DialogSelector.instance.failedDialog.openDialog({
      dialogName: 'dialog',
      titleContent: ``, //Validation failed
      imageElement: warning,
      messageContent: `  ${this.errorMessage}`,
    })
  }
}
