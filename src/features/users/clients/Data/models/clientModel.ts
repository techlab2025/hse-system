import TitleInterface from "@/base/Data/Models/title_interface";
import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class ClientModel extends TitleInterface {
  public name: string;
  public email?: string;
  public address?: string;
  public phone?: string;
  public commercialRegisterNumber?: string;
  public taxRegisterNumber?: string;
  public firstDate?: string;
  public type: number;
  public code?: string;
  public projectCount?: number;
  public responsable?: ClientCategoryModel | null;
  public statusRegistration?: statusRegistration | null;
  public clientStatus?: number;

  constructor(
    id: number,
    title: string,
    subtitle: string,
    name: string,
    email: string,
    address: string,
    phone: string,
    commercialRegisterNumber: string,
    taxRegisterNumber: string,
    firstDate: string,
    type: number,
    code: string,
    projectCount?: number,
    responsable?: ClientCategoryModel | null,
    statusRegistration?: statusRegistration | null,
    clientStatus?: number,
  ) {
    super({ id, title, subtitle });
    this.name = name;
    this.email = email;
    this.address = address;
    this.phone = phone;
    this.commercialRegisterNumber = commercialRegisterNumber;
    this.taxRegisterNumber = taxRegisterNumber;
    this.firstDate = firstDate;
    this.type = type;
    this.code = code;
    this.projectCount = projectCount;
    this.responsable = responsable;
    this.statusRegistration = statusRegistration;
    this.clientStatus = clientStatus;
  }

  static fromMap(data: any): ClientModel {
    return new ClientModel(
      data.id,
      data.name,
      data.type,
      data.name,
      data.email,
      data.address,
      data.phone,
      data.commercial_register_number,
      data.tax_register_number,
      data.first_date,
      data.type,
      data.code ?? "",
      data.projects_count,
      data.responsable ? ClientCategoryModel.fromMap(data.responsable) : null,
      data.status_registeration,
      data.client_status,
    );
  }
}
