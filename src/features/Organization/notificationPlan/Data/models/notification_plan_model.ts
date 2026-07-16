import TitleModel from '@/base/Data/Models/title_model'

export interface NotificationPlanActionModel {
  value: number
  name: string
  label: string
  sub_action: any
}

// export interface NotificationPlanEmployeeModel {
//   id: number
//   name: string
// }

// export interface NotificationPlanHierarchyModel {
//   id: number
//   title: string
// }

export default class NotificationPlanModel {
  public notification_plan_id: number
  public notificationPlanId: number
  public title: string
  public is_active: boolean
  public isActive: boolean
  public actions: NotificationPlanActionModel[]
  public employees: TitleModel<string>[]
  public hierarchies: TitleModel<string>[]

  constructor(
    notificationPlanId: number,
    title: string,
    isActive: boolean,
    actions: NotificationPlanActionModel[] = [],
    employees: TitleModel<string>[] = [],
    hierarchies: TitleModel<string>[] = [],
  ) {
    this.notification_plan_id = notificationPlanId
    this.notificationPlanId = notificationPlanId
    this.title = title
    this.is_active = isActive
    this.isActive = isActive
    this.actions = actions
    this.employees = employees
    this.hierarchies = hierarchies
  }

  get id(): number {
    return this.notificationPlanId
  }

  get status(): boolean {
    return this.isActive
  }

  static fromMap(data: any): NotificationPlanModel {
    const isActive = data?.is_active ?? data?.isActive ?? false

    return new NotificationPlanModel(
      data?.notification_plan_id ?? data?.id ?? 0,
      data?.title ?? '',
      isActive === true || isActive === 1 || isActive === '1',
      (data?.actions ?? []).map((action: any) => ({
        value: action?.value ?? 0,
        name: action?.name ?? '',
        label: action?.label ?? '',
        sub_action: action?.sub_action ?? null,
      })),
      (data?.employees ?? []).map((employee: any) => TitleModel.fromMap<string>(employee)),
      (data?.hierarchies ?? []).map((hierarchy: any) => TitleModel.fromMap<string>(hierarchy)),
    )
  }
}
