import TitleInterface from '@/base/Data/Models/title_interface'

export default class PPEActivityToolsModel {
  constructor(
    public activityId: number,
    public activityTitle: string,
    public ppeTools: TitleInterface[],
  ) {}

  static fromMap(data: Record<string, unknown>): PPEActivityToolsModel {
    const tools = data.ppe_toole ?? data.ppe_tools ?? []
    return new PPEActivityToolsModel(
      Number(data.activity_id ?? data.actitivty_id ?? data.ppe_activity_id ?? data.id ?? 0),
      String(data.activity_title ?? data.title ?? ''),
      Array.isArray(tools)
        ? tools.map((tool) => new TitleInterface({
            id: Number((tool as Record<string, unknown>).id ?? (tool as Record<string, unknown>).ppe_tool_id),
            title: String((tool as Record<string, unknown>).title ?? ''),
          }))
        : [],
    )
  }
}
