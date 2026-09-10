import type Params from '@/base/core/params/params'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { formatTime } from '@/base/Presentation/utils/time_format'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'

export default class AddDrillParams implements Params {
  constructor(
    public projectId: number,
    public drillTypeId: number,
    public projectTeamId: number,
    public date: Date | string,
    public time: Date | string,
    public serial: string,
    public evaluation: string,
    public improvement: string,
    public notes: string,
  ) {}

  toMap(): Record<string, string | number> {
    const data: Record<string, string | number> = {
      project_id: this.projectId,
      drill_type_id: this.drillTypeId,
      project_team_id: this.projectTeamId,
      date: formatJoinDate(this.date),
      time: formatTime(this.time),
      evaluation: this.evaluation,
      improvement: this.improvement,
      notes: this.notes,
    }

    if (useProjectAppStatusStore().isSerialNumberAuto()) data.serial_number = this.serial
    else data.serial = this.serial

    return data
  }
}
