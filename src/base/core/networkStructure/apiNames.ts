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

  // Industry

  public CreateIndustry = this.baseUrl + this.dashboardPrefix + 'create_industry'
  public IndexIndustry = this.baseUrl + this.dashboardPrefix + 'fetch_industries'
  public ShowIndustry = this.baseUrl + this.dashboardPrefix + 'fetch_industry_details'
  public EditIndustry = this.baseUrl + this.dashboardPrefix + 'update_industry'
  public DeleteIndustry = this.baseUrl + this.dashboardPrefix + 'delete_industry'


  //EquipmentType
  public CreateEquipmentType = this.baseUrl +  this.dashboardPrefix + "create_equipment_type";
  public IndexEquipmentType = this.baseUrl +  this.dashboardPrefix + "fetch_equipment_types";
  public ShowEquipmentType = this.baseUrl +  this.dashboardPrefix + "fetch_equipment_type_details";
  public EditEquipmentType = this.baseUrl +  this.dashboardPrefix + "update_equipment_type";
  public DeleteEquipmentType = this.baseUrl +  this.dashboardPrefix + "delete_equipment_type";
  public DisEquipmentType = this.baseUrl +  this.dashboardPrefix + "disable_equipment_type";


  //Equipment
  public CreateEquipment = this.baseUrl +  this.dashboardPrefix + "create_equipment";
  public IndexEquipment = this.baseUrl +  this.dashboardPrefix + "fetch_equipments";
  public ShowEquipment = this.baseUrl +  this.dashboardPrefix + "fetch_equipment_details";
  public EditEquipment = this.baseUrl +  this.dashboardPrefix + "update_equipment";
  public DeleteEquipment = this.baseUrl +  this.dashboardPrefix + "delete_equipment";
  public DisEquipment = this.baseUrl +  this.dashboardPrefix + "disable_equipment";

}

export { ApiNames }
