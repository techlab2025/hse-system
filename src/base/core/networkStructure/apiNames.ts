import { useUserStore } from '@/stores/user'
import { baseUrl } from './baseUrl'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

class ApiNames {
  private static _instance: ApiNames

  private constructor() {}

  public static get instance(): ApiNames {
    if (!this._instance) {
      this._instance = new ApiNames()
    }
    return this._instance
  }

  private userStore = useUserStore()
  public baseUrl = baseUrl

  // Website prefixes
  public dashboardPrefix = 'dashboard/'
  public organizationPrefix = 'organization/'

  // Dynamic prefix depending on user type
  public getPrefix(): string {
    if (this.userStore?.user?.type === OrganizationTypeEnum.ORGANIZATION) {
      return this.organizationPrefix
    } else {
      return this.dashboardPrefix
    }
  }

  public get prefix(): string {
    return this.baseUrl + this.getPrefix()
  }

  // ----------------- API endpoints (all as getters) -----------------

  // languages
  public get AddLang() {
    return this.prefix + 'create_language'
  }
  public get IndexLang() {
    return this.prefix + 'fetch_languages'
  }
  public get ShowLang() {
    return this.prefix + 'fetch_language_details'
  }
  public get EditLang() {
    return this.prefix + 'update_language'
  }
  public get DeleteLang() {
    return this.prefix + 'delete_language'
  }

  // auth
  public get AuthLoginOrganization() {
    return this.baseUrl + this.organizationPrefix + 'login'
  }
  public get AuthLogin() {
    return this.baseUrl + this.dashboardPrefix + 'login'
  }

  // Partner
  public get CreatePartner() {
    return this.prefix + 'create_partner'
  }
  public get IndexPartner() {
    return this.prefix + 'fetch_partners'
  }
  public get ShowPartner() {
    return this.prefix + 'fetch_partner_details'
  }
  public get EditPartner() {
    return this.prefix + 'update_partner'
  }
  public get DeletePartner() {
    return this.prefix + 'delete_partner'
  }

  // Inspection
  public get CreateInspection() {
    return this.prefix + 'create_task'
  }
  public get IndexInspection() {
    return this.prefix + 'fetch_tasks'
  }
  public get ShowInspection() {
    return this.prefix + 'fetch_task_details'
  }
  public get EditInspection() {
    return this.prefix + 'update_task'
  }
  public get DeleteInspection() {
    return this.prefix + 'delete_task'
  }

  // location hierarchy
  public get CreateLocationHierarchy() {
    return this.prefix + 'create_project_location_hierarchy'
  }
  public get IndexLocationHierarchy() {
    return this.prefix + 'fetch_project_locations_hierarchies'
  }
  public get ShowLocationHierarchy() {
    return this.prefix + 'fetch_location_details'
  }

  // HierarchyEmployee
  public get CreateHierarchyEmployee() {
    return this.prefix + 'create_project_location_hierarchy_employee'
  }
  public get IndexHierarchyEmployee() {
    return this.prefix + 'fetch_project_locations_hierarchy_employees'
  }
  public get ShowHierarchyEmployee() {
    return this.prefix + 'fetch_hierarchy_employee_details'
  }
  public get EditHierarchyEmployee() {
    return this.prefix + 'update_hierarchy_employee'
  }
  public get DeleteHierarchyEmployee() {
    return this.prefix + 'delete_hierarchy_employee'
  }

  public get IndexProjectLocation() {
    return this.prefix + 'fetch_project_locations'
  }

  // objectives
  public get CreateObjective() {
    return this.prefix + 'create_objective'
  }
  public get IndexObjectives() {
    return this.prefix + 'fetch_objectives'
  }
  public get ShowObjective() {
    return this.prefix + 'fetch_objective_details'
  }
  public get EditObjective() {
    return this.prefix + 'update_objective'
  }
  public get DeleteObjective() {
    return this.prefix + 'delete_objective'
  }

  // admin
  public get CreateAdmin() {
    return this.prefix + 'create_admin'
  }
  public get IndexAdmin() {
    return this.prefix + 'fetch_admins'
  }
  public get ShowAdmin() {
    return this.prefix + 'fetch_admin_details'
  }
  public get EditAdmin() {
    return this.prefix + 'update_admin'
  }
  public get DeleteAdmin() {
    return this.prefix + 'delete_admin'
  }

  // methods
  public get CreateMethod() {
    return this.prefix + 'create_method'
  }
  public get IndexMethod() {
    return this.prefix + 'fetch_methods'
  }
  public get ShowMethod() {
    return this.prefix + 'fetch_method_details'
  }
  public get EditMethod() {
    return this.prefix + 'update_method'
  }
  public get DeleteMethod() {
    return this.prefix + 'delete_method'
  }

  // team
  public get CreateTeam() {
    return this.prefix + 'create_team'
  }
  public get IndexTeam() {
    return this.prefix + 'fetch_teams'
  }
  public get ShowTeam() {
    return this.prefix + 'fetch_team_details'
  }
  public get EditTeam() {
    return this.prefix + 'update_team'
  }
  public get DeleteTeam() {
    return this.prefix + 'delete_team'
  }

  // contractor
  public get CreateContractor() {
    return this.prefix + 'create_contractor'
  }
  public get IndexContractor() {
    return this.prefix + 'fetch_contractors'
  }
  public get ShowContractor() {
    return this.prefix + 'fetch_contractor_details'
  }
  public get EditContractor() {
    return this.prefix + 'update_contractor'
  }
  public get DeleteContractor() {
    return this.prefix + 'delete_contractor'
  }

  // permission
  public get IndexPermission() {
    return this.prefix + 'fetch_permissions'
  }
  public get ShowPermission() {
    return this.prefix + 'show_permissions'
  }
  public get EditPermission() {
    return this.prefix + 'create_permissions'
  }
  public get DeletePermission() {
    return this.prefix + 'delete_permission'
  }

  // organization location
  public get CreateOrganizationLocation() {
    return this.prefix + 'create_organization_location'
  }
  public get IndexOrganizationLocation() {
    return this.prefix + 'fetch_organization_locations'
  }
  public get ShowOrganizationLocation() {
    return this.prefix + 'fetch_organization_location_details'
  }
  public get EditOrganizationLocation() {
    return this.prefix + 'update_organization_location'
  }
  public get DeleteOrganizationLocation() {
    return this.prefix + 'delete_organization_location'
  }

  // project
  public get CreateProject() {
    return this.prefix + 'create_project'
  }
  public get IndexProject() {
    return this.prefix + 'fetch_projects'
  }
  public get ShowProject() {
    return this.prefix + 'fetch_project_details'
  }
  public get EditProject() {
    return this.prefix + 'update_project'
  }
  public get DeleteProject() {
    return this.prefix + 'delete_project'
  }

  // AboutUsFeature
  public get CreateAboutUsFeature() {
    return this.prefix + 'create_about_us_feature'
  }
  public get IndexAboutUsFeature() {
    return this.prefix + 'fetch_about_us_features'
  }
  public get ShowAboutUsFeature() {
    return this.prefix + 'fetch_about_us_feature_details'
  }
  public get EditAboutUsFeature() {
    return this.prefix + 'update_about_us_feature'
  }
  public get DeleteAboutUsFeature() {
    return this.prefix + 'delete_about_us_feature'
  }
  public get ChangeStatusAboutUsFeature() {
    return this.prefix + 'change_about_us_feature_active_status'
  }

  // systemRiskManagement
  public get CreateSystemRiskManagement() {
    return this.prefix + 'create_our_system_risk_management'
  }
  public get IndexSystemRiskManagement() {
    return this.prefix + 'fetch_our_system_risk_managements'
  }
  public get ShowSystemRiskManagement() {
    return this.prefix + 'fetch_our_system_risk_management_details'
  }
  public get EditSystemRiskManagement() {
    return this.prefix + 'update_our_system_risk_management'
  }
  public get DeleteSystemRiskManagement() {
    return this.prefix + 'delete_our_system_risk_management'
  }
  public get ChangeStatusSystemRiskManagement() {
    return this.prefix + 'change_our_system_risk_management_active_status'
  }

  // AboutUsCore
  public get CreateAboutUsCore() {
    return this.prefix + 'create_about_us_core'
  }
  public get IndexAboutUsCore() {
    return this.prefix + 'fetch_about_us_core'
  }
  public get ShowAboutUsCore() {
    return this.prefix + 'fetch_about_us_core_details'
  }
  public get EditAboutUsCore() {
    return this.prefix + 'update_about_us_core'
  }
  public get DeleteAboutUsCore() {
    return this.prefix + 'delete_about_us_core'
  }
  public get ChangeStatusAboutUsCore() {
    return this.prefix + 'change_about_us_core_active_status'
  }

  // HomeViewPricing
  public get CreateHomeViewPricing() {
    return this.prefix + 'create_home_view_pricing'
  }
  public get IndexHomeViewPricing() {
    return this.prefix + 'fetch_home_view_pricing'
  }
  public get ShowHomeViewPricing() {
    return this.prefix + 'fetch_home_view_pricing_details'
  }
  public get EditHomeViewPricing() {
    return this.prefix + 'update_home_view_pricing'
  }
  public get DeleteHomeViewPricing() {
    return this.prefix + 'delete_home_view_pricing'
  }
  public get ChangeStatusHomeViewPricing() {
    return this.prefix + 'change_home_view_pricing_active_status'
  }

  // header
  public get CreateHeader() {
    return this.prefix + 'create_header'
  }
  public get IndexHeader() {
    return this.prefix + 'fetch_headers'
  }
  public get ShowHeader() {
    return this.prefix + 'fetch_header_details'
  }
  public get EditHeader() {
    return this.prefix + 'update_header'
  }
  public get DeleteHeader() {
    return this.prefix + 'delete_header'
  }
  public get ChangeStatusHeader() {
    return this.prefix + 'change_header_active_status'
  }

  // HomeAboutUs
  public get CreateHomeAboutUs() {
    return this.prefix + 'create_home_about_us'
  }
  public get IndexHomeAboutUs() {
    return this.prefix + 'fetch_home_about_us'
  }
  public get ShowHomeAboutUs() {
    return this.prefix + 'fetch_home_about_us_details'
  }
  public get EditHomeAboutUs() {
    return this.prefix + 'update_home_about_us'
  }
  public get DeleteHomeAboutUs() {
    return this.prefix + 'delete_home_about_us'
  }
  public get ChangeStatusHomeAboutUs() {
    return this.prefix + 'change_home_about_us_active_status'
  }

  // PowerFull
  public get CreatePowerFull() {
    return this.prefix + 'create_powerful_feature'
  }
  public get IndexPowerFull() {
    return this.prefix + 'fetch_powerful_features'
  }
  public get ShowPowerFull() {
    return this.prefix + 'fetch_powerful_feature_details'
  }
  public get EditPowerFull() {
    return this.prefix + 'update_powerful_feature'
  }
  public get DeletePowerFull() {
    return this.prefix + 'delete_powerful_feature'
  }
  public get ChangeStatusPowerFull() {
    return this.prefix + 'change_powerful_feature_active_status'
  }

  // SystemWork
  public get CreateSystemWork() {
    return this.prefix + 'create_system_work'
  }
  public get IndexSystemWork() {
    return this.prefix + 'fetch_system_works'
  }
  public get ShowSystemWork() {
    return this.prefix + 'fetch_system_work_details'
  }
  public get EditSystemWork() {
    return this.prefix + 'update_system_work'
  }
  public get DeleteSystemWork() {
    return this.prefix + 'delete_system_work'
  }
  public get ChangeStatusSystemWork() {
    return this.prefix + 'change_system_work_active_status'
  }

  // HomeContactUs
  public get CreateHomeContactUs() {
    return this.prefix + 'create_home_contact_us'
  }
  public get IndexHomeContactUs() {
    return this.prefix + 'fetch_home_contact_us'
  }
  public get ShowHomeContactUs() {
    return this.prefix + 'fetch_home_contact_us_details'
  }
  public get EditHomeContactUs() {
    return this.prefix + 'update_home_contact_us'
  }
  public get DeleteHomeContactUs() {
    return this.prefix + 'delete_home_contact_us'
  }
  public get ChangeStatusHomeContactUs() {
    return this.prefix + 'change_home_contact_us_active_status'
  }

  // clientOpinion
  public get CreateClientOpinion() {
    return this.prefix + 'create_client_opinion'
  }
  public get IndexClientOpinion() {
    return this.prefix + 'fetch_client_opinions'
  }
  public get ShowClientOpinion() {
    return this.prefix + 'fetch_client_opinion_details'
  }
  public get EditClientOpinion() {
    return this.prefix + 'update_client_opinion'
  }
  public get DeleteClientOpinion() {
    return this.prefix + 'delete_client_opinion'
  }
  public get ChangeStatusClientOpinion() {
    return this.prefix + 'change_client_opinion_active_status'
  }

  // Template
  public get CreateTemplate() {
    return this.prefix + 'create_template'
  }
  public get IndexTemplate() {
    return this.prefix + 'fetch_templates'
  }
  public get ShowTemplate() {
    return this.prefix + 'fetch_template_details'
  }
  public get EditTemplate() {
    return this.prefix + 'update_template'
  }
  public get DeleteTemplate() {
    return this.prefix + 'delete_template'
  }
  public get DisActiveTemplate() {
    return this.prefix + 'disable_template'
  }

  // Factory
  public get CreateFactory() {
    return this.prefix + 'create_factory'
  }
  public get IndexFactory() {
    return this.prefix + 'fetch_factories'
  }
  public get ShowFactory() {
    return this.prefix + 'fetch_factory_details'
  }
  public get EditFactory() {
    return this.prefix + 'update_factory'
  }
  public get DeleteFactory() {
    return this.prefix + 'delete_factory'
  }
  public get DisFactory() {
    return this.prefix + 'disable_factory'
  }

  // Industry
  public get CreateIndustry() {
    return this.prefix + 'create_industry'
  }
  public get IndexIndustry() {
    return this.prefix + 'fetch_industries'
  }
  public get ShowIndustry() {
    return this.prefix + 'fetch_industry_details'
  }
  public get EditIndustry() {
    return this.prefix + 'update_industry'
  }
  public get DeleteIndustry() {
    return this.prefix + 'delete_industry'
  }

  // EquipmentType
  public get CreateEquipmentType() {
    return this.prefix + 'create_equipment_type'
  }
  public get IndexEquipmentType() {
    return this.prefix + 'fetch_equipment_types'
  }
  public get ShowEquipmentType() {
    return this.prefix + 'fetch_equipment_type_details'
  }
  public get EditEquipmentType() {
    return this.prefix + 'update_equipment_type'
  }
  public get DeleteEquipmentType() {
    return this.prefix + 'delete_equipment_type'
  }
  public get DisEquipmentType() {
    return this.prefix + 'disable_equipment_type'
  }

  // Certificate
  public get CreateCertificate() {
    return this.prefix + 'create_certificate'
  }
  public get IndexCertificate() {
    return this.prefix + 'fetch_certificates'
  }
  public get ShowCertificate() {
    return this.prefix + 'fetch_certificate_details'
  }
  public get EditCertificate() {
    return this.prefix + 'update_certificate'
  }
  public get DeleteCertificate() {
    return this.prefix + 'delete_certificate'
  }
  public get DisCertificate() {
    return this.prefix + 'disable_certificate'
  }

  // Category
  public get CreateCategory() {
    return this.prefix + 'create_category'
  }
  public get IndexCategory() {
    return this.prefix + 'fetch_categories'
  }
  public get ShowCategory() {
    return this.prefix + 'fetch_category_details'
  }
  public get EditCategory() {
    return this.prefix + 'update_category'
  }
  public get DeleteCategory() {
    return this.prefix + 'delete_category'
  }
  public get DisCategory() {
    return this.prefix + 'change_category_active_status'
  }

  // Blog
  public get CreateBlog() {
    return this.prefix + 'create_blog'
  }
  public get IndexBlog() {
    return this.prefix + 'fetch_blogs'
  }
  public get ShowBlog() {
    return this.prefix + 'fetch_blog_details'
  }
  public get EditBlog() {
    return this.prefix + 'update_blog'
  }
  public get DeleteBlog() {
    return this.prefix + 'delete_blog'
  }
  public get DisBlog() {
    return this.prefix + 'change_blog_active_status'
  }
  public get ChangeStatusBlog() {
    return this.prefix + 'change_blog_active_status'
  }

  // OurSystemStep
  public get CreateOurSystemStep() {
    return this.prefix + 'create_our_system_step'
  }
  public get IndexOurSystemStep() {
    return this.prefix + 'fetch_our_system_steps'
  }
  public get ShowOurSystemStep() {
    return this.prefix + 'fetch_our_system_step_details'
  }
  public get EditOurSystemStep() {
    return this.prefix + 'update_our_system_step'
  }
  public get DeleteOurSystemStep() {
    return this.prefix + 'delete_our_system_step'
  }
  public get DisOurSystemStep() {
    return this.prefix + 'change_our_system_step_active_status'
  }
  public get ChangeStatusOurSystemStep() {
    return this.prefix + 'change_our_system_step_active_status'
  }

  // Faq
  public get CreateFaq() {
    return this.prefix + 'create_faq'
  }
  public get IndexFaq() {
    return this.prefix + 'fetch_faqs'
  }
  public get ShowFaq() {
    return this.prefix + 'fetch_faq_details'
  }
  public get EditFaq() {
    return this.prefix + 'update_faq'
  }
  public get DeleteFaq() {
    return this.prefix + 'delete_faq'
  }
  public get DisFaq() {
    return this.prefix + 'change_faq_active_status'
  }
  public get ChangeStatusFaq() {
    return this.prefix + 'change_faq_active_status'
  }

  // Hashtag
  public get CreateHashtag() {
    return this.prefix + 'create_hashtag'
  }
  public get IndexHashtag() {
    return this.prefix + 'fetch_hashtags'
  }
  public get ShowHashtag() {
    return this.prefix + 'fetch_hashtag_details'
  }
  public get EditHashtag() {
    return this.prefix + 'update_hashtag'
  }
  public get DeleteHashtag() {
    return this.prefix + 'delete_hashtag'
  }
  public get DisHashtag() {
    return this.prefix + 'change_hashtag_active_status'
  }

  // Term
  public get CreateTerm() {
    return this.prefix + 'create_or_update_term'
  }
  public get IndexTerm() {
    return this.prefix + 'fetch_terms'
  }
  public get ShowTerm() {
    return this.prefix + 'fetch_terms'
  }
  public get EditTerm() {
    return this.prefix + 'create_or_update_term'
  }
  public get DeleteTerm() {
    return this.prefix + 'delete_term'
  }
  public get DisTerm() {
    return this.prefix + 'change_term_active_status'
  }

  // Privacy
  public get CreatePrivacy() {
    return this.prefix + 'create_or_update_privacy'
  }
  public get IndexPrivacy() {
    return this.prefix + 'fetch_privacy'
  }
  public get ShowPrivacy() {
    return this.prefix + 'fetch_privacy'
  }
  public get EditPrivacy() {
    return this.prefix + 'create_or_update_privacy'
  }
  public get DeletePrivacy() {
    return this.prefix + 'delete_privacy'
  }
  public get DisPrivacy() {
    return this.prefix + 'change_privacy_active_status'
  }

  // Equipment
  public get CreateEquipment() {
    return this.prefix + 'create_equipment'
  }
  public get IndexEquipment() {
    return this.prefix + 'fetch_equipments'
  }
  public get ShowEquipment() {
    return this.prefix + 'fetch_equipment_details'
  }
  public get EditEquipment() {
    return this.prefix + 'update_equipment'
  }
  public get DeleteEquipment() {
    return this.prefix + 'delete_equipment'
  }
  public get DisEquipment() {
    return this.prefix + 'disable_equipment'
  }

  // HazardType
  public get CreateHazardType() {
    return this.prefix + 'create_hazard_type'
  }
  public get IndexHazardType() {
    return this.prefix + 'fetch_hazard_types'
  }
  public get ShowHazardType() {
    return this.prefix + 'fetch_hazard_type_details'
  }
  public get EditHazardType() {
    return this.prefix + 'update_hazard_type'
  }
  public get DeleteHazardType() {
    return this.prefix + 'delete_hazard_type'
  }
  public get DisHazardType() {
    return this.prefix + 'disable_hazard_type'
  }

  // Incedant
  public get CreateIncedant() {
    return this.prefix + 'create_incedant'
  }
  public get IndexIncedant() {
    return this.prefix + 'fetch_incedants'
  }
  public get ShowIncedant() {
    return this.prefix + 'fetch_incedant_details'
  }
  public get EditIncedant() {
    return this.prefix + 'update_incedant'
  }
  public get DeleteIncedant() {
    return this.prefix + 'delete_incedant'
  }
  public get DisIncedant() {
    return this.prefix + 'disable_incedant'
  }

  // ObserverationType
  public get CreateObserverationType() {
    return this.prefix + 'create_observation_type'
  }
  public get IndexObserverationType() {
    return this.prefix + 'fetch_observation_types'
  }
  public get ShowObserverationType() {
    return this.prefix + 'fetch_observation_type_details'
  }
  public get EditObserverationType() {
    return this.prefix + 'update_observation_type'
  }
  public get DeleteObserverationType() {
    return this.prefix + 'delete_observation_type'
  }
  public get DisObserverationType() {
    return this.prefix + 'disable_observation_type'
  }

  // Project Type
  public get CreateProjectType() {
    return this.prefix + 'create_project_type'
  }
  public get IndexProjectType() {
    return this.prefix + 'fetch_project_types'
  }
  public get ShowProjectType() {
    return this.prefix + 'fetch_project_type_details'
  }
  public get EditProjectType() {
    return this.prefix + 'update_project_type'
  }
  public get DeleteProjectType() {
    return this.prefix + 'delete_project_type'
  }
  public get DisProjectType() {
    return this.prefix + 'disable_project_type'
  }

  // factory item
  public get CreateFactoryItem() {
    return this.prefix + 'create_factory_item'
  }
  public get IndexFactoryItem() {
    return this.prefix + 'fetch_factory_items'
  }
  public get ShowFactoryItem() {
    return this.prefix + 'fetch_factory_item_details'
  }
  public get EditFactoryItem() {
    return this.prefix + 'update_factory_item'
  }
  public get DeleteFactoryItem() {
    return this.prefix + 'delete_factory_item'
  }
  public get DisFactoryItem() {
    return this.prefix + 'disable_factory_item'
  }

  // Accidents
  public get CreateAccidentsType() {
    return this.prefix + 'create_accidents_type'
  }
  public get IndexAccidentsType() {
    return this.prefix + 'fetch_accidents_types'
  }
  public get ShowAccidentsType() {
    return this.prefix + 'fetch_accidents_type_details'
  }
  public get EditAccidentsType() {
    return this.prefix + 'update_accidents_type'
  }
  public get DeleteAccidentsType() {
    return this.prefix + 'delete_accidents_type'
  }
  public get DisAccidentsType() {
    return this.prefix + 'disable_accidents_type'
  }

  // Organization
  public get CreateOrganization() {
    return this.prefix + 'create_organization'
  }
  public get IndexOrganization() {
    return this.prefix + 'fetch_organizations'
  }
  public get ShowOrganization() {
    return this.prefix + 'fetch_organization_details'
  }
  public get EditOrganization() {
    return this.prefix + 'update_organization'
  }
  public get DeleteOrganization() {
    return this.prefix + 'delete_organization'
  }

  // Location
  public get CreateLocation() {
    return this.prefix + 'create_location'
  }
  public get IndexLocation() {
    return this.prefix + 'fetch_locations'
  }
  public get ShowLocation() {
    return this.prefix + 'fetch_location_details'
  }
  public get EditLocation() {
    return this.prefix + 'update_location'
  }
  public get DeleteLocation() {
    return this.prefix + 'delete_location'
  }

  // Website Service
  public get CreateService() {
    return this.prefix + 'create_service'
  }
  public get IndexService() {
    return this.prefix + 'fetch_services'
  }
  public get ShowService() {
    return this.prefix + 'fetch_service_details'
  }
  public get EditService() {
    return this.prefix + 'update_service'
  }
  public get DeleteService() {
    return this.prefix + 'delete_service'
  }
  public get DisService() {
    return this.prefix + 'change_service_active_status'
  }

  // Website Service Feature
  public get CreateServiceFeature() {
    return this.prefix + 'create_service_feature'
  }
  public get IndexServiceFeature() {
    return this.prefix + 'fetch_service_features'
  }
  public get ShowServiceFeature() {
    return this.prefix + 'fetch_service_feature_details'
  }
  public get EditServiceFeature() {
    return this.prefix + 'update_service_feature'
  }
  public get DeleteServiceFeature() {
    return this.prefix + 'delete_service_feature'
  }
  public get DisServiceFeature() {
    return this.prefix + 'change_service_feature_active_status'
  }

  // Website Service Section
  public get CreateServiceSection() {
    return this.prefix + 'create_service_section'
  }
  public get IndexServiceSection() {
    return this.prefix + 'fetch_service_sections'
  }
  public get ShowServiceSection() {
    return this.prefix + 'fetch_service_section_details'
  }
  public get EditServiceSection() {
    return this.prefix + 'update_service_section'
  }
  public get DeleteServiceSection() {
    return this.prefix + 'delete_service_section'
  }
  public get DisServiceSection() {
    return this.prefix + 'change_service_section_active_status'
  }

  // Website Service Log
  public get CreateServiceLog() {
    return this.prefix + 'create_service_log'
  }
  public get IndexServiceLog() {
    return this.prefix + 'fetch_service_logs'
  }
  public get ShowServiceLog() {
    return this.prefix + 'fetch_service_log_details'
  }
  public get EditServiceLog() {
    return this.prefix + 'update_service_log'
  }
  public get DeleteServiceLog() {
    return this.prefix + 'delete_service_log'
  }
  public get DisServiceLog() {
    return this.prefix + 'change_service_log_active_status'
  }

  // Website System Banner
  public get CreateSystemBanner() {
    return this.prefix + 'create_our_system_banner'
  }
  public get IndexSystemBanner() {
    return this.prefix + 'fetch_our_system_banners'
  }
  public get ShowSystemBanner() {
    return this.prefix + 'fetch_our_system_banner_details'
  }
  public get EditSystemBanner() {
    return this.prefix + 'update_our_system_banner'
  }
  public get DeleteSystemBanner() {
    return this.prefix + 'delete_our_system_banner'
  }
  public get DisSystemBanner() {
    return this.prefix + 'change_our_system_banner_active_status'
  }

  // Website System Feature
  public get CreateSystemFeature() {
    return this.prefix + 'create_our_system_feature'
  }
  public get IndexSystemFeature() {
    return this.prefix + 'fetch_our_system_features'
  }
  public get ShowSystemFeature() {
    return this.prefix + 'fetch_our_system_feature_details'
  }
  public get EditSystemFeature() {
    return this.prefix + 'update_our_system_feature'
  }
  public get DeleteSystemFeature() {
    return this.prefix + 'delete_our_system_feature'
  }
  public get DisSystemFeature() {
    return this.prefix + 'change_our_system_feature_active_status'
  }

  // Website System Risk Type
  public get CreateSystemRiskType() {
    return this.prefix + 'create_our_system_risk_type'
  }
  public get IndexSystemRiskType() {
    return this.prefix + 'fetch_our_system_risk_types'
  }
  public get ShowSystemRiskType() {
    return this.prefix + 'fetch_our_system_risk_type_details'
  }
  public get EditSystemRiskType() {
    return this.prefix + 'update_our_system_risk_type'
  }
  public get DeleteSystemRiskType() {
    return this.prefix + 'delete_our_system_risk_type'
  }
  public get DisSystemRiskType() {
    return this.prefix + 'change_our_system_risk_type_active_status'
  }

  // Website System Component
  public get CreateSystemComponent() {
    return this.prefix + 'create_our_system_component'
  }
  public get IndexSystemComponent() {
    return this.prefix + 'fetch_our_system_components'
  }
  public get ShowSystemComponent() {
    return this.prefix + 'fetch_our_system_component_details'
  }
  public get EditSystemComponent() {
    return this.prefix + 'update_our_system_component'
  }
  public get DeleteSystemComponent() {
    return this.prefix + 'delete_our_system_component'
  }
  public get DisSystemComponent() {
    return this.prefix + 'change_our_system_component_active_status'
  }

  // Organization Employee
  public get CreateOrganizatoinEmployee() {
    return this.prefix + 'create_organization_employee'
  }
  public get IndexOrganizatoinEmployee() {
    return this.prefix + 'fetch_organization_employees'
  }
  public get ShowOrganizatoinEmployee() {
    return this.prefix + 'fetch_organization_employee_details'
  }
  public get EditOrganizatoinEmployee() {
    return this.prefix + 'update_organization_employee'
  }
  public get DeleteOrganizatoinEmployee() {
    return this.prefix + 'delete_organization_employee'
  }
  public get DisOrganizatoinEmployee() {
    return this.prefix + 'disable_project_type'
  }

  // Herikaly
  public get CreateHerikaly() {
    return this.prefix + 'create_herikaly'
  }
  public get IndexHerikaly() {
    return this.prefix + 'fetch_herikalys'
  }
  public get ShowHerikaly() {
    return this.prefix + 'fetch_herikaly_details'
  }
  public get EditHerikaly() {
    return this.prefix + 'update_herikaly'
  }
  public get DeleteHerikaly() {
    return this.prefix + 'delete_herikaly'
  }

  // ProjectZone
  public get CreateProjectZone() {
    return this.prefix + 'create_zoon'
  }
  public get IndexProjectZone() {
    return this.prefix + 'fetch_zoons'
  }
  public get ShowProjectZone() {
    return this.prefix + 'fetch_zoon_details'
  }
  public get EditProjectZone() {
    return this.prefix + 'update_zoon'
  }
  public get DeleteProjectZone() {
    return this.prefix + 'delete_zoon'
  }

  // TemplateItem
  public get CreateTemplateItem() {
    return this.prefix + 'create_template_item'
  }
  public get IndexTemplateItem() {
    return this.prefix + 'fetch_template_items'
  }
  public get ShowTemplateItem() {
    return this.prefix + 'fetch_template_item_details'
  }
  public get EditTemplateItem() {
    return this.prefix + 'update_template_item'
  }
  public get DeleteTemplateItem() {
    return this.prefix + 'delete_template_item'
  }

  // Project location employees helpers
  public get FetchProjectLocationEmployee() {
    return this.prefix + 'fetch_project_location_employees'
  }
  public get FetchProjectLocationsEmployee() {
    return this.prefix + 'fetch_project_locations_employees'
  }
  public get FetchProjectLocationTeamEmployees() {
    return this.prefix + 'fetch_project_location_team_employees'
  }

  public get CreateProjectLocationTeamEmployee() {
    return this.prefix + 'create_project_location_team_employee'
  }
  public get CreateProjectZoonEquipment() {
    return this.prefix + 'create_project_zoon_equipment'
  }

  public get IndexProjectLocationZones() {
    return this.prefix + 'fetch_zoons_by_location_ids'
  }
  public get ProjectCustomLocation() {
    return this.prefix + 'fetch_full_project_locations'
  }

  // observation
  public get CreateObservation() {
    return this.prefix + 'create_observation'
  }
  public get IndexObservation() {
    return this.prefix + 'fetch_observations'
  }
  public get ShowObservation() {
    return this.prefix + 'fetch_observation_details'
  }
  public get EditObservation() {
    return this.prefix + 'update_observation'
  }
  public get DeleteObservation() {
    return this.prefix + 'delete_observation'
  }
  // Hazard
  public get CreateHazard() {
    return this.prefix + 'create_observation'
  }
  public get IndexHazard() {
    return this.prefix + 'fetch_observations'
  }
  public get ShowHazard() {
    return this.prefix + 'fetch_observation_details'
  }
  public get EditHazard() {
    return this.prefix + 'update_observation'
  }
  public get DeleteHazard() {
    return this.prefix + 'delete_observation'
  }
  public get FetchProjectZones() {
    return this.prefix + 'fetch_project_zoons'
  }

  // healthconditions
  public get CreateHealthCondition() {
    return this.prefix + 'create_health_condition'
  }
  public get IndexHealthCondition() {
    return this.prefix + 'fetch_health_conditions'
  }
  public get ShowHealthCondition() {
    return this.prefix + 'fetch_health_condition_details'
  }
  public get EditHealthCondition() {
    return this.prefix + 'update_health_condition'
  }
  public get DeleteHealthCondition() {
    return this.prefix + 'delete_health_condition'
  }
  public get DisHealthConditions() {
    return this.prefix + 'disable_health_condition'
  }
  // Create Task Answer
  public get CreateTaskAnswer() {
    return this.prefix + 'create_task_result'
  }
  public get FetchTaskResult() {
    return this.prefix + 'fetch_task_details'
  }
  public get FetchMyZones() {
    return this.prefix + 'fetch_my_zoons'
  }
  public get FetchMyProjects() {
    return this.prefix + 'fetch_my_projects'
  }

  // Investigating Result
  public get CreateInvestigatingResult() {
    return this.prefix + 'create_full_investigation'
  }
  public get IndexInvestigatingResult() {
    return this.prefix + 'fetch_investigations'
  }
  public get ShowInvestigatingResult() {
    return this.prefix + 'fetch_investigation_details'
  }
}

export { ApiNames }
