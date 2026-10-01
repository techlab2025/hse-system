import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type InternalAuditPlanModel from '../../../Data/models/plan/InternalAuditPlanModel'
import type AddInternalAuditPlanParams from '../../../Core/params/plan/addInternalAuditPlanParams'
import AddInternalAuditPlanUseCase from '../../../Domain/useCase/plan/addInternalAuditPlanUseCase'

export default class AddInternalAuditPlanController extends ControllerInterface<InternalAuditPlanModel> {
  private static instance: AddInternalAuditPlanController
  private useCase = new AddInternalAuditPlanUseCase()
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new AddInternalAuditPlanController()) }
  async addInternalAuditPlan(params: AddInternalAuditPlanParams, router: Router) {
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
