import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type ProjectTypeModel from '@/features/setting/ProjectType/Data/models/projectTypeModel.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import EditProjectTypeUseCase from '@/features/setting/ProjectType/Domain/useCase/editProjectTypeUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'

export default class EditProjectTypeController extends ControllerInterface<ProjectTypeModel> {
  private static instance: EditProjectTypeController

  private constructor() {
    super()
  }

  private EditProjectTypeUseCase = new EditProjectTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditProjectTypeController()
    }
    return this.instance
  }

  async editProjectType(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<ProjectTypeModel> = await this.EditProjectTypeUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        await router.push('/admin/project-types')
        // console.log(this.state.value.data)
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: any) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    return this.state
  }
}
