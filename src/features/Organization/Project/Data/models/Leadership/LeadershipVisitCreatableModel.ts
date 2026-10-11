
export default class LeadershipVisitCreatableModel {

  constructor(
    public id: number,
    public type: string,
    public name?: string ,
  ) {}

  static fromMap(data: Record<string,any>): LeadershipVisitCreatableModel {
    return new LeadershipVisitCreatableModel(
      Number(data.id ?? 0),
      String(data.type ?? ''),
      String(data.name ?? ''),
    )
  }

}
