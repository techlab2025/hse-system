import { translate as localizeUi } from '@/localization/i18n'
// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type IndexOwnTaskModel from '../../../Data/models/IndexOwnTaskModel'
import ChangeTaskStatusUseCase from '../../../Domain/useCase/employeeTask/ChangeTaskStatusUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
// import TitleInterface from '@/base/Data/Models/title_interface'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'

export default class changeTaskStatusController extends SelectControllerInterface<IndexOwnTaskModel> {
  private static instance: changeTaskStatusController
  private constructor() {
    super()
  }
  private changeTaskStatusUseCase = new ChangeTaskStatusUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new changeTaskStatusController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<IndexOwnTaskModel> = await this.changeTaskStatusUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      DialogSelector.instance.successDialog.openDialog({
        dialogName: 'dialog-success',
        titleContent: localizeUi('Added was successful'),
        imageElement: successImage,
        messageContent: null,
      })
    } else {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
        imageElement: errorImage,
        messageContent: null,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
