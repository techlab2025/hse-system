import {baseUrl} from "./baseUrl";

class ApiNames {
    private static _instance: ApiNames;

    private constructor() {
    }

    public static get instance(): ApiNames {
        if (!this._instance) {
            this._instance = new ApiNames();
        }
        return this._instance;
    }

    public baseUrl = baseUrl;

    //Website
    public apiPrefix = "api/";
    public dashboardPrefix = "dashboard/";
    public employeePrefix = "employee/";

    //languages

  public AddLang = this.baseUrl +  this.dashboardPrefix + "create_language";
  public IndexLang = this.baseUrl +  this.dashboardPrefix + "fetch_languages";
  public ShowLang = this.baseUrl +  this.dashboardPrefix + "fetch_language_details";
  public EditLang = this.baseUrl + this.dashboardPrefix + "update_language";
  public DeleteLang = this.baseUrl + this.dashboardPrefix + "delete_language";





}

export {ApiNames};
