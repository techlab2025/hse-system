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
  }

  toMap(): Record<string, number | string | any> {
    const data: Record<string, number | string | any> = {}
    data['investigation_meeting_id'] = this.investigationMeetingId
    data['is_investigation_closed'] = this.isInvestigationClosed
    data['observation_id'] = this.observationId
    // data['date'] = this.date
    // data['has_employee'] = this.hasEmployee
    data['tasks'] = this.tasks
    if (this.factors) data['factors'] = this.factors
    if (this.documentation) data['documentation'] = [this.documentation]

    data['witness_statements'] = this.witnesses?.map((item) => item.toMap())
    if (this.isActionCorrect) data['is_action_correct'] = this.isActionCorrect == 1 ? false : true
    if (this.explainWhyText) data['explain_why_text'] = this.explainWhyText
    if (this.meeting) data['meeting'] = this.meeting.toMap()
    if (this.corrective) data['corrective'] = this.corrective
    if (this.preventive) data['preventive'] = this.preventive
    if (this.RootCauses) data['root_causes'] = this.RootCauses
    if (this.investegaionLevel) data['investigation_category'] = this.investegaionLevel
    if (this.FiveWhyQuestionsData) data['questions'] = this.FiveWhyQuestionsData
    if (this.IncidantDescription) data['incidant_description'] = this.IncidantDescription
    if (this.recommendation) data['recommendation'] = this.recommendation
    if (this.isAnotherMeeting) data['is_another_meeting'] = this.isAnotherMeeting
    if (this.correctiveTasks) data['corrective_tasks'] = this.correctiveTasks
    if (this.preventiveTasks) data['preventive_tasks'] = this.preventiveTasks
    if (this.lessonLearnt) data['lesson_learnt'] = this.lessonLearnt
    if (this.documentReferenceIds) data['document_reference_ids'] = this.documentReferenceIds

    data['injuries'] = this.Injury?.map((item) => item.toMap())
    return data
  }
}
