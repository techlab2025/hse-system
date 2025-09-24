import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import EditLocationUseCase from '../../Domain/useCase/editLocationUseCase'
import type LocationModel from '../../Data/models/LocationModel'
import LocationRouterHandler from '../routeHandler/RoutHandler'

export default class EditLocationController extends ControllerInterface<LocationModel> {
  private static instance: EditLocationController

  private constructor() {
    super()
  }

  private editLocationUseCase = new EditLocationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditLocationController()
    }
    return this.instance
  }

  async editLocation(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    console.log(params , "country param")
    try {
      const dataState: DataState<LocationModel> = await this.editLocationUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        // await router.push('/admin/locations_country')

        await router.push(LocationRouterHandler.LocationRouter(params.type))

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
