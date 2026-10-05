import type Params from '@/base/core/params/params'

export interface PPEMatrixDeliveryEmployee {
  employeeId: number
  ppeToolIds: number[]
}

export default class CreatePPEMatrixDeliveryParams implements Params {
  constructor(
    public projectId: number | null,
    public ppeActivityId: number,
    public employees: PPEMatrixDeliveryEmployee[],
    public projectLocationId: number | null = null,
    public projectLocationZoneId: number | null = null,
  ) {}

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {
      ppe_activity_id: this.ppeActivityId,
      employees: this.employees.map((employee) => ({
        employee_id: employee.employeeId,
        ppe_tools: employee.ppeToolIds.map((ppeToolId) => ({ ppe_tool_id: ppeToolId })),
      })),
    }

    if (this.projectId != null) data.project_id = this.projectId
    if (this.projectLocationId != null) data.project_location_id = this.projectLocationId
    if (this.projectLocationZoneId != null) {
      data.project_location_zone_id = this.projectLocationZoneId
    }

    return data
  }
}
