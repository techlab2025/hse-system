import type Params from '@/base/core/params/params'
import type InvestigationEmployeesParams from '../InvestigationEmployeesParams'
import type InvestegationTasksParams from './InvestegationTasksParams'
import type InvestigationFactorParams from './InvestegationFactorParams'
import type InvestigationAttachmentsParams from './InvestegationAttachmentParams'
import type InvestegationWitnessesParams from './InvestegationWitnessesParams'
import type InvestegationAnotherMeetingParams from './InvestegationAnotherMeetingParams'
import type InvestigationFiveQuestionParams from './InvestegationFiveQuestoinsParams'
import type RootCausesIdParams from '@/features/Organization/ObservationFactory/Core/params/RootCausesIdParams'
import type InjuryParams from '@/features/Organization/ObservationFactory/Core/params/InjuriesParams'

export type InvestigationEventTimeLineParams = {
  time: string
  description: string
}

export default class AddInvestigationResultParams implements Params {
  public investigationMeetingId: number
  public isInvestigationClosed: number
  public observationId: number
  // public date: string
  // public hasEmployee: boolean
  public tasks?: InvestegationTasksParams[] | Record<string, any>[]
  public factors?: InvestigationFactorParams
  public documentation?: InvestigationAttachmentsParams[]
  public witnesses?: InvestegationWitnessesParams[]
  public isActionCorrect?: number
  public explainWhyText?: string
  public meeting?: InvestegationAnotherMeetingParams
  public corrective?: string
  public preventive?: string
  public RootCauses?: RootCausesIdParams[]
  public investegaionLevel?: number
  public FiveWhyQuestionsData?: InvestigationFiveQuestionParams[]
  public IncidantDescription?: string
  public isAnotherMeeting?: number
  public recommendation?: string
  public Injury?: InjuryParams[]
  public correctiveTasks?: InvestegationTasksParams[] | Record<string, any>[]
  public preventiveTasks?: InvestegationTasksParams[] | Record<string, any>[]
  public lessonLearnt?: string
  public documentReferenceIds?: number[]
  public eventTimeLines?: InvestigationEventTimeLineParams[]

  constructor(data: {
    investigationMeetingId: number
    isInvestigationClosed: number
    observationId: number
    // date: string,
    // hasEmployee: boolean,
    tasks?: InvestegationTasksParams[] | Record<string, any>[]
    factors?: InvestigationFactorParams
    documentation?: InvestigationAttachmentsParams[]
    witnesses?: InvestegationWitnessesParams[]
    isActionCorrect?: number
    explainWhyText?: string
    meeting?: InvestegationAnotherMeetingParams
    corrective?: string
    preventive?: string
    RootCauses?: RootCausesIdParams[]
    investegaionLevel?: number
    FiveWhyQuestionsData?: InvestigationFiveQuestionParams[]
    IncidantDescription?: string
    recommendation?: string
    isAnotherMeeting?: number
    Injury?: InjuryParams[]
    correctiveTasks?: InvestegationTasksParams[] | Record<string, any>[]
    preventiveTasks?: InvestegationTasksParams[] | Record<string, any>[]
    lessonLearnt?: string
    documentReferenceIds?: number[]
    eventTimeLines?: InvestigationEventTimeLineParams[]
  }) {
    this.investigationMeetingId = data.investigationMeetingId
    this.isInvestigationClosed = data.isInvestigationClosed
    this.observationId = data.observationId
    // this.date = date
    // this.hasEmployee = hasEmployee
    this.tasks = data.tasks
    this.factors = data.factors
    this.documentation = data.documentation
    this.witnesses = data.witnesses
    this.isActionCorrect = data.isActionCorrect
    this.explainWhyText = data.explainWhyText
    this.meeting = data.meeting
    this.corrective = data.corrective
    this.preventive = data.preventive
    this.RootCauses = data.RootCauses
    this.investegaionLevel = data.investegaionLevel
    this.FiveWhyQuestionsData = data.FiveWhyQuestionsData
    this.IncidantDescription = data.IncidantDescription
    this.recommendation = data.recommendation
    this.isAnotherMeeting = data.isAnotherMeeting
    this.Injury = data.Injury
    this.correctiveTasks = data.correctiveTasks
    this.preventiveTasks = data.preventiveTasks
    this.lessonLearnt = data.lessonLearnt
    this.documentReferenceIds = data.documentReferenceIds
    this.eventTimeLines = data.eventTimeLines
  }
  private filterTasks(tasks: any[] = []) {
    return tasks
      .filter((task) => task.title?.trim())
      .map((task) => ({
        ...task,
        investigation_task_employees: (task.investigation_task_employees ?? []).filter(
          (employee: any) => employee.organization_employee_id || employee.employee_name?.trim(),
        ),
      }))
  }

  private filterQuestions(questions: any[] = []) {
    return questions.filter((question) => question.question?.trim() || question.answer?.trim())
  }

  private filterTimelines(timelines: any[] = []) {
    return timelines.filter((timeline) => timeline.time?.trim() || timeline.description?.trim())
  }

  private filterWitnesses() {
    return (
      this.witnesses
        ?.map((witness) => witness.toMap())
        .filter((witness) =>
          Object.values(witness).some((value) =>
            typeof value === 'string' ? value.trim() : value !== null && value !== undefined,
          ),
        ) ?? []
    )
  }

  private hasMeetingData() {
    if (!this.meeting) return false

    const meeting = this.meeting.toMap()

    return !!meeting.place?.trim()
  }

  toMap(): Record<string, any> {
    const data: Record<string, any> = {}

    data['investigation_meeting_id'] = this.investigationMeetingId
    data['is_investigation_closed'] = this.isInvestigationClosed
    data['observation_id'] = this.observationId

    const tasks = this.filterTasks(this.tasks)
    if (tasks.length) {
      data['tasks'] = tasks
    }

    if (this.factors) {
      data['factors'] = this.factors
    }

    if (this.documentation) {
      data['documentation'] = [this.documentation]
    }

    const witnesses = this.filterWitnesses()
    if (witnesses.length) {
      data['witness_statements'] = witnesses
    }

    if (this.isActionCorrect !== undefined && this.isActionCorrect !== null) {
      data['is_action_correct'] = this.isActionCorrect === 1 ? false : true
    }

    if (this.explainWhyText?.trim()) {
      data['explain_why_text'] = this.explainWhyText
    }

    // if (this.hasMeetingData()) {
      data['meeting'] = this.meeting!.toMap()
    // }

    if (this.corrective) {
      data['corrective'] = this.corrective
    }

    if (this.preventive) {
      data['preventive'] = this.preventive
    }

    if (this.RootCauses?.length) {
      data['root_causes'] = this.RootCauses
    }

    if (this.investegaionLevel) {
      data['investigation_category'] = this.investegaionLevel
    }

    const questions = this.filterQuestions(this.FiveWhyQuestionsData)
    if (questions.length) {
      data['questions'] = questions
    }

    if (this.IncidantDescription?.trim()) {
      data['incidant_description'] = this.IncidantDescription
    }

    if (this.recommendation?.trim()) {
      data['recommendation'] = this.recommendation
    }

    if (this.isAnotherMeeting) {
      data['is_another_meeting'] = this.isAnotherMeeting
    }

    const correctiveTasks = this.filterTasks(this.correctiveTasks)
    if (correctiveTasks.length) {
      data['corrective_tasks'] = correctiveTasks
    }

    const preventiveTasks = this.filterTasks(this.preventiveTasks)
    if (preventiveTasks.length) {
      data['preventive_tasks'] = preventiveTasks
    }

    if (this.lessonLearnt?.trim()) {
      data['lesson_learnt'] = this.lessonLearnt
    }

    if (this.documentReferenceIds?.length) {
      data['document_reference_ids'] = this.documentReferenceIds
    }

    const timelines = this.filterTimelines(this.eventTimeLines)
    if (timelines.length) {
      data['event_timelines'] = timelines
    }

    if (this.Injury?.length) {
      data['injuries'] = this.Injury.map((item) => item.toMap())
    }

    return data
  }
}
