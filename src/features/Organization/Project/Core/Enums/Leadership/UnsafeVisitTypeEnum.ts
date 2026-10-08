export enum UnsafeVisitTypeEnum {
  UnsafeAct = 1,
  UnsafeCondition = 2,
}

export const unsafeVisitTypeOptions = [
  { id: UnsafeVisitTypeEnum.UnsafeAct, title: 'Unsafe act' },
  { id: UnsafeVisitTypeEnum.UnsafeCondition, title: 'Unsafe condition' },
] as const
