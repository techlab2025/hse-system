import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";
import ClientSatisfactionModel from "@/features/dashboard/settings/clientstatisfaction/Data/models/index_Client_Statisfaction_model";
import CountryModel from "@/features/website/country/Data/models/index_country_model";
import GovernorateModel from "@/features/dashboard/settings/governorate/Data/models/index_governorate_model";
import AttentionModel from "@/features/users/clients/Data/models/attention_model";
import CityModel from "@/features/dashboard/settings/city/Data/models/index_city_model";
import type TitleModel from "@/base/core/Models/title_model";

export default class ShowClientModel {
  public id: number;
  public name: string;
  public image: string;
  public email: string;
  public address: string;
  public phone: string;
  public commercialRegisterNumber: string;
  public taxRegisterNumber: string;
  public firstDate: string;
  public clientCategory: ClientCategoryModel | null;
  public clientSatisfaction: ClientSatisfactionModel | null;
  public parentId: number;
  public bio: string;
  public reasonDeal: string;
  public country: CountryModel | null;
  public city: CityModel | null;
  public regionId: number;
  public governorate: GovernorateModel | null;
  public officialTendency: string;
  public website: string;
  public employeeId: ClientCategoryModel | null;
  public clientStatus: string;
  public attention: AttentionModel | null;
  public type: number | null;
  public nationality: CountryModel | null;
  public code: string;
  public responsable: TitleModel;

  constructor(
    id: number,
    name: string,
    image: string,
    email: string,
    address: string,
    phone: string,
    commercialRegisterNumber: string,
    taxRegisterNumber: string,
    firstDate: string,
    clientCategory: ClientCategoryModel | null,
    clientSatisfaction: ClientSatisfactionModel | null,
    parentId: number,
    bio: string,
    resaonDeal: string,
    country: CountryModel | null,
    city: CityModel | null,
    regionId: number,
    governorate: GovernorateModel | null,
    officialTendency: string,
    website: string,
    employeeId: ClientCategoryModel | null,
    clientStatus: string,
    attention: AttentionModel | null,
    type: number,
    nationality: CountryModel | null,
    code: string,
    responsable: TitleModel,
  ) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.email = email;
    this.address = address;
    this.phone = phone;
    this.commercialRegisterNumber = commercialRegisterNumber;
    this.taxRegisterNumber = taxRegisterNumber;
    this.firstDate = firstDate;
    this.clientCategory = clientCategory;
    this.clientSatisfaction = clientSatisfaction;
    this.parentId = parentId;
    this.bio = bio;
    this.reasonDeal = resaonDeal;
    this.country = country;
    this.city = city;
    this.regionId = regionId;
    this.governorate = governorate;
    this.officialTendency = officialTendency;
    this.website = website;
    this.employeeId = employeeId;
    this.clientStatus = clientStatus;
    this.attention = attention;
    this.type = type;
    this.nationality = nationality;
    this.code = code;
    this.responsable = responsable;
  }

  static fromMap(data: any): ShowClientModel {
    return new ShowClientModel(
      data.id,
      data.name,
      data.image,
      data.email,
      data.address,
      data.phone,
      data.commercial_register_number,
      data.tax_register_number,
      data.first_date,
      data.client_category
        ? ClientCategoryModel.fromMap(data.client_category)
        : null,
      data.client_satisfaction
        ? ClientSatisfactionModel.fromMap(data.client_satisfaction)
        : null,
      data.parent_id,
      data.bio,
      data.reason_deal,
      data.country ? CountryModel.fromMap(data.country) : null,
      data.city ? CityModel.fromMap(data.city) : null,
      data.region,
      data.governorate ? GovernorateModel.fromMap(data.governorate) : null,
      data.official_tendency,
      data.website,
      data.responsable ? ClientCategoryModel.fromMap(data.responsable) : null,
      data.client_status,
      data.attention ? AttentionModel.fromMap(data.attentions) : null,
      data.type,
      data.nationality ? CountryModel.fromMap(data.nationality) : null,
      data.code,
      data.responsable,
    );
  }
}
