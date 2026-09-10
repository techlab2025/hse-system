import type Params from '@/base/core/params/params'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { formatTime } from '@/base/Presentation/utils/time_format'

export interface DrillPlanningInput {
  date: Date | string
  time: Date | string
  description: string
}

export default class AddDrillPlanningParams implements Params {
  constructor(
    public drillId: number,
    public projectId: number,
    public planning: DrillPlanningInput[],
  ) {}

  toMap(): Record<string, unknown> {
    return {
      drill_id: this.drillId,
      project_id: this.projectId,
      planning: this.planning.map((item) => ({
        date: formatJoinDate(item.date),
        time: formatTime(item.time),
        description: item.description,
      })),
    }
  }
}
