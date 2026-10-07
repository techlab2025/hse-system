export default class InternalAuditReportModel {
  constructor(
    public scope: string,
    public methodology: string,
    public maintenance: string,
    public generalObservations: string,
    public conclusion: string,
  ) {}

  static fromMap(data: unknown): InternalAuditReportModel {
    const details = data && typeof data === 'object' && !Array.isArray(data)
      ? data as Record<string, unknown>
      : {}
    const item = details.report && typeof details.report === 'object' && !Array.isArray(details.report)
      ? details.report as Record<string, unknown>
      : details

    return new InternalAuditReportModel(
      String(item.scope ?? item.scopr ?? ''),
      String(item.methodology ?? ''),
      String(item.maintenance ?? ''),
      String(item.general_observations ?? ''),
      String(item.conclusion ?? ''),
    )
  }

  static example = new InternalAuditReportModel(
    'Maintenance department and equipment inspection activities.',
    'Reviewing records, interviewing personnel, and observing activities.',
    'Preventive maintenance records were reviewed.',
    'Maintenance activities followed the agreed procedures.',
    'The audited processes meet the agreed audit criteria.',
  )
}
