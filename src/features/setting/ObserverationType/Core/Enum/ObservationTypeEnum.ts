import TitleInterface from '@/base/Data/Models/title_interface'

export enum ObservationTypeEnum {
  UNSAFE_ACT = 1,
  UNSAFE_CONDITION = 2,
}

export const ObservationTypeStaticOptions = [
  new TitleInterface({ id: ObservationTypeEnum.UNSAFE_ACT, title: 'unsafe act' }),
  new TitleInterface({ id: ObservationTypeEnum.UNSAFE_CONDITION, title: 'unsafe condition' }),
]
