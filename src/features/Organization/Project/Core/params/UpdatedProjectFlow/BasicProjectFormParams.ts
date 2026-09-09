import type { Component } from 'vue'

export type BasicProjectForm = {
  serial: string
  startDate: Date | null
  endDate: Date | null
  cost: string
  hasZoon: boolean
}

export type ProjectSerialField = {
  key: string
  label: string
  placeholder: string
  value: string
  enabled: boolean
}

export type LangTitleValue = {
  locale: string
  icon?: string | Component
  title: string
}

export type LangDescriptionValue = {
  locale: string
  icon?: string | Component
  description: string
}
