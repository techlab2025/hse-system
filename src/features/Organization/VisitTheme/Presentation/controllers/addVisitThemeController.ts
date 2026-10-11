import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import AddVisitThemeUseCase from '../../Domain/useCase/addVisitThemeUseCase'
import type VisitThemeModel from '../../Data/models/VisitThemeModel'
import AddVisitThemeParams from '../../Core/params/addVisitThemeParams'
import AddVisitThemeExcelParams from '../../Core/params/addVisitThemeExcelParams'

export default class AddVisitThemeController extends ControllerInterface<VisitThemeModel> {
  private static instance: AddVisitThemeController
  private readonly useCase = new AddVisitThemeUseCase()
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) this.instance = new AddVisitThemeController()
    return this.instance
  }
  async addVisitTheme(params: AddVisitThemeParams, router: Router, draft = false) {
    try {
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<VisitThemeModel> = await this.useCase.call(params)
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
          const root = router.currentRoute.value.path.startsWith('/admin')
            ? '/admin'
            : '/organization'
          await router.push(`${root}/visit-themes`)
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

  async importVisitThemes(titles: string[], router: Router) {
    try {
      const data = titles
        .map((title) => ({ title: String(title ?? '').trim() }))
        .filter((item) => item.title)

      if (!data.length) {
        throw new Error('At least one row is required')
      }

      const dataState: DataState<VisitThemeModel> = await this.useCase.call(
        new AddVisitThemeExcelParams({ data }),
      )
      this.setLoading()
      this.setState(dataState)

      if (!this.isDataSuccess()) throw new Error(this.state.value.error?.title ?? 'Import failed')

      DialogSelector.instance.successDialog.openDialog({
        dialogName: 'dialog-success',
        titleContent: 'Imported was successful',
        imageElement: successImage,
        messageContent: null,
      })
      const root = router.currentRoute.value.path.startsWith('/admin') ? '/admin' : '/organization'
      await router.push(root + '/visit-themes')
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

  async addSystemVisitThemes(items: VisitThemeModel[]) {
    try {
      const data = items
        .map((item) => ({ title: String(item.title ?? '').trim() }))
        .filter((item) => item.title)

      if (!data.length) {
        throw new Error('Visit Theme title is missing')
      }

      const dataState: DataState<VisitThemeModel> = await this.useCase.call(
        new AddVisitThemeExcelParams({ data }),
      )

      this.setLoading()
      this.setState(dataState)

      if (!this.isDataSuccess()) {
        throw new Error(this.state.value.error?.title ?? 'Import failed')
      }

      DialogSelector.instance.successDialog.openDialog({
        dialogName: 'dialog-success',
        titleContent: 'Added was successful',
        imageElement: successImage,
        messageContent: null,
      })

      return true
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.error?.title ?? String(error),
        imageElement: errorImage,
        messageContent: null,
      })

      return false
    } finally {
      super.handleResponseDialogs()
    }
  }
}
