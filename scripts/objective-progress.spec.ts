import { test, expect } from '@playwright/test'
import {
  achievement,
  generatePeriods,
  validateProgress,
  type ObjectiveMeasurement,
  type ProgressDraft,
} from '../src/features/Organization/objectives/ObjectiveProgress/Core/utils/objectiveProgress'
import {
  ObjectiveTargetTypeEnum as T,
  ObjectiveDirectionEnum as D,
  ObjectiveFrequencyEnum as F,
} from '../src/features/Organization/objectives/Core/enums/objectivesEnums'
const objective: ObjectiveMeasurement = {
  year: '2026',
  targetType: T.Percentage,
  direction: D.Increase,
  target: 80,
  baseline: null,
  frequency: null,
}
const draft: ProgressDraft = {
  period: '2026-01',
  actualResult: 12,
  notes: '',
  files: [],
  retainedAttachmentIds: [],
}
test('percentage and number increases use actual result separately from achievement', () => {
  expect(achievement(objective, 64)).toBe(80)
  expect(achievement({ ...objective, targetType: T.Number, target: 200 }, 126)).toBe(63)
})
test('percentage reduction uses required percent of baseline', () =>
  expect(
    achievement({ ...objective, direction: D.Reduce, baseline: 100, target: 30 }, 80),
  ).toBeCloseTo(66.6667))
test('number reduction requires explicit semantics', () => {
  const o = { ...objective, targetType: T.Number, direction: D.Reduce, baseline: 100, target: 20 }
  expect(achievement(o, 90)).toBeNull()
  expect(achievement(o, 90, null, 'amount')).toBe(50)
  expect(achievement({ ...o, target: 80 }, 90, null, 'final-value')).toBe(50)
  expect(achievement(o, 90, 44)).toBe(44)
})
for (const frequency of [F.Annually, F.SemiAnnually, F.Quarterly, F.Monthly])
  test(`periodic ${frequency} uses annual count and generates its periods`, () => {
    const o = {
      ...objective,
      targetType: T.PeriodicFrequency,
      frequency,
      annualOccurrences: frequency,
    }
    expect(achievement(o, 1)).toBeCloseTo(100 / frequency)
    expect(generatePeriods(o)).toHaveLength(frequency)
  })
test('zero, missing and invalid values never create false attainment', () => {
  for (const actual of [null, undefined, NaN, Infinity, -1])
    expect(achievement(objective, actual)).toBeNull()
  expect(achievement({ ...objective, target: 0 }, 1)).toBeNull()
  expect(achievement({ ...objective, direction: D.Reduce, baseline: 0 }, 5)).toBeNull()
  expect(achievement({ ...objective, direction: D.Reduce }, 5)).toBeNull()
})
test('overachievement is not capped and worsening reduction stays negative', () => {
  expect(achievement(objective, 160)).toBe(200)
  expect(achievement({ ...objective, direction: D.Reduce, target: 20, baseline: 100 }, 110)).toBe(
    -50,
  )
})
test('ongoing periods allowed from start date, future periods rejected', () => {
  const now = new Date(2026, 9, 14)
  const periods = generatePeriods(objective, 'en', now)
  expect(periods.filter((p) => p.available)).toHaveLength(10)
  expect(
    validateProgress(
      1,
      objective,
      { ...draft, period: '2026-11' },
      { duplicates: null, existingPeriods: [] },
      now,
    ).period,
  ).toBe('op.futurePeriod')
})
test('past and future years and year boundaries', () => {
  const now = new Date(2026, 0, 1)
  expect(generatePeriods({ ...objective, year: '2025' }, 'en', now).every((p) => p.available)).toBe(
    true,
  )
  expect(generatePeriods({ ...objective, year: '2027' }, 'en', now).some((p) => p.available)).toBe(
    false,
  )
  expect(generatePeriods(objective, 'en', now).filter((p) => p.available)).toHaveLength(1)
})
test('leap year and quarter end dates', () => {
  expect(generatePeriods({ ...objective, year: '2024' })[1].endDate).toBe('2024-02-29')
  expect(
    generatePeriods({ ...objective, targetType: T.PeriodicFrequency, frequency: F.Quarterly })[0]
      .endDate,
  ).toBe('2026-03-31')
})
test('reject invalid ids, wrong objective year, missing/nonfinite/negative actual, and fractional occurrences', () => {
  const policy = { duplicates: null, existingPeriods: [] }
  expect(
    validateProgress(0, objective, { ...draft, period: '2025-01', actualResult: null }, policy),
  ).toMatchObject({
    objective: 'op.invalidObjective',
    period: 'op.invalidPeriod',
    actualResult: 'op.invalidActual',
  })
  for (const actualResult of [-1, Infinity, NaN])
    expect(
      validateProgress(1, objective, { ...draft, actualResult }, policy).actualResult,
    ).toBeTruthy()
  expect(
    validateProgress(
      1,
      { ...objective, targetType: T.PeriodicFrequency, frequency: F.Monthly },
      { ...draft, actualResult: 1.2 },
      policy,
    ).actualResult,
  ).toBe('op.integerRequired')
})
test('duplicate policy allows corrections and multiple records only as configured', () => {
  const policy = { duplicates: 'single' as const, existingPeriods: ['2026-01'] }
  expect(validateProgress(1, objective, draft, policy).period).toBe('op.duplicatePeriod')
  expect(
    validateProgress(1, objective, draft, { ...policy, editingPeriod: '2026-01' }).period,
  ).toBeUndefined()
  expect(
    validateProgress(1, objective, draft, { ...policy, duplicates: 'multiple' }).period,
  ).toBeUndefined()
})
