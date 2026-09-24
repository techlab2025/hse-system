import type { RouteRecordRaw } from '@/router/types'

export const projectRoutes: RouteRecordRaw[] = [
  {
    path: 'projects',
    name: 'Projects',
    component: () => import('@/views/Organization/Project/IndexProject.vue'),
    meta: {
      breadcrumb: 'Projects',
      isSidebar: false,
    },
  },
  {
    path: 'project/add',
    name: 'Add Project',
    component: () => import('@/views/Organization/Project/AddProject.vue'),
    meta: {
      breadcrumb: 'Add Project',
      parent: 'Projects',
      isSidebar: false,
    },
  },
  {
    path: 'project/flow/:id?/:step?',
    name: 'Project Setup Flow',
    component: () => import('@/views/Organization/Project/ProjectFlow.vue'),
    meta: {
      breadcrumb: 'Project Setup',
      parent: 'Projects',
      isSidebar: false,
    },
  },
  {
    path: 'project/:id',
    name: 'Edit Project',
    component: () => import('@/views/Organization/Project/EditProject.vue'),
    meta: {
      breadcrumb: 'Edit Project',
      parent: 'Projects',
      isSidebar: false,
    },
  },
  {
    path: 'project-details/:id',
    name: 'Project Details',
    component: () => import('@/views/Organization/Project/projectDetails.vue'),
    meta: {
      breadcrumb: 'Project Details',
      parent: 'Projects',
      isSidebar: false,
    },
  },
  {
    path: 'project-details/:id/leadership',
    name: 'Project Leadership',
    component: () => import('@/views/Organization/Project/LeadershipPage.vue'),
    meta: {
      breadcrumb: 'Leadership',
      parent: 'Project Details',
      isSidebar: false,
    },
  },
  {
    path: 'project-details/:id/leadership/visits',
    name: 'Project Leadership Visits',
    component: () => import('@/views/Organization/Project/LeadershipVisitsPage.vue'),
    meta: {
      breadcrumb: 'Leadership Visits',
      parent: 'Project Leadership',
      isSidebar: false,
    },
  },
  {
    path: 'project-details/:id/leadership/visits/:visitId/report',
    name: 'Project Leadership Visit Report',
    component: () => import('@/views/Organization/Project/LeadershipVisitReportPage.vue'),
    meta: {
      breadcrumb: 'Report Leadership Visit',
      parent: 'Project Leadership Visits',
      isSidebar: false,
    },
  },
  {
    path: 'project-details/:id/ppe-matrix',
    name: 'Project PPE Matrix',
    component: () => import('@/views/Organization/Project/ppematrix/PPEActivityToolMatrixPage.vue'),
    meta: {
      breadcrumb: 'PPE Matrix',
      parent: 'Project Details',
      isSidebar: false,
    },
  },
  {
    path: 'project-details/:id/ppe-delivery',
    name: 'Project PPE Delivery',
    component: () => import('@/views/Organization/Project/ppematrix/PPEMatrixDeliveryPage.vue'),
    meta: {
      breadcrumb: 'PPE Delivery',
      parent: 'Project Details',
      isSidebar: false,
    },
  },
  {
    path: 'project-details/:id/ppe-deliveries',
    name: 'Project PPE Deliveries',
    component: () => import('@/views/Organization/Project/ppematrix/PPEMatrixDeliveriesPage.vue'),
    meta: {
      breadcrumb: 'PPE Deliveries',
      parent: 'Project Details',
      isSidebar: false,
    },
  },
  {
    path: 'project-details/:id/risk-assessments',
    name: 'Project Risk Assessments',
    component: () => import('@/views/Organization/Project/RiskAssessment/RiskAssessmentsPage.vue'),
    meta: {
      breadcrumb: 'Risk Assessments',
      parent: 'Project Details',
      isSidebar: false,
    },
  },
  {
    path: 'project-details/:id/risk-assessments/create',
    name: 'Create Risk Assessment',
    component: () =>
      import('@/views/Organization/Project/RiskAssessment/CreateRiskAssessmentPage.vue'),
    meta: {
      breadcrumb: 'Create Risk Assessment',
      parent: 'Project Risk Assessments',
      isSidebar: false,
    },
  },
  {
    path: 'project-meetings/:project_id',
    name: 'Project Meetings',
    component: () => import('@/views/Organization/Project/ProjectMeeting/ProjectMeetingsPage.vue'),
    meta: {
      breadcrumb: 'Project Meetings',
      parent: 'Project Details',
      isSidebar: false,
    },
  },
  {
    path: 'project-details/:id/management-of-change',
    name: 'management-of-change',
    component: () => import('@/views/Organization/MangementOfChange/MangementOfChange.vue'),
    meta: {
      breadcrumb: 'management-of-change',
      parent: 'Project Details',
      isSidebar: true,
    },
  },
  {
    path: 'project-details/:id/today-talk/create',
    name: 'Create Today Talk',
    component: () => import('@/views/Organization/Project/TodayTalk/CreateTodayTalk.vue'),
    meta: {
      breadcrumb: 'Create Today Talk',
      parent: 'Project Details',
      isSidebar: false,
    },
  },
  {
    path: 'employee-details/:project_id',
    name: 'Employee Details',
    component: () => import('@/views/Organization/Project/EmployeeDetails.vue'),
    meta: {
      breadcrumb: 'Employee Details',
      parent: 'Project Details',
      isSidebar: false,
    },
  },
  {
    path: 'project-hierarchy/project/:project_id',
    name: 'Project Hierarchy',
    component: () => import('@/views/Organization/Project/Hierarchy/addHierarchy.vue'),
    meta: {
      breadcrumb: 'Project Position',
      parent: 'Project Details',
      isSidebar: false,
    },
  },
  {
    path: 'project-employee/project/:project_id',
    name: 'Project Employee',
    component: () => import('@/views/Organization/Project/Employee/addEmployee.vue'),
    meta: {
      breadcrumb: 'Project Employee',
      parent: 'Project Details',
      isSidebar: false,
    },
  },
  {
    path: 'project-equipment/project/:project_id',
    name: 'Project Equipment',
    component: () => import('@/views/Organization/Project/Equipments/ProjectEquipments.vue'),
    meta: {
      breadcrumb: 'Project Equipment',
      parent: 'Project Details',
      isSidebar: false,
    },
  },
  {
    path: 'project-permit/project/:project_id',
    name: 'Project Permit',
    component: () => import('@/views/Organization/Project/PermitToWork/PermitToWorkPAge.vue'),
    meta: {
      breadcrumb: 'Project Permit To Work',
      parent: 'Project Details',
      isSidebar: false,
    },
  },
  {
    path: 'project-permit/project/templates',
    name: 'Project Permit Templates',
    component: () => import('@/views/Organization/Project/PermitToWork/PermitToWorkAnswerPage.vue'),
    meta: {
      breadcrumb: 'Project Permit To Work Templates',
      isSidebar: false,
    },
  },
  {
    path: 'project-permit/project/templates/answer',
    name: 'Project Permit Answer',
    component: () =>
      import('@/views/Organization/Project/PermitToWork/AnswerTheTemplateOfPermitPage.vue'),
    meta: {
      breadcrumb: 'Project Permit To Work Answer',
      isSidebar: false,
    },
  },
  {
    path: 'project-permits/:project_id',
    name: 'Project Permits',
    component: () => import('@/views/Organization/Project/PermitToWork/ProjectPermitsPage.vue'),
    meta: {
      breadcrumb: 'Project Permits',
      isSidebar: false,
    },
  },
  {
    path: 'project-permit/project/templates-result',
    name: 'Project Template Result',
    component: () => import('@/views/Organization/Project/PermitToWork/ProjectPermitsPage.vue'),
    meta: {
      breadcrumb: 'Project Audits',
      isSidebar: false,
    },
  },
  {
    path: 'project-my-permits/:project_id',
    name: 'Project My Permits',
    component: () => import('@/views/Organization/Project/PermitToWork/ProjectMyPermitsPage.vue'),
    meta: {
      breadcrumb: 'Project My Permits',
      isSidebar: false,
    },
  },
]
