import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type Params from '@/base/core/params/params'
import DrillModel from '../../../Data/models/Drill/DrillModel'
import AddDrillUseCase from '../../../Domain/useCase/Drill/AddDrillUseCase'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'

export default class AddDrillController extends ControllerInterface<DrillModel> {
  private static instance: AddDrillController
  private readonly useCase = new AddDrillUseCase()
  private constructor() { super() }
  static getInstance() {
    if (!this.instance) this.instance = new AddDrillController() 
    return this.instance
  }
  // async addDrill(params: Params) {
  //   this.setLoading()
  //   this.setState(await this.useCase.call(params))
  //   super.handleResponseDialogs()
  //   return this.state
  // }
    async addDrill(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<DrillModel> = await this.useCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        // if (!draft) await router.push('/organization/project-details')
        // if (!draft) await router.push('/organization/projects')

        // useLoaderStore().endLoadingWithDialog();
        console.log(this.state.value.error?.title, "error title")
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
        console.log(this.state.value, "error title")
      }
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.error?.title ?? (error as string),
        imageElement: errorImage,
        messageContent: null,
      })
      console.log(this.state.value, "error title")
    }

    super.handleResponseDialogs()
    return this.state
  }
}
