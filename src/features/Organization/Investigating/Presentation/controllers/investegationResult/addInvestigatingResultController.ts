import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import AddInvestigatingResultUseCase from '../../../Domain/useCase/investegationResult/addInvestigatingResultUseCase'
import type InvestegationResultModel from '../../../Data/models/investigationResult/InvestegationResulModel'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import type AddInvestigationResultParams from '../../../Core/params/investegationResult/addInvestigationResultParams'
import { DataFailed } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ErrorModel, ErrorType } from '@/base/core/networkStructure/Resources/errors/errorModel'

export default class AddInvestigatingResultController extends ControllerInterface<InvestegationResultModel> {
  private static instance: AddInvestigatingResultController
  private constructor() {
    super()
  }
  private addInvestigatingResultUseCase = new AddInvestigatingResultUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddInvestigatingResultController()
    }
    return this.instance
  }

  private hasAssignedEmployee(employees: any[] = []) {
    return employees.some(
      (employee: any) => employee?.organization_employee_id || employee?.employee_name?.trim(),
    )
  }

  private validateTasks(tasks: any[] = [], label: string): string | null {
    for (const task of tasks) {
      if (!task?.title?.trim()) continue
      if (!this.hasAssignedEmployee(task?.investigation_task_employees)) {
        return `Please select an employee for all ${label} tasks`
      }
    }
    return null
  }

  private validateQuestions(questions: any[] = []): string | null {
    for (const question of questions) {
      const hasQuestion = !!question?.question?.trim()
      const hasAnswer = !!question?.answer?.trim()
      if (hasQuestion !== hasAnswer) {
        return 'Please add both question and answer for every 5 Why entry'
      }
    }
    return null
  }

  private validateTimelines(timelines: any[] = []): string | null {
    for (const timeline of timelines) {
      const hasTime = !!timeline?.time?.trim?.()
      const hasDescription = !!timeline?.description?.trim?.()
      if (hasTime !== hasDescription) {
        return 'Please add both time and description for every event timeline'
      }
    }
    return null
  }

  private validateWitnesses(witnesses: any[] = []): string | null {
    for (const witness of witnesses) {
      const hasEmployee = !!witness?.organizationEmployeeId || !!witness?.employeeName?.trim()
      if (!hasEmployee) continue

      const hasStatement = !!witness?.witnessesStatements?.trim()
      if (!hasStatement) {
        return 'Please add a statement for every witness'
      }
    }
    return null
  }

  private validateInjuries(injuries: any[] = []): string | null {
    for (const injury of injuries) {
      const hasEmployee = !!injury?.organizationEmployeeId || !!injury?.employeeName?.trim()
      if (!hasEmployee) continue

      if (!injury?.note?.trim()) {
        return 'Please add a description for every injury'
      }
      if (!injury?.injuryTypeId) {
        return 'Please select an injury type for every injury'
      }
    }
    return null
  }

  private validate(params: AddInvestigationResultParams): string | null {
    return (
      this.validateTasks(params.correctiveTasks, 'corrective') ??
      this.validateTasks(params.preventiveTasks, 'preventive') ??
      this.validateQuestions(params.FiveWhyQuestionsData) ??
      this.validateTimelines(params.eventTimeLines) ??
      this.validateWitnesses(params.witnesses) ??
      this.validateInjuries(params.Injury) ??
      null
    )
  }

  async addInvestigatingResult(params: AddInvestigationResultParams, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      // Validation Section Start
      const validationError = this.validate(params)
      if (validationError) {
        new OpenWarningDilaog(validationError).openDialog()
        this.setState(
          new DataFailed({ error: new ErrorModel(validationError, ErrorType.dataDirty) }),
        )
        return this.state
      }
      // Validation Section End

      const dataState: DataState<InvestegationResultModel> =
        await this.addInvestigatingResultUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        // await router.push('/organization/investigating')
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.error?.title ?? (error as string),
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
