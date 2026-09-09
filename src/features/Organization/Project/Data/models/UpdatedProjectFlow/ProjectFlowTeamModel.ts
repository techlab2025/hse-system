/* eslint-disable @typescript-eslint/no-explicit-any */
export default class ProjectFlowTeamModel {
  constructor(
    public readonly projectLocationId: number,
    public readonly teamId: number,
    public readonly teamTitle: string,
    public readonly employees: Record<string, unknown>[],
  ) {}
  static fromMap(data: Record<string, any>) {
    return new ProjectFlowTeamModel(
      data.project_location_id,
      data.team_id,
      data.team_title ?? data.title ?? '',
      data.project_location_team_employees ?? data.organizaion_employees ?? [],
    )
  }
}
