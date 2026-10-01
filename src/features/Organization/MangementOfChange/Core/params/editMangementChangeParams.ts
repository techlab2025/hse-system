import type Params from '@/base/core/params/params'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import type { ChangeApprovalMangementEnum } from '../Core/ChangeApprovalEnum'
import type { ChangeTypeMangementEnum } from '../Core/ChangeTypeEnum'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'

export default class EditMangementChangeParams implements Params {
  constructor(
    public id: number,
    public risk_assisment_file: File | string | null,
    public image: string[],
    public changer_request_id: number | null,
    public facilty: string,
    public area: string,
    public date: Date | null,
    public change_type: ChangeTypeMangementEnum,
    public management_change_topic_type_id: number,
    public status: ChangeApprovalMangementEnum,
    public approval_by: number | null,
    public management_change_topic_employee_id?: number,
    public management_change_topic_equipment_id?: number,
    public management_change_topic_text?: string,
    public initiatore_employee_id?: number,
    public serial?: string,
  ) {}

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {
      management_of_change_id: this.id,
      risk_assisment_file: this.risk_assisment_file,
      attachments: this.image,
      changer_request_id: this.changer_request_id,
      facility: this.facilty,
      area: this.area,
      date: this.date ? formatJoinDate(this.date) : undefined,
      change_type: this.change_type,
      changement_topic_id: this.management_change_topic_type_id,
      status: this.status,
      approver_by: this.approval_by,
      changer_request_employee_id: this.management_change_topic_employee_id,
      management_change_topic_equipment_id: this.management_change_topic_equipment_id,
      topic_text: this.management_change_topic_text,
      initiator_employee_id:
        this.initiatore_employee_id,
    }

      if (useProjectAppStatusStore().isSerialNumberAuto()) data.serial_number = this.serial
      else data.serial = this.serial

      return data
  }
}
