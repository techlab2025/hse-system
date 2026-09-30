import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import type { ChangeTypeMangementEnum } from '../Core/ChangeTypeEnum'
import type { ChangeApprovalMangementEnum } from '../Core/ChangeApprovalEnum'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'

export default class AddMangementChangeParams implements Params {
  constructor(
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

  public static readonly validation = new ClassValidation().setRules({})

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {
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
      initiator_employee_id: this.initiatore_employee_id,
    }

    if (useProjectAppStatusStore().isSerialNumberAuto()) data.serial_number = this.serial
    else data.serial = this.serial

    return data
    
  }

  validate() {
    return AddMangementChangeParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddMangementChangeParams.validation.validateOrThrow(this)
  }
}
