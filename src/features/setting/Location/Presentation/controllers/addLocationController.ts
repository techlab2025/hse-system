import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type LocationModel from '../../Data/models/LocationModel'
import AddLocationUseCase from '../../Domain/useCase/addLocationUseCase'
import LocationRouterHandler from '../routeHandler/RoutHandler'
import type AddLocationParams from '../../Core/params/addLocationParams'
import { useUserStore } from '@/stores/user'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import { LocationEnum } from '../../Core/Enum/LocationEnum'

export default class AddLocationController extends ControllerInterface<LocationModel> {
  private static instance: AddLocationController
  private constructor() {
    super()
  }
  private addLocationUseCase = new AddLocationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddLocationController()
    }
    return this.instance
  }

  async addLocation(params: AddLocationParams, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      if (!params?.ParentId && params?.type === LocationEnum.AREA) {
        new OpenWarningDilaog('Please Select City').openDialog()
        return
      } else if (!params?.ParentId && params?.type === LocationEnum.STATE) {
        new OpenWarningDilaog('Please Select Country').openDialog()
        return
      } else if (!params?.ParentId && params?.type === LocationEnum.CITY) {
        new OpenWarningDilaog('Please Select State').openDialog()
        return
      }
      const dataState: DataState<LocationModel> = await this.addLocationUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        // if (!draft) await router.push('/admin/locations_country')

        const { user } = useUserStore()
        await router.push(LocationRouterHandler.LocationRouter(params.type, user))

        // useLoaderStore().endLoadingWithDialog();
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.error?.title ?? (error as string),
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
