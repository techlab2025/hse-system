import { useUserStore } from '@/stores/user'
import { baseUrl } from './baseUrl'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

class ApiNames {
  private static _instance: ApiNames

  private constructor() { }

  public static get instance(): ApiNames {
    if (!this._instance) {
      this._instance = new ApiNames()
    }
    return this._instance
  }

  public baseUrl = baseUrl

  private userStore = useUserStore()

  //Website
  public dashboardPrefix = 'dashboard/'
  public organizationPrefix = 'organization/'

  public getPrefix(): string {
    if (this.userStore?.user?.type === OrganizationTypeEnum.ORGANIZATION) {
      return this.organizationPrefix
    }
    return this.dashboardPrefix
  }

  public prefix = this.baseUrl + this.getPrefix()

  //languages
  public AddLang = this.prefix + 'create_language'
  public IndexLang = this.prefix + 'fetch_languages'
  public ShowLang = this.prefix + 'fetch_language_details'
  public EditLang = this.prefix + 'update_language'
  public DeleteLang = this.prefix + 'delete_language'

  // auth
  public AuthLoginOrganization = this.baseUrl + this.organizationPrefix + 'login'
  public AuthLogin = this.baseUrl + this.dashboardPrefix + 'login'

  // Partner

  public CreatePartner = this.prefix + 'create_partner'
  public IndexPartner = this.prefix + 'fetch_partners'
  public ShowPartner = this.prefix + 'fetch_partner_details'
  public EditPartner = this.prefix + 'update_partner'
  public DeletePartner = this.prefix + 'delete_partner'




  // Permission
  public CreatePermission = this.prefix + 'create_permission'
  public IndexPermission = this.prefix + 'fetch_permissions'
  public ShowPermission = this.prefix + 'fetch_permission_details'
  public EditPermission = this.prefix + 'update_permission'
  public DeletePermission = this.prefix + 'delete_permission'



  // OrganizationLocation

  public CreateOrganizationLocation = this.prefix + 'create_organization_location'
  public IndexOrganizationLocation = this.prefix + 'fetch_organization_locations'
  public ShowOrganizationLocation = this.prefix + 'fetch_organization_location_details'
  public EditOrganizationLocation = this.prefix + 'update_organization_location'
  public DeleteOrganizationLocation = this.prefix + 'delete_organization_location'

  // Project

  public CreateProject = this.prefix + 'create_project'
  public IndexProject = this.prefix + 'fetch_projects'
  public ShowProject = this.prefix + 'fetch_project_details'
  public EditProject = this.prefix + 'update_project'
  public DeleteProject = this.prefix + 'delete_project'

  // AboutUsFeature

  public CreateAboutUsFeature = this.prefix + 'create_about_us_feature'
  public IndexAboutUsFeature = this.prefix + 'fetch_about_us_features'
  public ShowAboutUsFeature = this.prefix + 'fetch_about_us_feature_details'
  public EditAboutUsFeature = this.prefix + 'update_about_us_feature'
  public DeleteAboutUsFeature = this.prefix + 'delete_about_us_feature'
  public ChangeStatusAboutUsFeature = this.prefix + 'change_about_us_feature_active_status'

  // systemRiskManagement

  public CreateSystemRiskManagement = this.prefix + 'create_our_system_risk_management'
  public IndexSystemRiskManagement = this.prefix + 'fetch_our_system_risk_managements'
  public ShowSystemRiskManagement = this.prefix + 'fetch_our_system_risk_management_details'
  public EditSystemRiskManagement = this.prefix + 'update_our_system_risk_management'
  public DeleteSystemRiskManagement = this.prefix + 'delete_our_system_risk_management'
  public ChangeStatusSystemRiskManagement =
    this.prefix + 'change_our_system_risk_management_active_status'

  // AboutUsCore

  public CreateAboutUsCore = this.prefix + 'create_about_us_core'
  public IndexAboutUsCore = this.prefix + 'fetch_about_us_core'
  public ShowAboutUsCore = this.prefix + 'fetch_about_us_core_details'
  public EditAboutUsCore = this.prefix + 'update_about_us_core'
  public DeleteAboutUsCore = this.prefix + 'delete_about_us_core'
  public ChangeStatusAboutUsCore = this.prefix + 'change_about_us_core_active_status'

  // HomeViewPricing

  public CreateHomeViewPricing = this.prefix + 'create_home_view_pricing'
  public IndexHomeViewPricing = this.prefix + 'fetch_home_view_pricing'
  public ShowHomeViewPricing = this.prefix + 'fetch_home_view_pricing_details'
  public EditHomeViewPricing = this.prefix + 'update_home_view_pricing'
  public DeleteHomeViewPricing = this.prefix + 'delete_home_view_pricing'
  public ChangeStatusHomeViewPricing = this.prefix + 'change_home_view_pricing_active_status'

  // header

  public CreateHeader = this.prefix + 'create_header'
  public IndexHeader = this.prefix + 'fetch_headers'
  public ShowHeader = this.prefix + 'fetch_header_details'
  public EditHeader = this.prefix + 'update_header'
  public DeleteHeader = this.prefix + 'delete_header'
  public ChangeStatusHeader = this.prefix + 'change_header_active_status'

  // HomeAboutUs

  public CreateHomeAboutUs = this.prefix + 'create_home_about_us'
  public IndexHomeAboutUs = this.prefix + 'fetch_home_about_us'
  public ShowHomeAboutUs = this.prefix + 'fetch_home_about_us_details'
  public EditHomeAboutUs = this.prefix + 'update_home_about_us'
  public DeleteHomeAboutUs = this.prefix + 'delete_home_about_us'
  public ChangeStatusHomeAboutUs = this.prefix + 'change_home_about_us_active_status'

  // PowerFull

  public CreatePowerFull = this.prefix + 'create_powerful_feature'
  public IndexPowerFull = this.prefix + 'fetch_powerful_features'
  public ShowPowerFull = this.prefix + 'fetch_powerful_feature_details'
  public EditPowerFull = this.prefix + 'update_powerful_feature'
  public DeletePowerFull = this.prefix + 'delete_powerful_feature'
  public ChangeStatusPowerFull = this.prefix + 'change_powerful_feature_active_status'

  // SystemWork

  public CreateSystemWork = this.prefix + 'create_system_work'
  public IndexSystemWork = this.prefix + 'fetch_system_works'
  public ShowSystemWork = this.prefix + 'fetch_system_work_details'
  public EditSystemWork = this.prefix + 'update_system_work'
  public DeleteSystemWork = this.prefix + 'delete_system_work'
  public ChangeStatusSystemWork = this.prefix + 'change_system_work_active_status'

  // HomeContactUs
  public CreateHomeContactUs = this.prefix + 'create_home_contact_us'
  public IndexHomeContactUs = this.prefix + 'fetch_home_contact_us'
  public ShowHomeContactUs = this.prefix + 'fetch_home_contact_us_details'
  public EditHomeContactUs = this.prefix + 'update_home_contact_us'
  public DeleteHomeContactUs = this.prefix + 'delete_home_contact_us'
  public ChangeStatusHomeContactUs = this.prefix + 'change_home_contact_us_active_status'

  // clientOpinion
  public CreateClientOpinion = this.prefix + 'create_client_opinion'
  public IndexClientOpinion = this.prefix + 'fetch_client_opinions'
  public ShowClientOpinion = this.prefix + 'fetch_client_opinion_details'
  public EditClientOpinion = this.prefix + 'update_client_opinion'
  public DeleteClientOpinion = this.prefix + 'delete_client_opinion'
  public ChangeStatusClientOpinion = this.prefix + 'change_client_opinion_active_status'

  // Template
  public CreateTemplate = this.prefix + 'create_template'
  public IndexTemplate = this.prefix + 'fetch_templates'
  public ShowTemplate = this.prefix + 'fetch_template_details'
  public EditTemplate = this.prefix + 'update_template'
  public DeleteTemplate = this.prefix + 'delete_template'
  public DisActiveTemplate = this.prefix + 'disable_template'

  // Factory
  public CreateFactory = this.prefix + 'create_factory'
  public IndexFactory = this.prefix + 'fetch_factories'
  public ShowFactory = this.prefix + 'fetch_factory_details'
  public EditFactory = this.prefix + 'update_factory'
  public DeleteFactory = this.prefix + 'delete_factory'
  public DisFactory = this.prefix + 'disable_factory'

  // Industry

  public CreateIndustry = this.prefix + 'create_industry'
  public IndexIndustry = this.prefix + 'fetch_industries'
  public ShowIndustry = this.prefix + 'fetch_industry_details'
  public EditIndustry = this.prefix + 'update_industry'
  public DeleteIndustry = this.prefix + 'delete_industry'

  //EquipmentType
  public CreateEquipmentType = this.prefix + 'create_equipment_type'
  public IndexEquipmentType = this.prefix + 'fetch_equipment_types'
  public ShowEquipmentType = this.prefix + 'fetch_equipment_type_details'
  public EditEquipmentType = this.prefix + 'update_equipment_type'
  public DeleteEquipmentType = this.prefix + 'delete_equipment_type'
  public DisEquipmentType = this.prefix + 'disable_equipment_type'

  // Certificate
  public CreateCertificate = this.prefix + 'create_certificate'
  public IndexCertificate = this.prefix + 'fetch_certificates'
  public ShowCertificate = this.prefix + 'fetch_certificate_details'
  public EditCertificate = this.prefix + 'update_certificate'
  public DeleteCertificate = this.prefix + 'delete_certificate'
  public DisCertificate = this.prefix + 'disable_certificate'

  // Category
  public CreateCategory = this.prefix + 'create_category'
  public IndexCategory = this.prefix + 'fetch_categories'
  public ShowCategory = this.prefix + 'fetch_category_details'
  public EditCategory = this.prefix + 'update_category'
  public DeleteCategory = this.prefix + 'delete_category'
  public DisCategory = this.prefix + 'change_category_active_status'

  // Blog
  public CreateBlog = this.prefix + 'create_blog'
  public IndexBlog = this.prefix + 'fetch_blogs'
  public ShowBlog = this.prefix + 'fetch_blog_details'
  public EditBlog = this.prefix + 'update_blog'
  public DeleteBlog = this.prefix + 'delete_blog'
  public DisBlog = this.prefix + 'change_blog_active_status'
  public ChangeStatusBlog = this.prefix + 'change_blog_active_status'

  // OuSystemStep
  public CreateOurSystemStep = this.prefix + 'create_our_system_step'
  public IndexOurSystemStep = this.prefix + 'fetch_our_system_steps'
  public ShowOurSystemStep = this.prefix + 'fetch_our_system_step_details'
  public EditOurSystemStep = this.prefix + 'update_our_system_step'
  public DeleteOurSystemStep = this.prefix + 'delete_our_system_step'
  public DisOurSystemStep = this.prefix + 'change_our_system_step_active_status'
  public ChangeStatusOurSystemStep = this.prefix + 'change_our_system_step_active_status'

  // Faq
  public CreateFaq = this.prefix + 'create_faq'
  public IndexFaq = this.prefix + 'fetch_faqs'
  public ShowFaq = this.prefix + 'fetch_faq_details'
  public EditFaq = this.prefix + 'update_faq'
  public DeleteFaq = this.prefix + 'delete_faq'
  public DisFaq = this.prefix + 'change_faq_active_status'
  public ChangeStatusFaq = this.prefix + 'change_faq_active_status'

  // Hashtag
  public CreateHashtag = this.prefix + 'create_hashtag'
  public IndexHashtag = this.prefix + 'fetch_hashtags'
  public ShowHashtag = this.prefix + 'fetch_hashtag_details'
  public EditHashtag = this.prefix + 'update_hashtag'
  public DeleteHashtag = this.prefix + 'delete_hashtag'
  public DisHashtag = this.prefix + 'change_hashtag_active_status'

  // Term
  public CreateTerm = this.prefix + 'create_or_update_term'
  public IndexTerm = this.prefix + 'fetch_terms'
  public ShowTerm = this.prefix + 'fetch_terms'
  public EditTerm = this.prefix + 'create_or_update_term'
  public DeleteTerm = this.prefix + 'delete_term'
  public DisTerm = this.prefix + 'change_term_active_status'

  // privacy
  public CreatePrivacy = this.prefix + 'create_or_update_privacy'
  public IndexPrivacy = this.prefix + 'fetch_privacy'
  public ShowPrivacy = this.prefix + 'fetch_privacy'
  public EditPrivacy = this.prefix + 'create_or_update_privacy'
  public DeletePrivacy = this.prefix + 'delete_privacy'
  public DisPrivacy = this.prefix + 'change_privacy_active_status'

  //Equipment
  public CreateEquipment = this.prefix + 'create_equipment'
  public IndexEquipment = this.prefix + 'fetch_equipments'
  public ShowEquipment = this.prefix + 'fetch_equipment_details'
  public EditEquipment = this.prefix + 'update_equipment'
  public DeleteEquipment = this.prefix + 'delete_equipment'
  public DisEquipment = this.prefix + 'disable_equipment'

  //HazardType
  public CreateHazardType = this.prefix + 'create_hazard_type'
  public IndexHazardType = this.prefix + 'fetch_hazard_types'
  public ShowHazardType = this.prefix + 'fetch_hazard_type_details'
  public EditHazardType = this.prefix + 'update_hazard_type'
  public DeleteHazardType = this.prefix + 'delete_hazard_type'
  public DisHazardType = this.prefix + 'disable_hazard_type'

  // Project Type
  public CreateProjectType = this.prefix + 'create_project_type'
  public IndexProjectType = this.prefix + 'fetch_project_types'
  public ShowProjectType = this.prefix + 'fetch_project_type_details'
  public EditProjectType = this.prefix + 'update_project_type'
  public DeleteProjectType = this.prefix + 'delete_project_type'
  public DisProjectType = this.prefix + 'disable_project_type'

  // factory item
  public CreateFactoryItem = this.prefix + 'create_factory_item'
  public IndexFactoryItem = this.prefix + 'fetch_factory_items'
  public ShowFactoryItem = this.prefix + 'fetch_factory_item_details'
  public EditFactoryItem = this.prefix + 'update_factory_item'
  public DeleteFactoryItem = this.prefix + 'delete_factory_item'
  public DisFactoryItem = this.prefix + 'disable_factory_item'

  //Accidents
  public CreateAccidentsType = this.prefix + 'create_accidents_type'
  public IndexAccidentsType = this.prefix + 'fetch_accidents_types'
  public ShowAccidentsType = this.prefix + 'fetch_accidents_type_details'
  public EditAccidentsType = this.prefix + 'update_accidents_type'
  public DeleteAccidentsType = this.prefix + 'delete_accidents_type'
  public DisAccidentsType = this.prefix + 'disable_accidents_type'

  //Organization
  public CreateOrganization = this.prefix + 'create_organization'
  public IndexOrganization = this.prefix + 'fetch_organizations'
  public ShowOrganization = this.prefix + 'fetch_organization_details'
  public EditOrganization = this.prefix + 'update_organization'
  public DeleteOrganization = this.prefix + 'delete_organization'
  // public DisOrganizationType = this.prefix  + 'disable_accidents_type'

  // Location
  public CreateLocation = this.prefix + 'create_location'
  public IndexLocation = this.prefix + 'fetch_locations'
  public ShowLocation = this.prefix + 'fetch_location_details'
  public EditLocation = this.prefix + 'update_location'
  public DeleteLocation = this.prefix + 'delete_location'

  // Website Service
  public CreateService = this.prefix + 'create_service'
  public IndexService = this.prefix + 'fetch_services'
  public ShowService = this.prefix + 'fetch_service_details'
  public EditService = this.prefix + 'update_service'
  public DeleteService = this.prefix + 'delete_service'
  public DisService = this.prefix + 'change_service_active_status'

  // Website Service Feature
  public CreateServiceFeature = this.prefix + 'create_service_feature'
  public IndexServiceFeature = this.prefix + 'fetch_service_features'
  public ShowServiceFeature = this.prefix + 'fetch_service_feature_details'
  public EditServiceFeature = this.prefix + 'update_service_feature'
  public DeleteServiceFeature = this.prefix + 'delete_service_feature'
  public DisServiceFeature = this.prefix + 'change_service_feature_active_status'

  // Website Service Setcion
  public CreateServiceSection = this.prefix + 'create_service_section'
  public IndexServiceSection = this.prefix + 'fetch_service_sections'
  public ShowServiceSection = this.prefix + 'fetch_service_section_details'
  public EditServiceSection = this.prefix + 'update_service_section'
  public DeleteServiceSection = this.prefix + 'delete_service_section'
  public DisServiceSection = this.prefix + 'change_service_section_active_status'

  // Website Service Log
  public CreateServiceLog = this.prefix + 'create_service_log'
  public IndexServiceLog = this.prefix + 'fetch_service_logs'
  public ShowServiceLog = this.prefix + 'fetch_service_log_details'
  public EditServiceLog = this.prefix + 'update_service_log'
  public DeleteServiceLog = this.prefix + 'delete_service_log'
  public DisServiceLog = this.prefix + 'change_service_log_active_status'

  // Website System Banner
  public CreateSystemBanner = this.prefix + 'create_our_system_banner'
  public IndexSystemBanner = this.prefix + 'fetch_our_system_banners'
  public ShowSystemBanner = this.prefix + 'fetch_our_system_banner_details'
  public EditSystemBanner = this.prefix + 'update_our_system_banner'
  public DeleteSystemBanner = this.prefix + 'delete_our_system_banner'
  public DisSystemBanner = this.prefix + 'change_our_system_banner_active_status'

  // Website System Feature
  public CreateSystemFeature = this.prefix + 'create_our_system_feature'
  public IndexSystemFeature = this.prefix + 'fetch_our_system_features'
  public ShowSystemFeature = this.prefix + 'fetch_our_system_feature_details'
  public EditSystemFeature = this.prefix + 'update_our_system_feature'
  public DeleteSystemFeature = this.prefix + 'delete_our_system_feature'
  public DisSystemFeature = this.prefix + 'change_our_system_feature_active_status'

  // Website System Risk Type
  public CreateSystemRiskType = this.prefix + 'create_our_system_risk_type'
  public IndexSystemRiskType = this.prefix + 'fetch_our_system_risk_types'
  public ShowSystemRiskType = this.prefix + 'fetch_our_system_risk_type_details'
  public EditSystemRiskType = this.prefix + 'update_our_system_risk_type'
  public DeleteSystemRiskType = this.prefix + 'delete_our_system_risk_type'
  public DisSystemRiskType = this.prefix + 'change_our_system_risk_type_active_status'

  // Website System Component
  public CreateSystemComponent = this.prefix + 'create_our_system_component'
  public IndexSystemComponent = this.prefix + 'fetch_our_system_components'
  public ShowSystemComponent = this.prefix + 'fetch_our_system_component_details'
  public EditSystemComponent = this.prefix + 'update_our_system_component'
  public DeleteSystemComponent = this.prefix + 'delete_our_system_component'
  public DisSystemComponent = this.prefix + 'change_our_system_component_active_status'

  public CreateOrganizatoinEmployee = this.prefix + 'create_organization_employee'
  public IndexOrganizatoinEmployee = this.prefix + 'fetch_organization_employees'
  public ShowOrganizatoinEmployee = this.prefix + 'fetch_organization_employee_details'
  public EditOrganizatoinEmployee = this.prefix + 'update_organization_employee'
  public DeleteOrganizatoinEmployee = this.prefix + 'delete_organization_employee'
  public DisOrganizatoinEmployee = this.prefix + 'disable_project_type'

  // Herikaly
  public CreateHerikaly = this.prefix + 'create_herikaly'
  public IndexHerikaly = this.prefix + 'fetch_herikalys'
  public ShowHerikaly = this.prefix + 'fetch_herikaly_details'
  public EditHerikaly = this.prefix + 'update_herikaly'
  public DeleteHerikaly = this.prefix + 'delete_herikaly'
  // public DisHerikaly =this.prefix + 'disable_project_type'

  // ProjectZone
  public CreateProjectZone = this.prefix + 'create_project_zone'
  public IndexProjectZone = this.prefix + 'fetch_project_zones'
  public ShowProjectZone = this.prefix + 'fetch_project_zone_details'
  public EditProjectZone = this.prefix + 'update_project_zone'
  public DeleteProjectZone = this.prefix + 'delete_project_zone'
}

export { ApiNames }
