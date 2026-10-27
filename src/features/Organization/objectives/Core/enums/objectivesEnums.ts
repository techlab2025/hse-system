import TitleInterface from '@/base/Data/Models/title_interface'

export enum ObjectiveTargetTypeEnum {
  Percentage = 1,
  Number = 2,
  PeriodicFrequency = 3,
}

export enum ObjectiveDirectionEnum {
  Increase = 1,
  Reduce = 2,
}

export enum ObjectiveFrequencyEnum {
  Annually = 1,
  SemiAnnually = 2,
  Quarterly = 4,
  Monthly = 12,
}

export const ObjectiveTargetTypeOptions = [
  new TitleInterface({
    id: ObjectiveTargetTypeEnum.Percentage,
    title: 'Percentage',
    translationKey: 'objectiveMeasurement.percentage',
  }),
  new TitleInterface({
    id: ObjectiveTargetTypeEnum.Number,
    title: 'Number',
    translationKey: 'objectiveMeasurement.number',
  }),
  new TitleInterface({
    id: ObjectiveTargetTypeEnum.PeriodicFrequency,
    title: 'Periodic frequency',
    translationKey: 'objectiveMeasurement.periodic',
  }),
]

export const ObjectiveDirectionOptions = [
  new TitleInterface({
    id: ObjectiveDirectionEnum.Increase,
    title: 'Increase',
    translationKey: 'objectiveMeasurement.increase',
  }),
  new TitleInterface({
    id: ObjectiveDirectionEnum.Reduce,
    title: 'Decrease',
    translationKey: 'objectiveMeasurement.decrease',
  }),
]

export const ObjectiveFrequencyOptions = [
  new TitleInterface({
    id: ObjectiveFrequencyEnum.Annually,
    title: 'Annually',
    translationKey: 'objectiveMeasurement.annual',
  }),
  new TitleInterface({
    id: ObjectiveFrequencyEnum.SemiAnnually,
    title: 'Semi-annually',
    translationKey: 'objectiveMeasurement.semiannual',
  }),
  new TitleInterface({
    id: ObjectiveFrequencyEnum.Quarterly,
    title: 'Quarterly',
    translationKey: 'objectiveMeasurement.quarterly',
  }),
  new TitleInterface({
    id: ObjectiveFrequencyEnum.Monthly,
    title: 'Monthly',
    translationKey: 'objectiveMeasurement.monthly',
  }),
]

export const getObjectiveTargetTypeTitle = (
  value?: ObjectiveTargetTypeEnum | number | null,
): string => ObjectiveTargetTypeOptions.find((item) => item.id === Number(value))?.title ?? ''

export const getObjectiveDirectionTitle = (
  value?: ObjectiveDirectionEnum | number | null,
): string => ObjectiveDirectionOptions.find((item) => item.id === Number(value))?.title ?? ''

export const getObjectiveFrequencyTitle = (
  value?: ObjectiveFrequencyEnum | number | null,
): string => ObjectiveFrequencyOptions.find((item) => item.id === Number(value))?.title ?? ''
