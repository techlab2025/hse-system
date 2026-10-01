import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type InternalAuditModel from '../../Data/models/InternalAuditModel'
import type AddInternalAuditParams from '../../Core/params/addInternalAuditParams'
import AddInternalAuditUseCase from '../../Domain/useCase/addInternalAuditUseCase'

export default class AddInternalAuditController extends ControllerInterface<InternalAuditModel> {
  private static instance: AddInternalAuditController
  private useCase = new AddInternalAuditUseCase()
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new AddInternalAuditController()) }
  async addInternalAudit(params: AddInternalAuditParams, router: Router) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    if (this.isDataSuccess()) {
      DialogSelector.instance.successDialog.openDialog({ dialogName: 'dialog-success', titleContent: params.isDraft ? 'Audit draft saved' : 'Audit plan published', imageElement: successImage, messageContent: null })
      await router.push('/organization/internal-audit/register')
    } else {
      DialogSelector.instance.failedDialog.openDialog({ dialogName: 'dialog-error', titleContent: this.state.value.error?.title ?? 'An error occurred', imageElement: errorImage, messageContent: null })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
