import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import type { ChangeTypeMangementEnum } from '../Core/ChangeTypeEnum'
import type { ChangeApprovalMangementEnum } from '../Core/ChangeApprovalEnum'


export default class AddMangementChangeParams implements Params {
  constructor(
    public risk_assisment_file: string,
    public image: string[],
    public changer_request_id: number,
    public facilty: string,
    public area: string,
    public date: string,
    public change_type: ChangeTypeMangementEnum,
    public management_change_topic_type_id: number,
    public status: ChangeApprovalMangementEnum,
    public approval_by: number,
    public management_change_topic_employee_id?: number,
    public management_change_topic_equipment_id?: number,
    public management_change_topic_text?: string,
  ) {}

  public static readonly validation = new ClassValidation().setRules({
    changer_request_id: { required: true },
    facilty: { required: true, minLength: 2 },
    area: { required: true, minLength: 2 },
    date: { required: true },
    change_type: { required: true },
    management_change_topic_type_id: { required: true },
    status: { required: true },
    approval_by: { required: true },
  })

  toMap(): Record<string, unknown> {
    return {
      risk_assisment_file: this.risk_assisment_file,
      image: this.image,
      changer_request_id: this.changer_request_id,
      facilty: this.facilty,
      area: this.area,
      date: this.date,
      change_type: this.change_type,
      management_change_topic_type_id: this.management_change_topic_type_id,
      status: this.status,
      approval_by: this.approval_by,
      management_change_topic_employee_id: this.management_change_topic_employee_id,
      management_change_topic_equipment_id: this.management_change_topic_equipment_id,
      management_change_topic_text: this.management_change_topic_text,
    }
  }

  validate() {
    return AddMangementChangeParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddMangementChangeParams.validation.validateOrThrow(this)
  }
}