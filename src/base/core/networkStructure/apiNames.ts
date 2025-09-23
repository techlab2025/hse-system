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

  //Accidents
  public CreateAccidentsType = this.baseUrl + this.dashboardPrefix + 'create_accidents_type'
  public IndexAccidentsType = this.baseUrl + this.dashboardPrefix + 'fetch_accidents_types'
  public ShowAccidentsType = this.baseUrl + this.dashboardPrefix + 'fetch_accidents_type_details'
  public EditAccidentsType = this.baseUrl + this.dashboardPrefix + 'update_accidents_type'
  public DeleteAccidentsType = this.baseUrl + this.dashboardPrefix + 'delete_accidents_type'
  public DisAccidentsType = this.baseUrl + this.dashboardPrefix + 'disable_accidents_type'
}

export { ApiNames }
