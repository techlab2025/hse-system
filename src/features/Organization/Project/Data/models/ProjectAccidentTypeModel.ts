export default class ProjectAccidentTypeModel {
  constructor(
    public readonly id: number,
    public readonly title: string,
  ) {}

  static fromMap(data: Record<string, unknown> | null | undefined): ProjectAccidentTypeModel {
    return new ProjectAccidentTypeModel(Number(data?.id ?? 0), String(data?.title ?? ''))
  }
}
