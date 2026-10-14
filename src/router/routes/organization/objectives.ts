import type { RouteRecordRaw } from '@/router/types'

export const objectivesRoutes: RouteRecordRaw[] = [
  {
    path: 'objectives/:objectiveId/details',
    name: 'organization-objectives-details',
    component: () =>
      import(
        '@/features/Organization/objectives/ObjectiveProgress/Presentation/components/ObjectiveDetails.vue'
      ),
    meta: { breadcrumb: 'op.details', parent: 'Objectives', isSidebar: false },
  },
  {
    path: 'objectives/:objectiveId/progress/update',
    name: 'organization-objectives-update-progress',
    component: () =>
      import(
        '@/features/Organization/objectives/ObjectiveProgress/Presentation/components/UpdateObjectiveProgress.vue'
      ),
    meta: { breadcrumb: 'op.update', parent: 'Objectives', isSidebar: false },
  },
  {
    path: 'objectives/:objectiveId/progress/:progressId/edit',
    name: 'organization-objectives-edit-progress',
    component: () =>
      import(
        '@/features/Organization/objectives/ObjectiveProgress/Presentation/components/UpdateObjectiveProgress.vue'
      ),
    meta: { breadcrumb: 'op.correct', parent: 'Objectives', isSidebar: false },
  },
  {
    path: 'objectives',
    name: 'Objectives',
    component: () => import('@/views/Organization/Objectives/IndexObjectives.vue'),
    meta: {
      breadcrumb: 'Objectives',
      isSidebar: false,
    },
  },
  {
    path: 'objectives/add',
    name: 'Add Objective',
    component: () => import('@/views/Organization/Objectives/AddObjectives.vue'),
    meta: {
      breadcrumb: 'Add Objective',
      parent: 'Objectives',
      isSidebar: false,
    },
  },
  {
    path: 'objectives/:id',
    name: 'Edit Objective',
    component: () => import('@/views/Organization/Objectives/EditObjectives.vue'),
    meta: {
      breadcrumb: 'Edit Objective',
      parent: 'Objectives',
      isSidebar: false,
    },
  },
]
