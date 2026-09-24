import TitleInterface from '@/base/Data/Models/title_interface'
import OrganizatoinEmployeeDetailsModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeDetailsModel'
import LeadershipVisitReportModel from './LeadershipVisitReportModel'

type DataMap = Record<string, unknown>

const asMap = (value: unknown): DataMap =>
  value && typeof value === 'object' ? (value as DataMap) : {}
const firstItem = (value: unknown): unknown => (Array.isArray(value) ? value[0] : undefined)

export default class LeadershipVisitModel {
  constructor(
    public id: number,
    public date: string,
    public location: string,
    public organizationEmployeeName: OrganizatoinEmployeeDetailsModel,
    public visitActivityName: TitleInterface,
    public report: LeadershipVisitReportModel | null = null,
    public reportAdded = false,
  ) {}

  static fromMap(data: DataMap): LeadershipVisitModel {
    const employeeData = data.organization_employee ?? data.organizationEmployeeName ?? {}
    const activityData = data.visit_activity ?? data.visitActivityName ?? {}
    const activityMap = asMap(activityData)
    const reportData =
      data.report ??
      data.visit_report ??
      data.visite_report ??
      data.leadership_visit_report ??
      firstItem(data.reports) ??
      firstItem(data.leadership_visit_reports)
    const report =
      reportData && typeof reportData === 'object'
        ? LeadershipVisitReportModel.fromMap(asMap(reportData))
        : null
    const reportFlag =
      data.has_report ?? data.is_reported ?? data.report_added ?? data.report_id ?? false

    return new LeadershipVisitModel(
      Number(data.id ?? data.visit_id),
      String(data.date ?? ''),
      String(data.location ?? ''),
      employeeData instanceof OrganizatoinEmployeeDetailsModel
        ? employeeData
        : OrganizatoinEmployeeDetailsModel.fromMap(asMap(employeeData)),
      activityData instanceof TitleInterface
        ? activityData
        : new TitleInterface({
            id: Number(activityMap.id ?? 0),
            title: String(activityMap.title ?? activityMap.name ?? ''),
          }),
      report,
      Boolean(report || reportFlag === true || reportFlag === 'true' || Number(reportFlag) > 0),
    )
  }

  static example: LeadershipVisitModel = new LeadershipVisitModel(
    1,
    '10-12-2025',
    'location',
    OrganizatoinEmployeeDetailsModel.example,
    new TitleInterface({ id: 1, title: '' }),
    null,
    false,
  )
}
