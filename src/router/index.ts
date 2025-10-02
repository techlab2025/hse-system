import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/AboutView.vue'
import Dashboard from '../views/Dashboard.vue'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/auth/login.vue'),
    },
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
          component: () => import('../views/Admin/Lang/AddLang.vue'),
        },
        {
          path: 'lang/:id',
          name: 'Edit language',
          component: () => import('../views/Admin/Lang/EditLang.vue'),
        },
        {
          path: 'languages',
          name: 'languages',
          component: () => import('../views/Admin/Lang/IndexLang.vue'),
        },
        {
          path: 'industry',
          name: 'industry',
          component: () => import('../views/Admin/Industry/IndexIndustry.vue'),
        },
        {
          path: 'industry/add',
          name: 'Add industry',
          component: () => import('../views/Admin/Industry/AddIndustry.vue'),
        },
        {
          path: 'industry/:id',
          name: 'Edit industry',
          component: () => import('../views/Admin/Industry/EditIndustry.vue'),
        },
        {
          path: 'equipment-types/:parent_id?',
          name: 'Equipment Type',
          component: () => import('../views/Admin/EquipmentType/IndexEquipmentType.vue'),
        },
        {
          path: 'equipment-type/add/:parent_id?',
          name: 'Add Equipment Type',
          component: () => import('../views/Admin/EquipmentType/AddEquipmentType.vue'),
        },

        {
          path: 'equipment-type/:id',
          name: 'Edit Equipment Type',
          component: () => import('../views/Admin/EquipmentType/EditEquipmentType.vue'),
        },
        {
          path: 'equipments/:id?',
          name: 'Equipment ',
          component: () => import('../views/Admin/Equipment/IndexEquipment.vue'),
        },
        {
          path: 'equipment/add/:id?',
          name: 'Add Equipment',
          component: () => import('../views/Admin/Equipment/AddEquipment.vue'),
        },
        {
          path: 'equipment/:id',
          name: 'Edit Equipment ',
          component: () => import('../views/Admin/Equipment/EditEquipment.vue'),
        },
        {
          path: 'hazard-types',
          name: 'Hazard Type',
          component: () => import('../views/Admin/HazardType/IndexHazardType.vue'),
        },
        {
          path: 'hazard-type/add',
          name: 'Add Hazard Type',
          component: () => import('../views/Admin/HazardType/AddHazardType.vue'),
        },
        {
          path: 'hazard-type/:id',
          name: 'Edit Hazard Type',
          component: () => import('../views/Admin/HazardType/EditHazardType.vue'),
        },

        {
          path: 'templates',
          name: 'Templates',
          component: () => import('../views/Admin/Template/IndexTemplate.vue'),
        },

        {
          path: 'certificates',
          name: 'Certificates',
          component: () => import('../views/Admin/Certificate/IndexCertificate.vue'),
        },
        {
          path: 'certificate/add',
          name: 'Add Certificate',
          component: () => import('../views/Admin/Certificate/AddCertificate.vue'),
        },
        {
          path: 'certificate/:id',
          name: 'Edit Certificate',
          component: () => import('../views/Admin/Certificate/EditCertificate.vue'),
        },
        {
          path: 'accidents-types',
          name: 'Accidents Type',
          component: () => import('../views/Admin/Accidents/IndexAccidentsType.vue'),
        },
        {
          path: 'accidents-type/add',
          name: 'Add Accidents Type',
          component: () => import('../views/Admin/Accidents/AddAccidentsType.vue'),
        },
        {
          path: 'accidents-type/:id',
          name: 'Edit Accidents Type',
          component: () => import('../views/Admin/Accidents/EditAccidentsType.vue'),
        },
        {
          path: 'project-types',
          name: 'Project Type',
          component: () => import('../views/Admin/ProjectType/IndexProjectType.vue'),
        },
        {
          path: 'project-type/add',
          name: 'Add Project Type',
          component: () => import('../views/Admin/ProjectType/AddProjectType.vue'),
        },
        {
          path: 'project-type/:id',
          name: 'Edit Project Type',
          component: () => import('../views/Admin/ProjectType/EditProjectType.vue'),
        },

        {
          path: 'factories',
          name: 'Factories',
          component: () => import('../views/Admin/Factory/IndexFactory.vue'),
        },
        {
          path: 'factory/add',
          name: 'Add Factory',
          component: () => import('../views/Admin/Factory/AddFactory.vue'),
        },
        {
          path: 'factory/:id',
          name: 'Edit Factory',
          component: () => import('../views/Admin/Factory/EditFactory.vue'),
        },
        {
          path: 'factories-items',
          name: 'Factories Items',
          component: () => import('../views/Admin/FactoryItem/IndexFactoryItem.vue'),
        },
        {
          path: 'factory-item/:id',
          name: 'Edit Factory Item',
          component: () => import('../views/Admin/FactoryItem/EditFactoryItem.vue'),
        },
        {
          path: 'factory-item/add',
          name: 'Add Factory Item',
          component: () => import('../views/Admin/FactoryItem/AddFactoryItem.vue'),
        },
        {
          path: 'organization',
          name: 'Organization',
          component: () => import('../views/Admin/Organization/IndexOrganization.vue'),
        },
        {
          path: 'organization/add',
          name: 'Add Organization',
          component: () => import('../views/Admin/Organization/AddOrganization.vue'),
        },
        {
          path: 'organization/:id',
          name: 'Edit organization',
          component: () => import('../views/Admin/Organization/EditOrganization.vue'),
        },
        {
          path: 'countries',
          name: 'locations Country',
          component: () => import('../views/Admin/Location/Countery/IndexCountry.vue'),
        },
        {
          path: 'countries/add',
          name: 'Add Location Country',
          component: () => import('../views/Admin/Location/Countery/AddCountry.vue'),
        },
        {
          path: 'countries/:id',
          name: 'Edit Location Country',
          component: () => import('../views/Admin/Location/Countery/EditCountry.vue'),
        },
        {
          path: 'states/:parent_id?',
          name: 'locations State',
          component: () => import('../views/Admin/Location/State/IndexState.vue'),
        },
        {
          path: 'states/add/:parent_id?',
          name: 'Add Location State',
          component: () => import('../views/Admin/Location/State/AddState.vue'),
        },
        {
          path: 'states/:id/',
          name: 'Edit Location State',
          component: () => import('../views/Admin/Location/State/EditState.vue'),
        },
        {
          path: 'cities/:parent_id?',
          name: 'locations City',
          component: () => import('../views/Admin/Location/City/IndexCity.vue'),
        },
        {
          path: 'cities/add/:parent_id?',
          name: 'Add Location City',
          component: () => import('../views/Admin/Location/City/AddCity.vue'),
        },
        {
          path: 'cities/:id',
          name: 'Edit Location City',
          component: () => import('../views/Admin/Location/City/EditCity.vue'),
        },
        {
          path: 'areas/:parent_id?',
          name: 'locations Area',
          component: () => import('../views/Admin/Location/Area/IndexArea.vue'),
        },
        {
          path: 'areas/add/:parent_id?',
          name: 'Add Location Area',
          component: () => import('../views/Admin/Location/Area/AddArea.vue'),
        },
        {
          path: 'areas/:id',
          name: 'Edit Location Area',
          component: () => import('../views/Admin/Location/Area/EditArea.vue'),
        },



        {
          path: 'about-us-features',
          name: 'About Us Features',
          component: () => import('../views/Admin/Website/AboutUsFeature/IndexAboutUsFeature.vue'),
        },

        {
          path: 'about-us-features/add',
          name: 'Add About Us Features',
          component: () => import('../views/Admin/Website/AboutUsFeature/AddAboutUsFeature.vue'),
        },
        {
          path: 'about-us-features/:id',
          name: 'Edit About Us Features',
          component: () => import('../views/Admin/Website/AboutUsFeature/EditAboutUsFeature.vue'),
        },

        {
          path: 'about-us-core',
          name: 'About Us Core',
          component: () => import('../views/Admin/Website/AboutUsCore/IndexAboutUsCore.vue'),
        },

        {
          path: 'about-us-core/add',
          name: 'Add About Us Core',
          component: () => import('../views/Admin/Website/AboutUsCore/AddAboutUsCore.vue'),
        },
        {
          path: 'about-us-core/:id',
          name: 'Edit About Us Core',
          component: () => import('../views/Admin/Website/AboutUsCore/EditAboutUsCore.vue'),
        },

        {
          path: 'template/add',
          name: 'Add Template',
          component: () => import('../views/Admin/Template/AddTemplate.vue'),
        },
        {
          path: 'template/:id',
          name: 'Edit Template',
          component: () => import('../views/Admin/Template/EditTemplate.vue'),
        },

        {
          path: 'home-about-us',
          name: 'Home About Us',
          component: () => import('../views/Admin/Website/HomeAboutUs/IndexHomeAboutUs.vue'),
        },

        {
          path: 'home-about-us/add',
          name: 'Add Home About Us',
          component: () => import('../views/Admin/Website/HomeAboutUs/AddHomeAboutUs.vue'),
        },
        {
          path: 'home-about-us/:id',
          name: 'Edit Home About Us',
          component: () => import('../views/Admin/Website/HomeAboutUs/EditHomeAboutUs.vue'),
        },

        {
          path: 'client-opinions',
          name: 'Client Opinions',
          component: () => import('../views/Admin/Website/ClientOpinion/IndexClientOpinion.vue'),
        },

        {
          path: 'client-opinion/add',
          name: 'Add Client Opinion',
          component: () => import('../views/Admin/Website/ClientOpinion/AddClientOpinion.vue'),
        },
        {
          path: 'client-opinion/:id',
          name: 'Edit Client Opinion',
          component: () => import('../views/Admin/Website/ClientOpinion/EditClientOpinion.vue'),
        },
        {
          path: 'home-contact-us',
          name: 'Home Contact Us',
          component: () => import('../views/Admin/Website/HomeContactUs/IndexHomeContactUs.vue'),
        },

        {
          path: 'headers',
          name: 'Headers',
          component: () => import('../views/Admin/Website/Header/IndexHeader.vue'),
        },

        {
          path: 'header/add',
          name: 'Add Header',
          component: () => import('../views/Admin/Website/Header/AddHeader.vue'),
        },
        {
          path: 'header/:id',
          name: 'Edit Header',
          component: () => import('../views/Admin/Website/Header/EditHeader.vue'),
        },

        {
          path: 'powerfull-features',
          name: 'PowerFull',
          component: () => import('../views/Admin/Website/PowerFull/IndexPowerFull.vue'),
        },
        {
          path: 'power-full/add',
          name: 'Add PowerFull ',
          component: () => import('../views/Admin/Website/PowerFull/AddPowerFull.vue'),
        },
        {
          path: 'power-full/:id',
          name: 'Edit PowerFull',
          component: () => import('../views/Admin/Website/PowerFull/EditPowerFull.vue'),
        },

        {
          path: 'system-works',
          name: 'System Work',
          component: () => import('../views/Admin/Website/SystemWork/IndexSystemWork.vue'),
        },

        {
          path: 'home-view-pricing',
          name: 'Home View Pricing',
          component: () =>
            import('../views/Admin/Website/HomeViewPricing/IndexHomeViewPricing.vue'),
        },
        {
          path: 'home-view-pricing/add',
          name: 'Add Home View Pricing',
          component: () => import('../views/Admin/Website/HomeViewPricing/AddHomeViewPricing.vue'),
        },
        {
          path: 'home-view-pricing/:id',
          name: 'Edit Home View Pricing',
          component: () => import('../views/Admin/Website/HomeViewPricing/EditHomeViewPricing.vue'),
        },

        {
          path: 'system-work/add',
          name: 'Add System Work',
          component: () => import('../views/Admin/Website/SystemWork/AddSystemWork.vue'),
        },
        {
          path: 'system-work/:id',
          name: 'Edit System Work',
          component: () => import('../views/Admin/Website/SystemWork/EditSystemWork.vue'),
        },

        {
          path: 'home-contact-us/add',
          name: 'Add Home Contact Us',
          component: () => import('../views/Admin/Website/HomeContactUs/AddHomeContactUs.vue'),
        },
        {
          path: 'home-contact-us/:id',
          name: 'Edit Home Contact Us',
          component: () => import('../views/Admin/Website/HomeContactUs/EditHomeContactUs.vue'),
        },

        // Category
        {
          path: 'categories',
          name: 'Categories',
          component: () => import('../views/Admin/Website/Category/IndexCategory.vue'),
        },
        {
          path: 'category/add',
          name: 'Add Category',
          component: () => import('../views/Admin/Website/Category/AddCategory.vue'),
        },
        {
          path: 'category/:id',
          name: 'Edit Category',
          component: () => import('../views/Admin/Website/Category/EditCategory.vue'),
        },
        // Hashtag
        {
          path: 'hashtags',
          name: 'Hashtags',
          component: () => import('../views/Admin/Website/Hashtag/IndexHashtag.vue'),
        },
        {
          path: 'hashtag/add',
          name: 'Add Hashtag',
          component: () => import('../views/Admin/Website/Hashtag/AddHashtag.vue'),
        },
        {
          path: 'hashtag/:id',
          name: 'Edit Hashtag',
          component: () => import('../views/Admin/Website/Hashtag/EditHashtag.vue'),
        },
        // Term
        {
          path: 'term/add',
          name: 'Add Term',
          component: () => import('../views/Admin/Website/Term/EditTerms.vue'),
        },

        // Privacy

        {
          path: 'privacy/add',
          name: 'Add Privacy',
          component: () => import('../views/Admin/Website/Privacy/EditPrivacy.vue'),
        },

        {
          path: 'services',
          name: 'Services',
          component: () => import('../views/Admin/Website/Service/IndexSerive.vue'),
        },
        {
          path: 'services/add',
          name: 'Add Service',
          component: () => import('../views/Admin/Website/Service/AddService.vue'),
        },
        {
          path: 'services/:id',
          name: 'Edit Service',
          component: () => import('../views/Admin/Website/Service/EditService.vue'),
        },
        {
          path: 'service-features',
          name: 'Services Features',
          component: () => import('../views/Admin/Website/ServiceFeatures/IndexSeriveFeatures.vue'),
        },
        {
          path: 'service-feature/add',
          name: 'Add Service Features',
          component: () => import('../views/Admin/Website/ServiceFeatures/AddServiceFeatures.vue'),
        },
        {
          path: 'service-feature/:id',
          name: 'Edit Service Features',
          component: () => import('../views/Admin/Website/ServiceFeatures/EditServiceFeatures.vue'),
        },
        {
          path: 'service_section',
          name: 'Services Sections',
          component: () => import('../views/Admin/Website/ServiceSections/IndexSeriveSection.vue'),
        },
        {
          path: 'service_section/add',
          name: 'Add Service Sections',
          component: () => import('../views/Admin/Website/ServiceSections/AddServiceSection.vue'),
        },
        {
          path: 'service_section/:id',
          name: 'Edit Service Sections',
          component: () => import('../views/Admin/Website/ServiceSections/EditServiceSection.vue'),
        },

        {
          path: 'service_logs',
          name: 'Services Logs',
          component: () => import('../views/Admin/Website/ServiceLogs/IndexSeriveLogs.vue'),
        },
        {
          path: 'service_logs/add',
          name: 'Add Service Logs',
          component: () => import('../views/Admin/Website/ServiceLogs/AddServiceLogs.vue'),
        },
        {
          path: 'service_logs/:id',
          name: 'Edit Service Logs',
          component: () => import('../views/Admin/Website/ServiceLogs/EditServiceLogs.vue'),
        },
        {
          path: 'blog',
          name: 'Blog',
          component: () => import('../views/Admin/Website/Blog/IndexBlog.vue'),
        },
        {
          path: 'blog/add',
          name: 'Add Blog',
          component: () => import('../views/Admin/Website/Blog/AddBlog.vue'),
        },
        {
          path: 'blog/:id',
          name: 'Edit Blog',
          component: () => import('../views/Admin/Website/Blog/EditBlog.vue'),
        },

        {
          path: 'system_banner',
          name: 'System Banner',
          component: () => import('../views/Admin/Website/SystemBanner/IndexSystemBanner.vue'),
        },
        {
          path: 'system_banner/add',
          name: 'Add System Banner',
          component: () => import('../views/Admin/Website/SystemBanner/AddSystemBanner.vue'),
        },
        {
          path: 'system_banner/:id',
          name: 'Edit System Banner',
          component: () => import('../views/Admin/Website/SystemBanner/EditSystemBanner.vue'),
        },
        {
          path: 'system_feature',
          name: 'System Feature',
          component: () => import('../views/Admin/Website/SystemFeature/IndexSystemFeature.vue'),
        },
        {
          path: 'system_feature/add',
          name: 'Add System Feature',
          component: () => import('../views/Admin/Website/SystemFeature/AddSystemFeature.vue'),
        },
        {
          path: 'system_feature/:id',
          name: 'Edit System Feature',
          component: () => import('../views/Admin/Website/SystemFeature/EditSystemFeature.vue'),
        },
        // Faq
        {
          path: 'faq',
          name: 'Faq',
          component: () => import('../views/Admin/Website/Faq/IndexFaq.vue'),
        },
        {
          path: 'faq/add',
          name: 'Add Faq',
          component: () => import('../views/Admin/Website/Faq/AddFaq.vue'),
        },
        {
          path: 'faq/:id',
          name: 'Edit Faq',
          component: () => import('../views/Admin/Website/Faq/EditFaq.vue'),
        },
        {
          path: 'system_risk_type',
          name: 'System Risk Type',
          component: () => import('../views/Admin/Website/SystemRiskType/IndexSystemRiskType.vue'),
        },
        {
          path: 'system_risk_type/add',
          name: 'Add System Risk Type',
          component: () => import('../views/Admin/Website/SystemRiskType/AddSystemRiskType.vue'),
        },
        {
          path: 'system_risk_type/:id',
          name: 'Edit System Risk Type',
          component: () => import('../views/Admin/Website/SystemRiskType/EditSystemRiskType.vue'),
        },
        {
          path: 'system_components',
          name: 'System Components',
          component: () =>
            import('../views/Admin/Website/SystemComponents/IndexSystemComponents.vue'),
        },
        {
          path: 'system_components/add',
          name: 'Add System Components',
          component: () =>
            import('../views/Admin/Website/SystemComponents/AddSystemComponents.vue'),
        },
        {
          path: 'system_components/:id',
          name: 'Edit System Components',
          component: () =>
            import('../views/Admin/Website/SystemComponents/EditSystemComponents.vue'),
        },
        // system risk management
        {
          path: 'system-risk-management',
          name: 'System Risk Management',
          component: () =>
            import('../views/Admin/Website/SystemRiskManagement/IndexSystemRiskManagement.vue'),
        },
        {
          path: 'system-risk-management/add',
          name: 'Add System Risk Management',
          component: () =>
            import('../views/Admin/Website/SystemRiskManagement/AddSystemRiskManagement.vue'),
        },
        {
          path: 'system-risk-management/:id',
          name: 'Edit System Risk Management',
          component: () =>
            import('../views/Admin/Website/SystemRiskManagement/EditSystemRiskManagement.vue'),
        },
        // OuR System Step
        {
          path: 'our-system-step',
          name: 'Our System Step',
          component: () => import('../views/Admin/Website/OurSystemStep/IndexOurSystemStep.vue'),
        },
        {
          path: 'our-system-step/add',
          name: 'Add Our System Step',
          component: () => import('../views/Admin/Website/OurSystemStep/AddOurSystemStep.vue'),
        },
        {
          path: 'our-system-step/:id',
          name: 'Edit Our System Step',
          component: () => import('../views/Admin/Website/OurSystemStep/EditOurSystemStep.vue'),
        },


        {
          path: 'permission/:id',
          name: 'Permission Admin',
          component: () => import('../views/Premission.vue'),

        },
      ],
    },
    {
      path: '/organization',
      name: 'Organization App',
      component: Dashboard,
      children: [
        {
          path: '/',
          name: 'Organization Home',
          component: () => import('../views/AppHome.vue'),
        },
        {
          path: 'accidents-types',
          name: 'Accidents Type Organization',
          component: () => import('../views/Admin/Accidents/IndexAccidentsType.vue'),
        },
        {

          path: "partners",
          name: "Partners Organization",
          component: () => import('../views/Organization/Partener/IndexPartener.vue'),
        },
        {
          path: "partner/add",
          name: "Add Partner Organization",
          component: () => import('../views/Organization/Partener/AddPartener.vue'),
        },
        {
          path: "partner/:id",
          name: "Edit Partner Organization",
          component: () => import('../views/Organization/Partener/EditPartener.vue'),
        },

        {
          path: 'organization-locations',
          name: 'Organization Locations',
          component: () => import('../views/Organization/OrganizationLocation/IndexOrganizationLocation.vue'),
        },

        {
          path: 'organization-location/add',
          name: 'Add Organization Location',
          component: () => import('../views/Organization/OrganizationLocation/AddOrganizationLocation.vue'),
        },
        {
          path: 'organization-location/:id',
          name: 'Edit Organization Location',
          component: () => import('../views/Organization/OrganizationLocation/EditOrganizationLocation.vue'),
        },

        {
          path: "projects",
          name: "Projects",
          component: () => import('../views/Organization/Project/IndexProject.vue'),
        },

        {
          path: "project/add",
          name: "Add Project",
          component: () => import('../views/Organization/Project/AddProject.vue'),
        },
        {
          path: "project/:id",
          name: "Edit Project",
          component: () => import('../views/Organization/Project/EditProject.vue'),
        },

        {
          path: 'accidents-type/add',
          name: 'Add Accidents Type Organization',
          component: () => import('../views/Admin/Accidents/AddAccidentsType.vue'),
        },
        {
          path: 'accidents-type/:id',
          name: 'Edit Accidents Type Organization',
          component: () => import('../views/Admin/Accidents/EditAccidentsType.vue'),
        },
        {
          path: 'certificates',
          name: 'Certificates Organization',
          component: () => import('../views/Admin/Certificate/IndexCertificate.vue'),
        },
        {
          path: 'certificate/add',
          name: 'Add Certificate Organization',
          component: () => import('../views/Admin/Certificate/AddCertificate.vue'),
        },
        {
          path: 'certificate/:id',
          name: 'Edit Certificate Organization',
          component: () => import('../views/Admin/Certificate/EditCertificate.vue'),
        },
        {
          path: 'equipment-types/:parent_id?',
          name: 'Equipment Type Organization',
          component: () => import('../views/Admin/EquipmentType/IndexEquipmentType.vue'),
        },
        {
          path: 'equipment-type/add/:parent_id?',
          name: 'Add Equipment Type Organization',
          component: () => import('../views/Admin/EquipmentType/AddEquipmentType.vue'),
        },

        {
          path: 'equipment-type/:id',
          name: 'Edit Equipment Type Organization',
          component: () => import('../views/Admin/EquipmentType/EditEquipmentType.vue'),
        },
        {
          path: 'equipments/:id?',
          name: 'Equipment Organization',
          component: () => import('../views/Admin/Equipment/IndexEquipment.vue'),
        },
        {
          path: 'equipment/add/:id?',
          name: 'Add Equipment Organization ',
          component: () => import('../views/Admin/Equipment/AddEquipment.vue'),
        },
        {
          path: 'equipment/:id',
          name: 'Edit Equipment Organization ',
          component: () => import('../views/Admin/Equipment/EditEquipment.vue'),
        },
        {
          path: 'factories',
          name: 'Factories Organization',
          component: () => import('../views/Admin/Factory/IndexFactory.vue'),
        },
        {
          path: 'factory/add',
          name: 'Add Factory Organization',
          component: () => import('../views/Admin/Factory/AddFactory.vue'),
        },
        {
          path: 'factory/:id',
          name: 'Edit Factory Organization',
          component: () => import('../views/Admin/Factory/EditFactory.vue'),
        },
        {
          path: 'factories-items',
          name: 'Factories Items Organization',
          component: () => import('../views/Admin/FactoryItem/IndexFactoryItem.vue'),
        },
        {
          path: 'factory-item/:id',
          name: 'Edit Factory Item Organization',
          component: () => import('../views/Admin/FactoryItem/EditFactoryItem.vue'),
        },
        {
          path: 'factory-item/add',
          name: 'Add Factory Item Organization',
          component: () => import('../views/Admin/FactoryItem/AddFactoryItem.vue'),
        },
        {
          path: 'hazard-types',
          name: 'Hazard Type Organization',
          component: () => import('../views/Admin/HazardType/IndexHazardType.vue'),
        },
        {
          path: 'hazard-type/add',
          name: 'Add Hazard Type Organization',
          component: () => import('../views/Admin/HazardType/AddHazardType.vue'),
        },
        {
          path: 'hazard-type/:id',
          name: 'Edit Hazard Type Organization',
          component: () => import('../views/Admin/HazardType/EditHazardType.vue'),
        },
        {
          path: 'templates',
          name: 'Templates Organization',
          component: () => import('../views/Admin/Template/IndexTemplate.vue'),
        },

          {
          path: 'template/add',
          name: 'Add Template Organization',
          component: () => import('../views/Admin/Template/AddTemplate.vue'),
        },

        {
          path: 'template/:id',
          name: 'Edit Template Organization',
          component: () => import('../views/Admin/Template/EditTemplate.vue'),
        },

        // Organization Employee

        {
          path: 'organization-employee',
          name: 'Organization Employee',

          component: () =>
            import('../views/Organization/OrganizationEmployee/IndexOrganization.vue'),
        },
        {
          path: 'organization-employee/:id',
          name: 'Edit Organization Employee',
          component: () =>
            import('../views/Organization/OrganizationEmployee/EditOrganization.vue'),
        },
        {
          path: 'organization-employee/add',
          name: 'Add Organization Employee',
          component: () => import('../views/Organization/OrganizationEmployee/AddOrganization.vue'),
        },

        // Herikaly

        {
          path: 'herikaly/:parent_id?',
          name: 'Herikaly',
          component: () => import('../views/Organization/Herikaly/IndexHerikaly.vue'),
        },
        {
          path: 'herikaly/:id',
          name: 'Edit Herikaly',
          component: () => import('../views/Organization/Herikaly/EditHerikaly.vue'),
        },
        {
          path: 'herikaly/add/:parent_id?',
          name: 'Add Herikaly',
          component: () => import('../views/Organization/Herikaly/AddHerikaly.vue'),
        },

        // Project Zone
        {
          path: 'project-zone',
          name: 'Project Zone',
          component: () => import('../views/Organization/ProjectZone/IndexProjectZone.vue'),
        },
        {
          path: 'project-zone/:id',
          name: 'Edit Project Zone',
          component: () => import('../views/Organization/ProjectZone/EditProjectZone.vue'),
        },
        {
          path: 'project-zone/add',
          name: 'Add Project Zone',
          component: () => import('../views/Organization/ProjectZone/AddProjectZone.vue'),
        },

        {
          path: 'permission/:id',
          name: 'Permission Organization',
          component: () => import('../views/Premission.vue'),

        },
      ],
    },
  ],
})



router.beforeEach((to, from, next) => {
  const userData = useUserStore()
  if (to.name !== 'Login' && !userData.isAuth) {
    next({ path: '/login' })
  } else if (to.name === 'Login' && userData.isAuth) {
    next({ path: userData.user?.type === OrganizationTypeEnum.ADMIN ? '/admin' : '/organization' })
  } else {
    next()
  }
})

export default router
