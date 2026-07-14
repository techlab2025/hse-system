import TitleInterface from '@/base/Data/Models/title_interface'
import { NotificationPlanActionEnum } from '../../Core/enums/notification_plan_action_enum'

export const notificationPlanActionOptions: TitleInterface[] = [
  new TitleInterface({
    id: NotificationPlanActionEnum.TASK_ASSIGNED,
    title: 'Task assigned',
  }),
  new TitleInterface({
    id: NotificationPlanActionEnum.PROJECT_LOCATION_HIERARCHY_ASSIGNMENT,
    title: 'Project location hierarchy assignment',
  }),
  new TitleInterface({
    id: NotificationPlanActionEnum.OBSERVATION_CREATED,
    title: 'Observation created',
  }),
]
