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
    translationKey: 'project_location_hierarchy_assignment',
  }),
  new TitleInterface({
    id: NotificationPlanActionEnum.OBSERVATION_CREATED,
    title: 'Observation created',
    translationKey: 'observation_created',
  }),
  new TitleInterface({
    id: NotificationPlanActionEnum.INVESTIGATION_TASK_CREATED,
    title: 'Investigation task created',
    translationKey: 'investigation_task_created',
  }),
  new TitleInterface({
    id: NotificationPlanActionEnum.INVESTIGATION_TASK_STATUS_CHANGED,
    title: 'Investigation task status changed',
    translationKey: 'investigation_task_status_changed',
  }),
  new TitleInterface({
    id: NotificationPlanActionEnum.INVESTIGATION_TEAM_ADDED,
    title: 'Investigation team added',
    translationKey: 'investigation_team_added',
  }),
  new TitleInterface({
    id: NotificationPlanActionEnum.PERMIT_TO_WORK_ASSIGN,
    title: 'Permit To Work Assigned',
    translationKey: 'Permit To Work Assigned',
  }),
]

export const notificationPlanSubActionOptions: TitleInterface[] = [
  new TitleInterface({
    id: NotificationPlanSubActionEnum.LOW,
    title: 'Low',
    translationKey: 'Low',
  }),
  new TitleInterface({
    id: NotificationPlanSubActionEnum.MEDIUM,
    title: 'Medium',
    translationKey: 'Medium',
  }),
  new TitleInterface({
    id: NotificationPlanSubActionEnum.MEDIUM_IS_NEAR_MISS,
    title: 'Medium is near miss',
    translationKey: 'medium_is_near_miss',
  }),
  new TitleInterface({
    id: NotificationPlanSubActionEnum.HIGH,
    title: 'High',
    translationKey: 'High',
  }),
]
