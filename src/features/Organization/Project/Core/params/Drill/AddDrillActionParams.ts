import type Params from '@/base/core/params/params'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { formatTime } from '@/base/Presentation/utils/time_format'
import type { FileBase64 } from '@/base/Presentation/utils/file_to_base_64'

export interface DrillActionInput {
  date: Date | string
  time: Date | string
  description: string
  notes: string
  photographerName: string
  images: Array<string | FileBase64>
}

export default class AddDrillActionParams implements Params {
  constructor(
    public drillId: number,
    public projectId: number,
    public actions: DrillActionInput[],
  ) {}

  toMap(): Record<string, unknown> {
    return {
      drill_id: this.drillId,
      project_id: this.projectId,
      actions: this.actions.map((item) => ({
        date: formatJoinDate(item.date),
        time: formatTime(item.time),
        description: item.description,
        notes: item.notes,
        photographer_name: item.photographerName,
        attachments: item.images,
      })),
    }
  }
}
