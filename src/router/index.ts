import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/AboutView.vue'
import Dashboard from '../views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      name: 'dashboard',
      component: Dashboard,
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('../views/AppHome.vue'),
        },
        {
          path: 'lang/add',
          name: 'Add language',
          component: () => import('../views/Lang/AddLang.vue'),
        },
        {
          path: 'lang/:id',
          name: 'Edit language',
          component: () => import('../views/Lang/EditLang.vue'),
        },
        {
          path: 'languages',
          name: 'languages',
          component: () => import('../views/Lang/IndexLang.vue'),
        },
        {
          path: 'industry',
          name: 'industry',
          component: () => import('../views/Industry/IndexIndustry.vue'),
        },
        {
          path: 'industry/add',
          name: 'Add industry',
          component: () => import('../views/Industry/AddIndustry.vue'),
        },
        {
          path: 'industry/:id',
          name: 'Edit industry',
          component: () => import('../views/Industry/EditIndustry.vue'),
        },
        {
          path: 'equipment-types/:parent_id?',
          name: 'Equipment Type',
          component: () => import('../views/EquipmentType/IndexEquipmentType.vue'),
        },
        {
          path: 'equipment-type/add/:parent_id?',
          name: 'Add Equipment Type',
          component: () => import('../views/EquipmentType/AddEquipmentType.vue'),
        },
        {
          path: 'equipment-type/:id',
          name: 'Edit Equipment Type',
          component: () => import('../views/EquipmentType/EditEquipmentType.vue'),
        },
        {
          path: 'equipments/:id?',
          name: 'Equipment ',
          component: () => import('../views/Equipment/IndexEquipment.vue'),
        },
        {
          path: 'equipment/add/:id?',
          name: 'Add Equipment ',
          component: () => import('../views/Equipment/AddEquipment.vue'),
        },
        {
          path: 'equipment/:id',
          name: 'Edit Equipment ',
          component: () => import('../views/Equipment/EditEquipment.vue'),
        },
        {
          path: 'hazard-types',
          name: 'Hazard Type',
          component: () => import('../views/HazardType/IndexHazardType.vue'),
        },
        {
          path: 'hazard-type/add',
          name: 'Add Hazard Type',
          component: () => import('../views/HazardType/AddHazardType.vue'),
        },
        {
          path: 'hazard-type/:id',
          name: 'Edit Hazard Type',
          component: () => import('../views/HazardType/EditHazardType.vue'),
        },
        {
          path: 'project-types',
          name: 'Project Type',
          component: () => import('../views/ProjectType/IndexProjectType.vue'),
        },
        {
          path: 'project-type/add',
          name: 'Add Project Type',
          component: () => import('../views/ProjectType/AddProjectType.vue'),
        },
        {
          path: 'project-type/:id',
          name: 'Edit Project Type',
          component: () => import('../views/ProjectType/EditProjectType.vue'),
        },
      ],
    },
  ],
})

export default router
