// src/features/observation/Core/params/AddObservationParams.ts

import type Params from '@/base/core/params/params'
import { RiskLevelEnum } from '../Enums/risk_level_enum'
import { SaveStatusEnum } from '../Enums/save_status_enum'

export default class AddObservationParams implements Params {
  // الحقول الأساسية (عادية string)
  title: string
  description: string

  image?: string | null
  type_id?: number
  equipment_id?: number
  zone_id?: number
  project_id?: number
  date?: string

  hazard_type_id?: number | null
  take_action?: 'yes' | 'no' | null
  solved?: 'yes' | 'no' | null
  preventive_action?: string

  is_result?: boolean
  risk_level?: RiskLevelEnum
  save_status?: SaveStatusEnum
  action?: string
  is_near_miss?: boolean
  capa_status?: boolean
  is_action?: boolean

  constructor(data: {
    title: string
    description: string
    image?: string | null
    type_id?: number
    equipment_id?: number
    zone_id?: number
    project_id?: number
    date?: string

    hazard_type_id?: number | null
    take_action?: 'yes' | 'no' | null
    solved?: 'yes' | 'no' | null
    preventive_action?: string

    is_result?: boolean
    risk_level?: RiskLevelEnum
    save_status?: SaveStatusEnum
    action?: string
    is_near_miss?: boolean
    capa_status?: boolean
    is_action?: boolean
  }) {
    this.title = data.title
    this.description = data.description
    this.image = data.image ?? null
    this.type_id = data.type_id
    this.equipment_id = data.equipment_id
    this.zone_id = data.zone_id
    this.project_id = data.project_id
    this.date = data.date

    this.hazard_type_id = data.hazard_type_id
    this.take_action = data.take_action
    this.solved = data.solved
    this.preventive_action = data.preventive_action

    this.is_result = data.is_result
    this.risk_level = data.risk_level
    this.save_status = data.save_status
    this.action = data.action
    this.is_near_miss = data.is_near_miss
    this.capa_status = data.capa_status
    this.is_action = data.is_action
  }

  toMap(): Record<string, any> {
    const data: Record<string, any> = {
      title: this.title,
      description: this.description,
    }

    if (this.image) data.image = this.image
    if (this.type_id !== undefined) data.type_id = this.type_id
    if (this.equipment_id !== undefined) data.equipment_id = this.equipment_id
    if (this.zone_id !== undefined) data.zone_id = this.zone_id
    if (this.project_id !== undefined) data.project_id = this.project_id
    if (this.date) data.date = this.date

    if (this.hazard_type_id !== undefined && this.hazard_type_id !== null)
      data.hazard_type_id = this.hazard_type_id
    if (this.take_action) data.take_action = this.take_action
    if (this.solved) data.solved = this.solved
    if (this.preventive_action) data.preventive_action = this.preventive_action

    if (this.is_result !== undefined) data.is_result = this.is_result ? 1 : 0
    if (this.risk_level !== undefined) data.risk_level = this.risk_level
    if (this.save_status !== undefined) data.save_status = this.save_status
    if (this.action) data.action = this.action
    if (this.is_near_miss !== undefined) data.is_near_miss = this.is_near_miss ? 1 : 0
    if (this.capa_status !== undefined) data.capa_status = this.capa_status ? 1 : 0
    if (this.is_action !== undefined) data.is_action = this.is_action ? 1 : 0

    return data
  }
}