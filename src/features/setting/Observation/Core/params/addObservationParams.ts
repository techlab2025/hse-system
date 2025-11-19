// src/features/observation/Core/params/AddObservationParams.ts

import type Params from '@/base/core/params/params'
import { RiskLevelEnum } from '../Enums/risk_level_enum'
import { SaveStatusEnum } from '../Enums/save_status_enum'
import { TypesEnum } from "../Enums/types_enum"

export default class AddObservationParams implements Params {
  title: string
  description: string

  image?: string | null
  type_id: number
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
  // capa_status?: boolean
  is_action?: boolean
  type: TypesEnum

  constructor(data: {
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
    // capa_status?: boolean
    is_action?: boolean
    type: TypesEnum
  }) {
    this.title = data.title
    this.description = data.description
    this.image = data.image ?? null
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
    // this.capa_status = data.capa_status
    this.is_action = data.is_action
    this.type = data.type
  }

  toMap(): Record<string, any> {
    const data: Record<string, any> = {}
    data['title'] = this.title
    data['description'] = this.description
    data['image'] = this.image
    data['type_id'] = this.type_id
    data['equipment_id'] = this.equipment_id
    data['zoon_id'] = this.zoon_id
    data['project_id'] = this.project_id
    data['date'] = this.date

    data['take_action'] = this.take_action
    data['solved'] = this.solved
    data['preventive_action'] = this.preventive_action

    data['is_result'] = this.is_result
    data['risk_level'] = this.risk_level
    data['save_status'] = this.save_status
    data['action'] = this.action
    data['is_near_miss'] = this.is_near_miss
    // data['capa_status'] = this.capa_status
    data['is_action'] = this.is_action
    data['type'] = this.type
    return data
  }
}
