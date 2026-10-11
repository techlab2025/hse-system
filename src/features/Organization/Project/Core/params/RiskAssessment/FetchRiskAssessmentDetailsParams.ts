import type Params from '@/base/core/params/params'

export default class FetchRiskAssessmentDetailsParams implements Params {
  constructor(public riskAssessmentId: number) { }
  toMap(): Record<string, number> { return { risk_assessment_id: this.riskAssessmentId } }
}
