import { baseUrl } from './baseUrl'

class ApiNames {
  private static _instance: ApiNames

  private constructor() {}

  public static get instance(): ApiNames {
    if (!this._instance) {
      this._instance = new ApiNames()
    }
    return this._instance
  }

  public baseUrl = baseUrl

  //Website
  public apiPrefix = 'api/'
  public dashboardPrefix = 'dashboard/'
  public employeePrefix = 'employee/'

  //languages

  public AddLang = this.baseUrl + this.dashboardPrefix + 'create_language'
  public IndexLang = this.baseUrl + this.dashboardPrefix + 'fetch_languages'
  public ShowLang = this.baseUrl + this.dashboardPrefix + 'fetch_language_details'
  public EditLang = this.baseUrl + this.dashboardPrefix + 'update_language'
  public DeleteLang = this.baseUrl + this.dashboardPrefix + 'delete_language'




  // HomeViewPricing

  public CreateHomeViewPricing = this.baseUrl + this.dashboardPrefix + 'create_home_view_pricing'
  public IndexHomeViewPricing = this.baseUrl + this.dashboardPrefix + 'fetch_home_view_pricing'
  public ShowHomeViewPricing = this.baseUrl + this.dashboardPrefix + 'fetch_home_view_pricing_details'
  public EditHomeViewPricing = this.baseUrl + this.dashboardPrefix + 'update_home_view_pricing'
  public DeleteHomeViewPricing = this.baseUrl + this.dashboardPrefix + 'delete_home_view_pricing'
  public ChangeStatusHomeViewPricing = this.baseUrl + this.dashboardPrefix + 'change_home_view_pricing_active_status'

  // header

  public CreateHeader = this.baseUrl + this.dashboardPrefix + 'create_header'
  public IndexHeader = this.baseUrl + this.dashboardPrefix + 'fetch_headers'
  public ShowHeader = this.baseUrl + this.dashboardPrefix + 'fetch_header_details'
  public EditHeader = this.baseUrl + this.dashboardPrefix + 'update_header'
  public DeleteHeader = this.baseUrl + this.dashboardPrefix + 'delete_header'
  public ChangeStatusHeader = this.baseUrl + this.dashboardPrefix + 'change_header_active_status'


  // HomeAboutUs

  public CreateHomeAboutUs = this.baseUrl + this.dashboardPrefix + 'create_home_about_us'
  public IndexHomeAboutUs = this.baseUrl + this.dashboardPrefix + 'fetch_home_about_us'
  public ShowHomeAboutUs = this.baseUrl + this.dashboardPrefix + 'fetch_home_about_us_details'
  public EditHomeAboutUs = this.baseUrl + this.dashboardPrefix + 'update_home_about_us'
  public DeleteHomeAboutUs = this.baseUrl + this.dashboardPrefix + 'delete_home_about_us'
  public ChangeStatusHomeAboutUs = this.baseUrl + this.dashboardPrefix + 'change_home_about_us_active_status'


  // PowerFull

  public CreatePowerFull = this.baseUrl + this.dashboardPrefix + 'create_powerful_feature'
  public IndexPowerFull = this.baseUrl + this.dashboardPrefix + 'fetch_powerful_features'
  public ShowPowerFull = this.baseUrl + this.dashboardPrefix + 'fetch_powerful_feature_details'
  public EditPowerFull = this.baseUrl + this.dashboardPrefix + 'update_powerful_feature'
  public DeletePowerFull = this.baseUrl + this.dashboardPrefix + 'delete_powerful_feature'
  public ChangeStatusPowerFull = this.baseUrl + this.dashboardPrefix + 'change_powerful_feature_active_status'


  // SystemWork

  public CreateSystemWork = this.baseUrl + this.dashboardPrefix + 'create_system_work'
  public IndexSystemWork = this.baseUrl + this.dashboardPrefix + 'fetch_system_works'
  public ShowSystemWork = this.baseUrl + this.dashboardPrefix + 'fetch_system_work_details'
  public EditSystemWork = this.baseUrl + this.dashboardPrefix + 'update_system_work'
  public DeleteSystemWork = this.baseUrl + this.dashboardPrefix + 'delete_system_work'
  public ChangeStatusSystemWork = this.baseUrl + this.dashboardPrefix + 'change_system_work_active_status'



  // HomeContactUs
  public CreateHomeContactUs = this.baseUrl + this.dashboardPrefix + 'create_home_contact_us'
  public IndexHomeContactUs = this.baseUrl + this.dashboardPrefix + 'fetch_home_contact_us'
  public ShowHomeContactUs = this.baseUrl + this.dashboardPrefix + 'fetch_home_contact_us_details'
  public EditHomeContactUs = this.baseUrl + this.dashboardPrefix + 'update_home_contact_us'
  public DeleteHomeContactUs = this.baseUrl + this.dashboardPrefix + 'delete_home_contact_us'
  public ChangeStatusHomeContactUs =
    this.baseUrl + this.dashboardPrefix + 'change_home_contact_us_active_status'

  // clientOpinion
  public CreateClientOpinion = this.baseUrl + this.dashboardPrefix + 'create_client_opinion'
  public IndexClientOpinion = this.baseUrl + this.dashboardPrefix + 'fetch_client_opinions'
  public ShowClientOpinion = this.baseUrl + this.dashboardPrefix + 'fetch_client_opinion_details'
  public EditClientOpinion = this.baseUrl + this.dashboardPrefix + 'update_client_opinion'
  public DeleteClientOpinion = this.baseUrl + this.dashboardPrefix + 'delete_client_opinion'
  public ChangeStatusClientOpinion =
    this.baseUrl + this.dashboardPrefix + 'change_client_opinion_active_status'

  // Template
  public CreateTemplate = this.baseUrl + this.dashboardPrefix + 'create_template'
  public IndexTemplate = this.baseUrl + this.dashboardPrefix + 'fetch_templates'
  public ShowTemplate = this.baseUrl + this.dashboardPrefix + 'fetch_template_details'
  public EditTemplate = this.baseUrl + this.dashboardPrefix + 'update_template'
  public DeleteTemplate = this.baseUrl + this.dashboardPrefix + 'delete_template'
  public DisActiveTemplate = this.baseUrl + this.dashboardPrefix + 'disable_template'

  // Factory
  public CreateFactory = this.baseUrl + this.dashboardPrefix + 'create_factory'
  public IndexFactory = this.baseUrl + this.dashboardPrefix + 'fetch_factories'
  public ShowFactory = this.baseUrl + this.dashboardPrefix + 'fetch_factory_details'
  public EditFactory = this.baseUrl + this.dashboardPrefix + 'update_factory'
  public DeleteFactory = this.baseUrl + this.dashboardPrefix + 'delete_factory'
  public DisFactory = this.baseUrl + this.dashboardPrefix + 'disable_factory'

  // Industry

  public CreateIndustry = this.baseUrl + this.dashboardPrefix + 'create_industry'
  public IndexIndustry = this.baseUrl + this.dashboardPrefix + 'fetch_industries'
  public ShowIndustry = this.baseUrl + this.dashboardPrefix + 'fetch_industry_details'
  public EditIndustry = this.baseUrl + this.dashboardPrefix + 'update_industry'
  public DeleteIndustry = this.baseUrl + this.dashboardPrefix + 'delete_industry'

  //EquipmentType
  public CreateEquipmentType = this.baseUrl + this.dashboardPrefix + 'create_equipment_type'
  public IndexEquipmentType = this.baseUrl + this.dashboardPrefix + 'fetch_equipment_types'
  public ShowEquipmentType = this.baseUrl + this.dashboardPrefix + 'fetch_equipment_type_details'
  public EditEquipmentType = this.baseUrl + this.dashboardPrefix + 'update_equipment_type'
  public DeleteEquipmentType = this.baseUrl + this.dashboardPrefix + 'delete_equipment_type'
  public DisEquipmentType = this.baseUrl + this.dashboardPrefix + 'disable_equipment_type'

  // Certificate
  public CreateCertificate = this.baseUrl + this.dashboardPrefix + 'create_certificate'
  public IndexCertificate = this.baseUrl + this.dashboardPrefix + 'fetch_certificates'
  public ShowCertificate = this.baseUrl + this.dashboardPrefix + 'fetch_certificate_details'
  public EditCertificate = this.baseUrl + this.dashboardPrefix + 'update_certificate'
  public DeleteCertificate = this.baseUrl + this.dashboardPrefix + 'delete_certificate'
  public DisCertificate = this.baseUrl + this.dashboardPrefix + 'disable_certificate'

  // Category
  public CreateCategory = this.baseUrl + this.dashboardPrefix + 'create_category'
  public IndexCategory = this.baseUrl + this.dashboardPrefix + 'fetch_categories'
  public ShowCategory = this.baseUrl + this.dashboardPrefix + 'fetch_category_details'
  public EditCategory = this.baseUrl + this.dashboardPrefix + 'update_category'
  public DeleteCategory = this.baseUrl + this.dashboardPrefix + 'delete_category'
  public DisCategory = this.baseUrl + this.dashboardPrefix + 'change_category_active_status'

  // Blog
  public CreateBlog = this.baseUrl + this.dashboardPrefix + 'create_blog'
  public IndexBlog = this.baseUrl + this.dashboardPrefix + 'fetch_blogs'
  public ShowBlog = this.baseUrl + this.dashboardPrefix + 'fetch_blog_details'
  public EditBlog = this.baseUrl + this.dashboardPrefix + 'update_blog'
  public DeleteBlog = this.baseUrl + this.dashboardPrefix + 'delete_blog'
  public DisBlog = this.baseUrl + this.dashboardPrefix + 'change_blog_active_status'
  public ChangeStatusBlog = this.baseUrl + this.dashboardPrefix + 'change_blog_active_status'

  // Hashtag
  public CreateHashtag = this.baseUrl + this.dashboardPrefix + 'create_hashtag'
  public IndexHashtag = this.baseUrl + this.dashboardPrefix + 'fetch_hashtags'
  public ShowHashtag = this.baseUrl + this.dashboardPrefix + 'fetch_hashtag_details'
  public EditHashtag = this.baseUrl + this.dashboardPrefix + 'update_hashtag'
  public DeleteHashtag = this.baseUrl + this.dashboardPrefix + 'delete_hashtag'
  public DisHashtag = this.baseUrl + this.dashboardPrefix + 'change_hashtag_active_status'

  // Term
  public CreateTerm = this.baseUrl + this.dashboardPrefix + 'create_or_update_term'
  public IndexTerm = this.baseUrl + this.dashboardPrefix + 'fetch_terms'
  public ShowTerm = this.baseUrl + this.dashboardPrefix + 'fetch_terms'
  public EditTerm = this.baseUrl + this.dashboardPrefix + 'create_or_update_term'
  public DeleteTerm = this.baseUrl + this.dashboardPrefix + 'delete_term'
  public DisTerm = this.baseUrl + this.dashboardPrefix + 'change_term_active_status'

  // privacy
  public CreatePrivacy = this.baseUrl + this.dashboardPrefix + 'create_or_update_privacy'
  public IndexPrivacy = this.baseUrl + this.dashboardPrefix + 'fetch_privacy'
  public ShowPrivacy = this.baseUrl + this.dashboardPrefix + 'fetch_privacy'
  public EditPrivacy = this.baseUrl + this.dashboardPrefix + 'create_or_update_privacy'
  public DeletePrivacy = this.baseUrl + this.dashboardPrefix + 'delete_privacy'
  public DisPrivacy = this.baseUrl + this.dashboardPrefix + 'change_privacy_active_status'

  //Equipment
  public CreateEquipment = this.baseUrl + this.dashboardPrefix + 'create_equipment'
  public IndexEquipment = this.baseUrl + this.dashboardPrefix + 'fetch_equipments'
  public ShowEquipment = this.baseUrl + this.dashboardPrefix + 'fetch_equipment_details'
  public EditEquipment = this.baseUrl + this.dashboardPrefix + 'update_equipment'
  public DeleteEquipment = this.baseUrl + this.dashboardPrefix + 'delete_equipment'
  public DisEquipment = this.baseUrl + this.dashboardPrefix + 'disable_equipment'

  //HazardType
  public CreateHazardType = this.baseUrl + this.dashboardPrefix + 'create_hazard_type'
  public IndexHazardType = this.baseUrl + this.dashboardPrefix + 'fetch_hazard_types'
  public ShowHazardType = this.baseUrl + this.dashboardPrefix + 'fetch_hazard_type_details'
  public EditHazardType = this.baseUrl + this.dashboardPrefix + 'update_hazard_type'
  public DeleteHazardType = this.baseUrl + this.dashboardPrefix + 'delete_hazard_type'
  public DisHazardType = this.baseUrl + this.dashboardPrefix + 'disable_hazard_type'

  // Project Type
  public CreateProjectType = this.baseUrl + this.dashboardPrefix + 'create_project_type'
  public IndexProjectType = this.baseUrl + this.dashboardPrefix + 'fetch_project_types'
  public ShowProjectType = this.baseUrl + this.dashboardPrefix + 'fetch_project_type_details'
  public EditProjectType = this.baseUrl + this.dashboardPrefix + 'update_project_type'
  public DeleteProjectType = this.baseUrl + this.dashboardPrefix + 'delete_project_type'
  public DisProjectType = this.baseUrl + this.dashboardPrefix + 'disable_project_type'

  // factory item
  public CreateFactoryItem = this.baseUrl + this.dashboardPrefix + 'create_factory_item'
  public IndexFactoryItem = this.baseUrl + this.dashboardPrefix + 'fetch_factory_items'
  public ShowFactoryItem = this.baseUrl + this.dashboardPrefix + 'fetch_factory_item_details'
  public EditFactoryItem = this.baseUrl + this.dashboardPrefix + 'update_factory_item'
  public DeleteFactoryItem = this.baseUrl + this.dashboardPrefix + 'delete_factory_item'
  public DisFactoryItem = this.baseUrl + this.dashboardPrefix + 'disable_factory_item'

  //Accidents
  public CreateAccidentsType = this.baseUrl + this.dashboardPrefix + 'create_accidents_type'
  public IndexAccidentsType = this.baseUrl + this.dashboardPrefix + 'fetch_accidents_types'
  public ShowAccidentsType = this.baseUrl + this.dashboardPrefix + 'fetch_accidents_type_details'
  public EditAccidentsType = this.baseUrl + this.dashboardPrefix + 'update_accidents_type'
  public DeleteAccidentsType = this.baseUrl + this.dashboardPrefix + 'delete_accidents_type'
  public DisAccidentsType = this.baseUrl + this.dashboardPrefix + 'disable_accidents_type'

  //Organization
  public CreateOrganization = this.baseUrl + this.dashboardPrefix + 'create_organization'
  public IndexOrganization = this.baseUrl + this.dashboardPrefix + 'fetch_organizations'
  public ShowOrganization = this.baseUrl + this.dashboardPrefix + 'fetch_organization_details'
  public EditOrganization = this.baseUrl + this.dashboardPrefix + 'update_organization'
  public DeleteOrganization = this.baseUrl + this.dashboardPrefix + 'delete_organization'
  // public DisOrganizationType = this.baseUrl + this.dashboardPrefix + 'disable_accidents_type'

  // Location
  public CreateLocation = this.baseUrl + this.dashboardPrefix + 'create_location'
  public IndexLocation = this.baseUrl + this.dashboardPrefix + 'fetch_locations'
  public ShowLocation = this.baseUrl + this.dashboardPrefix + 'fetch_location_details'
  public EditLocation = this.baseUrl + this.dashboardPrefix + 'update_location'
  public DeleteLocation = this.baseUrl + this.dashboardPrefix + 'delete_location'

  // Website Service
  public CreateService = this.baseUrl + this.dashboardPrefix + 'create_service'
  public IndexService = this.baseUrl + this.dashboardPrefix + 'fetch_services'
  public ShowService = this.baseUrl + this.dashboardPrefix + 'fetch_service_details'
  public EditService = this.baseUrl + this.dashboardPrefix + 'update_service'
  public DeleteService = this.baseUrl + this.dashboardPrefix + 'delete_service'
  public DisService = this.baseUrl + this.dashboardPrefix + 'change_service_active_status'

  // Website Service Feature
  public CreateServiceFeature = this.baseUrl + this.dashboardPrefix + 'create_service_feature'
  public IndexServiceFeature = this.baseUrl + this.dashboardPrefix + 'fetch_service_features'
  public ShowServiceFeature = this.baseUrl + this.dashboardPrefix + 'fetch_service_feature_details'
  public EditServiceFeature = this.baseUrl + this.dashboardPrefix + 'update_service_feature'
  public DeleteServiceFeature = this.baseUrl + this.dashboardPrefix + 'delete_service_feature'
  public DisServiceFeature = this.baseUrl + this.dashboardPrefix + 'change_service_feature_active_status'

  // Website Service Setcion
  public CreateServiceSection = this.baseUrl + this.dashboardPrefix + 'create_service_section'
  public IndexServiceSection = this.baseUrl + this.dashboardPrefix + 'fetch_service_sections'
  public ShowServiceSection = this.baseUrl + this.dashboardPrefix + 'fetch_service_section_details'
  public EditServiceSection = this.baseUrl + this.dashboardPrefix + 'update_service_section'
  public DeleteServiceSection = this.baseUrl + this.dashboardPrefix + 'delete_service_section'
  public DisServiceSection = this.baseUrl + this.dashboardPrefix + 'change_service_section_active_status'

  // Website Service Log
  public CreateServiceLog = this.baseUrl + this.dashboardPrefix + 'create_service_log'
  public IndexServiceLog = this.baseUrl + this.dashboardPrefix + 'fetch_service_logs'
  public ShowServiceLog = this.baseUrl + this.dashboardPrefix + 'fetch_service_log_details'
  public EditServiceLog = this.baseUrl + this.dashboardPrefix + 'update_service_log'
  public DeleteServiceLog = this.baseUrl + this.dashboardPrefix + 'delete_service_logs'
  public DisServiceLog = this.baseUrl + this.dashboardPrefix + 'change_service_log_active_status'
}

export { ApiNames }
