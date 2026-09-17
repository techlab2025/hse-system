import type OrganizatoinEmployeeModel from "@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeModel";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default class DrillTimelineItemModel {
  constructor(
    public id: number,
    public date: string,
    public time: string,
    public description: string,
    public notes: string,
    public photographerName: string,
    public images: { id: number; file_name: string; url: string }[],
    public evaluation:string,
    public improvement:string,
    public organization_employee:OrganizatoinEmployeeModel,

  ) {}

  static fromMap(data: any, index: number = 0): DrillTimelineItemModel {
    return new DrillTimelineItemModel(
      data?.id ?? index + 1,
      data?.date ?? '',
      data?.time ?? '',
      data?.description ?? data?.notes ?? '',
      data?.notes ?? '',
      data?.photographer_name ?? data?.photographerName ?? '',
      data?.media ?? [],
      data?.evaluation,
      data?.improvement,
      data.organization_employee
    )
  }
}
