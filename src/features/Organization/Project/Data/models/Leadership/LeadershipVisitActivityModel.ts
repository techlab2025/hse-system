import LeadershipVisitCreatableModel from './LeadershipVisitCreatableModel'

export default class LeadershipVisitActivityModel {
  constructor(
    public id: number,
    public visitActivityId: number,
    public creatable: LeadershipVisitCreatableModel | null = null,
    public title: string,
  ) {}

  static fromMap(data: Record<string, any>): LeadershipVisitActivityModel {
    return new LeadershipVisitActivityModel(
      Number(data.id ?? 0),
      Number(data.visit_activity_id ?? 0),
      data.creatable ? LeadershipVisitCreatableModel.fromMap(data.creatable) : null,
      data.title,
    )
  }
}
