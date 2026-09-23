import OrganizatoinEmployeeDetailsModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeDetailsModel'
import RiskAssessmentMediaModel from './RiskAssessmentMediaModel'

export default class RiskAssessmentModel {
  constructor(
    public activity: string,
    public desctiprion: string,
    public workAreaStrign: string,
    public date: string,
    public employeeApproverId: OrganizatoinEmployeeDetailsModel,
    public media: RiskAssessmentMediaModel[],
    public id?: number,
  ) {}

  static fromMap(data: Record<string, unknown>): RiskAssessmentModel {
    return new RiskAssessmentModel(
      String(data.activity ?? ''),
      String(data.activity_description ?? data.description ?? ''),
      String(data.work_area ?? data.work_area_strign ?? ''),
      String(data.date ?? ''),
      OrganizatoinEmployeeDetailsModel.fromMap(
        data.creatable ?? data.employee_approver ?? data.employee ?? {},
      ),
      Array.isArray(data.media)
        ? data.media.map((item: unknown) => RiskAssessmentMediaModel.fromMap(item))
        : [],
      data.id == null ? undefined : Number(data.id),
    )
  }
}
