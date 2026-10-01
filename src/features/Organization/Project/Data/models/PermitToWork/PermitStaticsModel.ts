export default class PermitStaticsModel {
  constructor(
    public id: number,
    public total: string,
    public active: string,  
    public draft: number | null,
    public cancel: string,
  ) {}

  static fromMap(data: any): PermitStaticsModel {
    return new PermitStaticsModel(
      Number(data?.id ?? 0),
      data?.total ?? '',
      data?.active ?? '',
      data?.draft ?? '',
      data?.cancel ?? '',
    )
  }
}
