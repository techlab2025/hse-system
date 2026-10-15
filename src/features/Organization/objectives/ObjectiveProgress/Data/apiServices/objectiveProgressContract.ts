import type { ObjectiveFrequencyEnum } from '../../../Core/enums/objectivesEnums'
import type { ReductionRule } from '../../Core/utils/objectiveProgress'
import ObjectiveProgressModel from '../models/objectiveProgressModel'

export type ProgressOperation = 'index' | 'details' | 'add' | 'edit'

export interface ProgressContract {
  confirmed: boolean
  semantics: 'cumulative' | 'period-specific'
  duplicates: 'single' | 'multiple'
  numberReduction: ReductionRule
  reportingFrequency?: ObjectiveFrequencyEnum
  attachments: { maxFiles: number; maxBytes: number; acceptedTypes: string[] }
  decodeSummary: (objective: Record<string, unknown>) => ObjectiveProgressModel | null
}

export const objectiveProgressContract: ProgressContract = {
  confirmed: true,
  semantics: 'cumulative',
  duplicates: 'single',
  numberReduction: null,
  attachments: {
    maxFiles: 5,
    maxBytes: 10 * 1024 * 1024,
    acceptedTypes: ['image/*', '.pdf', '.doc', '.docx', '.xls', '.xlsx'],
  },
  decodeSummary: (objective) => {
    const summary = objective.latest_progress ?? objective.progress_summary
    return summary && typeof summary === 'object' ? ObjectiveProgressModel.fromMap(summary) : null
  },
}

export function supportsProgress(_operation: ProgressOperation): boolean {
  return objectiveProgressContract.confirmed
}
