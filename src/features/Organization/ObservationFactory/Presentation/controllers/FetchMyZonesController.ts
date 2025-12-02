import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Observation } from '../../Core/Enums/ObservationTypeEnum'
import type MyZonesModel from '../../Data/models/MyZonesModel'
import FetchMyZonesUseCase from '../../Domain/useCase/fetchMyZonesUseCase'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'

export default class FetchMyZonesController extends SelectControllerInterface<MyZonesModel[]> {
  private static instance: FetchMyZonesController
  private constructor() {
    super()
  }
  private fetchMyZonesUseCase = new FetchMyZonesUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchMyZonesController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    // this.setLoading()
    const dataState: DataState<MyZonesModel[]> = await this.fetchMyZonesUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      // useLoaderStore().endLoadingWithDialog();
    } else {
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }

  async FetchMyZones(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      // console.log('Ssssssss')
      const dataState: DataState<MyZonesModel[]> = await this.fetchMyZonesUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        // DialogSelector.instance.successDialog.openDialog({
        //   dialogName: 'dialog',
        //   titleContent: 'Added was successful',
        //   imageElement: successImage,
        //   messageContent: null,
        // })

        const { user } = useUserStore()

        // if (params.type == Observation.HazardType) {
        //   await router.push(`/organization/hazard`)
        // } else if (params.type == Observation.ObservationType) {
        //   await router.push(`/organization/observation`)
        // } else if (params.type == Observation.AccidentsType) {
        //   await router.push(`/organization/incedant`)
        // }

        // useLoaderStore().endLoadingWithDialog();
      } else {
        // DialogSelector.instance.failedDialog.openDialog({
        //   dialogName: 'dialog',
        //   titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
        //   imageElement: errorImage,
        //   messageContent: null,
        // })
      }
    } catch (error: unknown) {
      // DialogSelector.instance.failedDialog.openDialog({
      //   dialogName: 'dialog',
      //   titleContent: this.state.value.error?.title ?? (error as string),
      //   imageElement: errorImage,
      //   messageContent: null,
      // })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
