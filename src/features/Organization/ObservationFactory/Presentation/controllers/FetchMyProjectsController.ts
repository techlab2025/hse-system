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
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'
import FetchMyProjectsUseCase from '../../Domain/useCase/FetchMyProjectsUseCase'

export default class FetchMyProjectsController extends ControllerInterface<ProjectModel[]> {
  private static instance: FetchMyProjectsController
  private constructor() {
    super()
  }
  private fetchMyProjectsUseCase = new FetchMyProjectsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchMyProjectsController()
    }
    return this.instance
  }

  async FetchMyProjects(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      // console.log('Ssssssss')
      const dataState: DataState<ProjectModel[]> = await this.fetchMyProjectsUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        // DialogSelector.instance.successDialog.openDialog({
        //   dialogName: 'dialog',
        //   titleContent: 'Added was successful',
        //   imageElement: successImage,
        //   messageContent: null,
        // })

        const { user } = useUserStore()

        if (params.type == Observation.HazardType) {
          await router.push(`/organization/equipment/hazard`)
        } else if (params.type == Observation.ObservationType) {
          await router.push(`/organization/equipment/observation`)
        } else if (params.type == Observation.AccidentsType) {
          await router.push(`/organization/equipment/incedant`)
        }

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
