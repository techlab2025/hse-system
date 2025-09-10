import ShowSuccessDialog from '@/base/presentation/Dialogs/MainDialogs/success_dialog'
import ShowFailedDialog from '@/base/presentation/Dialogs/MainDialogs/failed_dialog'
import ShowDeleteDialog from '@/base/presentation/Dialogs/MainDialogs/delete_dialog'

export default class DialogSelector {
  private static _instance: DialogSelector
  private constructor() { }
  static get instance() {
    if (!DialogSelector._instance) {
      DialogSelector._instance = new DialogSelector()
    }
    return DialogSelector._instance
  }

  public successDialog: ShowSuccessDialog = ShowSuccessDialog.instance
  public failedDialog: ShowFailedDialog = ShowFailedDialog.instance
  public deleteDialog: ShowDeleteDialog = ShowDeleteDialog.instance
}
