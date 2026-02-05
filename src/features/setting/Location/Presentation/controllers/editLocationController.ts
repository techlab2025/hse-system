import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import EditLocationUseCase from '../../Domain/useCase/editLocationUseCase'
import type LocationModel from '../../Data/models/LocationModel'
import LocationRouterHandler from '../routeHandler/RoutHandler'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import type EditLocationParams from '../../Core/params/editLocationParams'
import { LocationEnum } from '../../Core/Enum/LocationEnum'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'

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

  async editLocation(params: EditLocationParams, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    try {
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

        const { user } = useUserStore()
        const route = useRoute()
        await router.push(LocationRouterHandler.LocationRouter(params.type, user, route))

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
