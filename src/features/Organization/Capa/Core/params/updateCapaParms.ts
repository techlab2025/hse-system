import type Params from '@/base/core/params/params'

export default class updateCapaParms implements Params {
  public observationcapaId: number
  public verification_methodology: string
  public result_findings: string
  public verification_status: number

  constructor(data: {
    observationcapaId: number
    verification_methodology: string
    result_findings: string
    verification_status: number
  }) {
    this.observationcapaId = data.observationcapaId
    this.verification_methodology = data.verification_methodology
    this.result_findings = data.result_findings
    this.verification_status = data.verification_status
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    data['observation_capa_id'] = this.observationcapaId
    data['verification_methodology'] = this.verification_methodology
    data['result_findings'] = this.result_findings
    data['verification_status'] = this.verification_status
    return data
  }
}
