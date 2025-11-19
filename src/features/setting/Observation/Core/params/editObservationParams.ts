import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import { RiskLevelEnum } from '../Enums/risk_level_enum'
import { SaveStatusEnum } from '../Enums/save_status_enum'
import { TypesEnum } from "../Enums/types_enum"
export default class EditObservationParams implements Params {
  id: number
  title: string
  description: string
  image?: string | null
  type_id?: number
  equipment_id?: number
  zoon_id?: number
  project_id?: number
  date?: string

  take_action?: 'yes' | 'no' | null
  solved?: 'yes' | 'no' | null
  preventive_action?: string
  is_result?: boolean
  risk_level?: RiskLevelEnum
  save_status?: SaveStatusEnum
  action?: string
  is_near_miss?: boolean
  is_action?: boolean
  type: TypesEnum

  constructor(id: number, translations: any, industryAll: any, industries: any[], data: any) {
    this.id = id
    this.title = data.title
    this.description = data.description
    this.image = data.image
    this.type_id = data.type_id
    this.equipment_id = data.equipment_id
    this.zoon_id = data.zoon_id
    this.project_id = data.project_id
    this.date = data.date
    this.take_action = data.take_action
    this.solved = data.solved
    this.preventive_action = data.preventive_action
    this.is_result = data.is_result
    this.risk_level = data.risk_level
    this.save_status = data.save_status
    this.action = data.action
    this.is_near_miss = data.is_near_miss
    this.is_action = data.is_action
    this.type = data.type
  }

  toMap() {
    return {
      observation_id: this.id,
      title: this.title,
      description: this.description,
      image: this.image,
      type_id: this.type_id,
      equipment_id: this.equipment_id,
      zoon_id: this.zoon_id,
      project_id: this.project_id,
      date: this.date,
      take_action: this.take_action,
      solved: this.solved,
      preventive_action: this.preventive_action,
      is_result: this.is_result,
      risk_level: this.risk_level,
      save_status: this.save_status,
      action: this.action,
      is_near_miss: this.is_near_miss,
      is_action: this.is_action,
      type: this.type,
    }
  }
}

