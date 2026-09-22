import type Params from '@/base/core/params/params'

export interface PPEMatrixDeliveryEmployee {
  employeeId: number
  ppeToolIds: number[]
}

export default class CreatePPEMatrixDeliveryParams implements Params {
  constructor(
    public projectId: number,
    public ppeActivityId: number,
    public employees: PPEMatrixDeliveryEmployee[],
  ) {}

  toMap(): Record<string, unknown> {
    return {
      project_id: this.projectId,
      ppe_activity_id: this.ppeActivityId,
      employees: this.employees.map((employee) => ({
        employee_id: employee.employeeId,
        ppe_tools: employee.ppeToolIds.map((ppeToolId) => ({ ppe_tool_id: ppeToolId })),
      })),
    }
  }
}
