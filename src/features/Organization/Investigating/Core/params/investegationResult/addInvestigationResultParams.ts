import type Params from '@/base/core/params/params'
import type InvestigationEmployeesParams from '../InvestigationEmployeesParams'
import type InvestegationTasksParams from './InvestegationTasksParams'
import type InvestigationFactorParams from './InvestegationFactorParams'
import type InvestigationAttachmentsParams from './InvestegationAttachmentParams'
import type InvestegationWitnessesParams from './InvestegationWitnessesParams'
import type InvestegationAnotherMeetingParams from './InvestegationAnotherMeetingParams'

export default class AddInvestigationResultParams implements Params {
  public investigationMeetingId: number
  public isInvestigationClosed: number
  public observationId: number
  // public date: string
  // public hasEmployee: boolean
  public tasks?: InvestegationTasksParams[]
  public factors?: InvestigationFactorParams
  public documentation?: InvestigationAttachmentsParams[]
  public witnesses?: InvestegationWitnessesParams[]
  public isActionCorrect?: number
  public explainWhyText?: string
  public meeting?: InvestegationAnotherMeetingParams
  public corrective?: string

  constructor(data: {
    investigationMeetingId: number
    isInvestigationClosed: number
    observationId: number
    // date: string,
    // hasEmployee: boolean,
    tasks?: InvestegationTasksParams[]
    factors?: InvestigationFactorParams
    documentation?: InvestigationAttachmentsParams[]
    witnesses?: InvestegationWitnessesParams[]
    isActionCorrect?: number
    explainWhyText?: string
    meeting?: InvestegationAnotherMeetingParams
    corrective?: string
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
  }

  toMap(): Record<string, number | string | any> {
    const data: Record<string, number | string | any> = {}
    data['investigation_meeting_id'] = this.investigationMeetingId
    data['is_investigation_closed'] = this.isInvestigationClosed
    data['observation_id'] = this.observationId
    // data['date'] = this.date
    // data['has_employee'] = this.hasEmployee
    if (this.tasks?.length > 0) data['tasks'] = this.tasks
    if (this.factors) data['factors'] = this.factors
    if (this.documentation) data['documentation'] = [this.documentation]
    if (this.witnesses?.length > 0)
      data['witness_statements'] = this.witnesses?.map((item) => item.toMap())
    if (this.isActionCorrect) data['is_action_correct'] = this.isActionCorrect == 1 ? false : true
    if (this.explainWhyText) data['explain_why_text'] = this.explainWhyText
    if (this.meeting) data['meeting'] = this.meeting
    if (this.corrective) data['corrective'] = this.corrective
    return data
  }
}
