import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type TemplateModel from '../../Data/models/TemplateModel'
import AddTemplateUseCase from '../../Domain/useCase/addTemplateUseCase'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
import type AddTemplateParams from '../../Core/params/addTemplateParams'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import { ActionsEnum } from '@/features/setting/TemplateItem/Core/Enum/ActionsEnum'

export default class AddTemplateController extends ControllerInterface<TemplateModel> {
  private static instance: AddTemplateController
  private constructor() {
    super()
  }
  private AddTemplateUseCase = new AddTemplateUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddTemplateController()
    }
    return this.instance
  }

  async addTemplate(params: AddTemplateParams, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }

      // const IsRadionMoreThanOne = params?.items?.map((el) => {
      //   return (
      //     (el?.type == ActionsEnum.RADIOBUTTON || el?.type == ActionsEnum.CHECKBOX) &&
      //     el.answers?.length > 1
      //   )
      // })

      // const IsItemTitle = params?.items?.map((el) => {
      //   return el?.title?.length > 0
      // })

      // const IsOptionTitle = params?.items?.map((el) => {
      //   const checks = el?.answers?.map((option) => {
      //     return option?.title?.length > 1
      //   })
      //   return checks.includes(false)
      // })

      // // if (Number(params?.action) != ActionsEnum.TEXTAREA && IsOptionTitle) {
      // //   new OpenWarningDilaog('Option Title Should Be More Than One').openDialog()
      // //   return
      // // }

      // // if (IsItemTitle) {
      // //   new OpenWarningDilaog('Item Title Should Be More Than One').openDialog()
      // //   return
      // // }

      // if (
      //   (Number(params?.action) == ActionsEnum.RADIOBUTTON ||
      //     Number(params?.action) == ActionsEnum.CHECKBOX) &&
      //   IsRadionMoreThanOne.includes(false)
      // ) {
      //   new OpenWarningDilaog('Radio Type or checkbox type Should Be More Than One').openDialog()
      //   return
      // }

      // const showWarning = (message: string) => {
      //   new OpenWarningDilaog(message).openDialog()
      // }

      // for (const item of params.items) {
      //   if (!item.title || !item.title.trim()) {
      //     showWarning('Template title is required')
      //     return
      //   }

      //   if (!Array.isArray(item.answers) || item.answers.length < 1) {
      //     showWarning('At least one option is required')
      //     return
      //   }

      //   if (
      //     [ActionsEnum.RADIOBUTTON, ActionsEnum.CHECKBOX].includes(Number(item.type)) &&
      //     item.answers.length < 2
      //   ) {
      //     showWarning('Radio or Checkbox should have more than one option')
      //     return
      //   }

      //   const hasEmptyOptionTitle = item.answers.some(
      //     (option: any) => !option.title || !option.title.trim(),
      //   )

      //   if (hasEmptyOptionTitle) {
      //     showWarning('Option title is required')
      //     return
      //   }
      // }

      const dataState: DataState<TemplateModel> = await this.AddTemplateUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()
        // if (!draft)
        // await router.push(
        //   // `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/template`,
        // )

        // useLoaderStore().endLoadingWithDialog();
        // if (!router.currentRoute.value?.fullPath.includes('project-progress')) {
        //   if (!draft)
        //     await router.push(
        //       `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/template`,
        //     )
        // }
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
