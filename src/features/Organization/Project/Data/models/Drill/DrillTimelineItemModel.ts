/* eslint-disable @typescript-eslint/no-explicit-any */
export default class DrillTimelineItemModel {
  constructor(
    public id: number,
    public date: string,
    public time: string,
    public description: string,
    public notes: string,
    public photographerName: string,
    public images: string[],
  ) {}

  static fromMap(data: any, index: number = 0): DrillTimelineItemModel {
    return new DrillTimelineItemModel(
      data?.id ?? index + 1,
      data?.date ?? '',
      data?.time ?? '',
      data?.description ?? data?.notes ?? '',
      data?.notes ?? '',
      data?.photographer_name ?? data?.photographerName ?? '',
      data?.images ?? [],
    )
  }
}
