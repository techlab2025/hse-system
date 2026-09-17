import type { VerificationEnum } from '../../Core/Core/VerificationEnum'

export default class FetchInvestigationTaskVerificationModel {
  public verificationMethodology: string
  public resultFindings: string
  public verificationStatus: VerificationEnum

  constructor(data: {
    verificationMethodology?: string
    resultFindings?: string
    verificationStatus?: VerificationEnum
  }) {
    this.verificationMethodology = data.verificationMethodology ?? ''
    this.resultFindings = data.resultFindings ?? ''
    this.verificationStatus = data.verificationStatus ?? 0
  }

  static fromMap(data: any): FetchInvestigationTaskVerificationModel {
    return new FetchInvestigationTaskVerificationModel({
      verificationMethodology: data?.verification_methodology ?? data?.verificationMethodology ?? '',
      resultFindings: data?.result_findings ?? data?.resultFindings ?? '',
      verificationStatus: data?.verification_status ?? data?.verificationStatus ?? 0,
    })
  }
}
