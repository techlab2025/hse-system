import TitleInterface from '@/base/Data/Models/title_interface'
import { NotificationPlanActionEnum } from '../../Core/enums/notification_plan_action_enum'
import { NotificationPlanSubActionEnum } from '../../Core/enums/notification_plan_sub_action_enum'

export const notificationPlanActionOptions: TitleInterface[] = [
  // new TitleInterface({
  //   id: NotificationPlanActionEnum.TASK_ASSIGNED,
  //   title: 'Task assigned',
  // }),
  new TitleInterface({
    id: NotificationPlanActionEnum.PROJECT_LOCATION_HIERARCHY_ASSIGNMENT,
    title: 'Project location hierarchy assignment',
  }),
  new TitleInterface({
    id: NotificationPlanActionEnum.OBSERVATION_CREATED,
    title: 'Observation created',
  }),
  new TitleInterface({
    id: NotificationPlanActionEnum.INVESTIGATION_TASK_CREATED,
    title: 'Investigation task created',
  }),
  new TitleInterface({
    id: NotificationPlanActionEnum.INVESTIGATION_TASK_STATUS_CHANGED,
    title: 'Investigation task status changed',
  }),
  new TitleInterface({
    id: NotificationPlanActionEnum.INVESTIGATION_TEAM_ADDED,
    title: 'Investigation team added',
  }),
]

export const notificationPlanSubActionOptions: TitleInterface[] = [
  new TitleInterface({
    id: NotificationPlanSubActionEnum.LOW,
    title: 'Low',
  }),
  new TitleInterface({
    id: NotificationPlanSubActionEnum.MEDIUM,
    title: 'Medium',
  }),
  new TitleInterface({
    id: NotificationPlanSubActionEnum.MEDIUM_IS_NEAR_MISS,
    title: 'Medium is near miss',
  }),
  new TitleInterface({
    id: NotificationPlanSubActionEnum.HIGH,
    title: 'High',
  }),
]
