import type { RouteRecordRaw } from '@/router/types'

export const MeetingTypeRoutes: RouteRecordRaw[] = [
  {
    path: 'meeting-types',
    name: 'meeting Types',
    component: () =>
      import('@/views/Organization/MeetingType/IndexMeetingType.vue'),
    meta: { breadcrumb: 'Meeting Types', type: 'Shared', isSidebar: true },
  },
  {
    path: 'meeting-types/add',
    name: 'Add Meeting Type',
    component: () =>
      import('@/views/Organization/MeetingType/AddMeetingType.vue'),
    meta: {
      breadcrumb: 'Add Meeting Type',
      parent: 'Meeting Types',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'meeting-type/:id',
    name: 'Edit Meeting Type',
    component: () =>
      import('@/views/Organization/MeetingType/EditMeetingType.vue'),
    meta: {
      breadcrumb: 'Edit Drill Type',
      parent: 'Meeting Types',
      type: 'Shared',
      isSidebar: true,
    },
  },
  {
    path: 'meeting-type/upload-excel',
    name: 'Upload Meeting Types',
    component: () =>
      import(
        '@/views/Organization/MeetingType/MeetingTypeExcelSheet.vue'
      ),
    meta: {
      breadcrumb: 'Upload Meeting Types',
      parent: 'Meeting Types',
      type: 'Shared',
      isSidebar: true,
    },
  },
]
