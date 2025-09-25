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
          path: 'templates',
          name: 'Templates',
          component: () => import('../views/Template/IndexTemplate.vue'),
        },

        {
          path: 'template/add',
          name: 'Add Template',
          component: () => import('../views/Template/AddTemplate.vue'),
        },
        {
          path: 'template/:id',
          name: 'Edit Template',
          component: () => import('../views/Template/EditTemplate.vue'),
        },

        {
          path: "client-opinions",
          name: "Client Opinions",
          component: () => import('../views/Website/ClientOpinion/IndexClientOpinion.vue'),
        },

        {
          path: 'client-opinion/add',
          name: 'Add Client Opinion',
          component: () => import('../views/Website/ClientOpinion/AddClientOpinion.vue'),
        },
        {
          path: 'client-opinion/:id',
          name: 'Edit Client Opinion',
          component: () => import('../views/Website/ClientOpinion/EditClientOpinion.vue'),
        },
        {
          path: "home-contact-us",
          name: "Home Contact Us",
          component: () => import('../views/Website/HomeContactUs/IndexHomeContactUs.vue'),
        },

        {
          path: "headers",
          name: "Headers",
          component: () => import('../views/Website/Header/IndexHeader.vue'),
        },

        {
          path: 'header/add',
          name: 'Add Header',
          component: () => import('../views/Website/Header/AddHeader.vue'),
        },
        {
          path: 'header/:id',
          name: 'Edit Header',
          component: () => import('../views/Website/Header/EditHeader.vue'),
        },

        {
          path: "powerfull-features",
          name: "PowerFull",
          component: () => import('../views/Website/PowerFull/IndexPowerFull.vue')
        },
        {
          path: "power-full/add",
          name: "Add PowerFull ",
          component: () => import('../views/Website/PowerFull/AddPowerFull.vue')
        },
        {
          path: "power-full/:id",
          name: "Edit PowerFull",
          component: () => import('../views/Website/PowerFull/EditPowerFull.vue')
        },

        {
          path: "system-works",
          name: "System Work",
          component: () => import('../views/Website/SystemWork/IndexSystemWork.vue'),
        },


        {
          path: "home-view-pricing",
          name: "Home View Pricing",
          component: () => import('../views/Website/HomeViewPricing/IndexHomeViewPricing.vue')
        },
        {
          path: "home-view-pricing/add",
          name: "Add Home View Pricing",
          component: () => import('../views/Website/HomeViewPricing/AddHomeViewPricing.vue')
        },
        {
          path: "home-view-pricing/:id",
          name: "Edit Home View Pricing",
          component: () => import('../views/Website/HomeViewPricing/EditHomeViewPricing.vue')
        },

        {
          path: 'system-work/add',
          name: 'Add System Work',
          component: () => import('../views/Website/SystemWork/AddSystemWork.vue'),
        },
        {
          path: 'system-work/:id',
          name: 'Edit System Work',
          component: () => import('../views/Website/SystemWork/EditSystemWork.vue'),
        },

        {
          path: 'home-contact-us/add',
          name: 'Add Home Contact Us',
          component: () => import('../views/Website/HomeContactUs/AddHomeContactUs.vue'),
        },
        {
          path: 'home-contact-us/:id',
          name: 'Edit Home Contact Us',
          component: () => import('../views/Website/HomeContactUs/EditHomeContactUs.vue'),
        },

        {
          path: 'certificates',
          name: 'Certificates',
          component: () => import('../views/Certificate/IndexCertificate.vue'),
        },
        {
          path: 'certificate/add',
          name: 'Add Certificate',
          component: () => import('../views/Certificate/AddCertificate.vue'),
        },
        {
          path: 'certificate/:id',
          name: 'Edit Certificate',
          component: () => import('../views/Certificate/EditCertificate.vue'),
        },
        // Category
        {
          path: 'categories',
          name: 'Categories',
          component: () => import('../views/Website/Category/IndexCategory.vue'),
        },
        {
          path: 'category/add',
          name: 'Add Category',
          component: () => import('../views/Website/Category/AddCategory.vue'),
        },
        {
          path: 'category/:id',
          name: 'Edit Category',
          component: () => import('../views/Website/Category/EditCategory.vue'),
        },
        // Hashtag
        {
          path: 'hashtags',
          name: 'Hashtags',
          component: () => import('../views/Website/Hashtag/IndexHashtag.vue'),
        },
        {
          path: 'hashtag/add',
          name: 'Add Hashtag',
          component: () => import('../views/Website/Hashtag/AddHashtag.vue'),
        },
        {
          path: 'hashtag/:id',
          name: 'Edit Hashtag',
          component: () => import('../views/Website/Hashtag/EditHashtag.vue'),
        },
        // Term
        {
          path: 'term/add',
          name: 'Add Term',
          component: () => import('../views/Website/Term/EditTerms.vue'),
        },

        // Privacy

  {
          path: 'privacy/add',
          name: 'Add Privacy',
          component: () => import('../views/Website/Privacy/EditPrivacy.vue'),
        },

        {
          path: 'accidents-types',
          name: 'Accidents Type',
          component: () => import('../views/Accidents/IndexAccidentsType.vue'),
        },
        {
          path: 'accidents-type/add',
          name: 'Add Accidents Type',
          component: () => import('../views/Accidents/AddAccidentsType.vue'),
        },
        {
          path: 'accidents-type/:id',
          name: 'Edit Accidents Type',
          component: () => import('../views/Accidents/EditAccidentsType.vue'),
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

        {
          path: 'factories',
          name: 'Factories',
          component: () => import('../views/Factory/IndexFactory.vue'),
        },
        {
          path: 'factory/add',
          name: 'Add Factory',
          component: () => import('../views/Factory/AddFactory.vue'),
        },
        {
          path: 'factory/:id',
          name: 'Edit Factory',
          component: () => import('../views/Factory/EditFactory.vue'),
        },
        {
          path: 'factories-items',
          name: 'Factories Items',
          component: () => import('../views/FactoryItem/IndexFactoryItem.vue'),
        },
        {
          path: 'factory-item/:id',
          name: 'Edit Factory Item',
          component: () => import('../views/FactoryItem/EditFactoryItem.vue'),
        },
        {
          path: 'factory-item/add',
          name: 'Add Factory Item',
          component: () => import('../views/FactoryItem/AddFactoryItem.vue'),
        },
        {
          path: 'organization',
          name: 'Organization',
          component: () => import('../views/Organization/IndexOrganization.vue'),
        },
        {
          path: 'organization/add',
          name: 'Add Organization',
          component: () => import('../views/Organization/AddOrganization.vue'),
        },
        {
          path: 'organization/:id',
          name: 'Edit organization',
          component: () => import('../views/Organization/EditOrganization.vue'),
        },
        {
          path: 'countries',
          name: 'locations Country',
          component: () => import('../views/Location/Countery/IndexCountry.vue'),
        },
        {
          path: 'countries/add',
          name: 'Add Location Country',
          component: () => import('../views/Location/Countery/AddCountry.vue'),
        },
        {
          path: 'countries/:id',
          name: 'Edit Location Country',
          component: () => import('../views/Location/Countery/EditCountry.vue'),
        },
        {
          path: 'states/:parent_id?',
          name: 'locations State',
          component: () => import('../views/Location/State/IndexState.vue'),
        },
        {
          path: 'states/add/:parent_id?',
          name: 'Add Location State',
          component: () => import('../views/Location/State/AddState.vue'),
        },
        {
          path: 'states/:id/',
          name: 'Edit Location State',
          component: () => import('../views/Location/State/EditState.vue'),
        },
        {
          path: 'cities/:parent_id?',
          name: 'locations City',
          component: () => import('../views/Location/City/IndexCity.vue'),
        },
        {
          path: 'cities/add/:parent_id?',
          name: 'Add Location City',
          component: () => import('../views/Location/City/AddCity.vue'),
        },
        {
          path: 'cities/:id',
          name: 'Edit Location City',
          component: () => import('../views/Location/City/EditCity.vue'),
        },
        {
          path: 'areas/:parent_id?',
          name: 'locations Area',
          component: () => import('../views/Location/Area/IndexArea.vue'),
        },
        {
          path: 'areas/add/:parent_id?',
          name: 'Add Location Area',
          component: () => import('../views/Location/Area/AddArea.vue'),
        },
        {
          path: 'areas/:id',
          name: 'Edit Location Area',
          component: () => import('../views/Location/Area/EditArea.vue'),
        },
      ],
    },
  ],
})

export default router
