export default class RiskAssessmentMediaModel {
  constructor(
    public id: number,
    public fileName: string,
    public url: string,
    public mimeType: string,
  ) {}

  static fromMap(data: unknown): RiskAssessmentMediaModel {
    if (typeof data === 'string') {
      return new RiskAssessmentMediaModel(0, '', data, '')
    }

    const item = (data ?? {}) as Record<string, unknown>

    return new RiskAssessmentMediaModel(
      Number(item.id ?? 0),
      String(item.file_name ?? item.name ?? ''),
      String(item.url ?? item.original_url ?? ''),
      String(item.mime_type ?? item.mimeType ?? ''),
    )
  }
}
