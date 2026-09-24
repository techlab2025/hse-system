import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import AddVisitActivityUseCase from '../../Domain/useCase/addVisitActivityUseCase'
import type VisitActivityModel from '../../Data/models/VisitActivityModel'
import AddVisitActivityParams from '../../Core/params/addVisitActivityParams'
import TranslationsParams from '@/base/core/params/translations_params'

export default class AddVisitActivityController extends ControllerInterface<VisitActivityModel> {
  private static instance: AddVisitActivityController
  private readonly addVisitActivityUseCase = new AddVisitActivityUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new AddVisitActivityController()
    return this.instance
  }

  async addVisitActivity(params: AddVisitActivityParams, router: Router, draft = false) {
    try {
      const validation = params.validate()
      if (!validation.isValid) {
        params.validateOrThrow()
        return
      }

      const dataState: DataState<VisitActivityModel> =
        await this.addVisitActivityUseCase.call(params)
      this.setLoading()
      this.setState(dataState)

      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (!draft) {
          const root = router.currentRoute.value.path.startsWith('/admin') ? '/admin' : '/organization'
          await router.push(`${root}/visit-activities`)
        }
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'An Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.error?.title ?? String(error),
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }

  async importVisitActivities(titles: string[], router: Router) {
    try {
      for (const title of titles) {
        const translations = new TranslationsParams(['en', 'ar'])
        translations.setTranslation('title', 'en', title)
        translations.setTranslation('title', 'ar', title)
        const dataState: DataState<VisitActivityModel> = await this.addVisitActivityUseCase.call(
          new AddVisitActivityParams(translations),
        )
        this.setLoading()
        this.setState(dataState)
        if (!this.isDataSuccess()) throw new Error(this.state.value.error?.title ?? 'Import failed')
      }

      DialogSelector.instance.successDialog.openDialog({
        dialogName: 'dialog-success',
        titleContent: 'Imported was successful',
        imageElement: successImage,
        messageContent: null,
      })
      const root = router.currentRoute.value.path.startsWith('/admin') ? '/admin' : '/organization'
      await router.push(`${root}/visit-activities`)
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.error?.title ?? String(error),
        imageElement: errorImage,
        messageContent: null,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }

  async addSystemVisitActivities(items: VisitActivityModel[]) {
  try {
    for (const item of items) {
      if (!item.title) {
        throw new Error('Visit Activity title is missing')
      }

      const translations = new TranslationsParams(['en', 'ar'])

      translations.setTranslation('title', 'en', item.title)
      translations.setTranslation('title', 'ar', item.title)

      const params = new AddVisitActivityParams(translations)

      const validation = params.validate()

      if (!validation.isValid) {
        params.validateOrThrow()
      }

      const dataState: DataState<VisitActivityModel> =
        await this.addVisitActivityUseCase.call(params)

      this.setState(dataState)

      if (!this.isDataSuccess()) {
        throw new Error(
          this.state.value.error?.title ?? 'Failed to add visit activity',
        )
      }
    }

    DialogSelector.instance.successDialog.openDialog({
      dialogName: 'dialog-success',
      titleContent: 'Added was successful',
      imageElement: successImage,
      messageContent: null,
    })

    return true
  } catch (error: unknown) {
    console.error('addSystemVisitActivities error:', error)

    DialogSelector.instance.failedDialog.openDialog({
      dialogName: 'dialog-error',
      titleContent:
        this.state.value.error?.title ??
        (error instanceof Error ? error.message : String(error)),
      imageElement: errorImage,
      messageContent: null,
    })

    return false
  } finally {
    super.handleResponseDialogs()
  }
}
}
