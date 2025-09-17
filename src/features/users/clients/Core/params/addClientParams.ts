import type Params from "@/base/core/params/params";
import { formatJoinDate } from "@/base/presentation/utils/date_format";

export default class AddClientParams implements Params {
  public image: string | null;
  public name: string;
  public email: string;
  public address: string;
  public phone: string;
  public commercialRegisterNumber: string;
  public taxRegisterNumber: string;
  public firstDate: string;
  public clientCategoryId: number | null;
  public clientSatisfactionId: number | null;
  public parentId: number | null;
  public bio: string;
  public reasonDeal: string;
  public countryId: number | null;
  public cityId: number | null;
  public regionId: number | null;
  public governorateId: number | null;
  public officialTendency: string;
  public website: string;
  public employeeId: number | null;
  public type: number;
  public clientStatus: number;
  public nationalityId: number | null;
  public clientCode: number | null;

  // Array of objects for required fields and their messages
  requiredFields = [
    { field: "name", message: "name is required." },
    // {field: "email", message: "email is required."},
    { field: "phone", message: "phone is required." },
    { field: "nationalityId", message: "nationality is required." },
    // {field: "clientCategoryId", message: "client category is required."},
    { field: "clientStatus", message: "client status is required." },
    {
      field: "firstDate",
      message: "Date of the first interaction is required.",
    },
    // { field: "countryId", message: "country is required." },
    // {field: "governorateId", message: "governorate is required."},
    // {field: "cityId", message: "city is required."},
  ];

  constructor(
    image: string | null,
    name: string,
    email: string,
    address: string,
    phone: string,
    commercialRegisterNumber: string,
    taxRegisterNumber: string,
    firstDate: string,
    officialTendency: string,
    clientCategoryId: number | null,
    clientSatisfactionId: number | null,
    parentId: number | null,
    bio: string,
    resaonDeal: string,
    countryId: number | null,
    cityId: number | null,
    regionId: number | null,
    governorateId: number | null,
    website: string,
    employeeId: number | null,
    type: number,
    clientStatus: number,
    nationalityId: number | null,
    clientCode: number | null,
  ) {
    this.image = image;
    this.name = name;
    this.email = email;
    this.address = address;
    this.phone = phone;
    this.commercialRegisterNumber = commercialRegisterNumber;
    this.taxRegisterNumber = taxRegisterNumber;
    this.firstDate = firstDate;
    this.clientCategoryId = clientCategoryId;
    this.clientSatisfactionId = clientSatisfactionId;
    this.parentId = parentId;
    this.bio = bio;
    this.reasonDeal = resaonDeal;
    this.countryId = countryId;
    this.cityId = cityId;
    this.regionId = regionId;
    this.governorateId = governorateId;
    this.officialTendency = officialTendency;
    this.website = website;
    this.employeeId = employeeId;
    this.type = type;
    this.clientStatus = clientStatus;
    this.nationalityId = nationalityId;
    this.clientCode = clientCode;
  }

  toMap(): Record<string, string | number | boolean | null> {
    const data: Record<string, string | number | boolean | null>= {};
    if (this.image) data["image"] = this.image;
    if (this.name) data["name"] = this.name;
    if (this.email) data["email"] = this.email;
    if (this.website) data["website"] = this.website;
    if (this.address) data["address"] = this.address;
    if (this.phone) data["phone"] = this.phone.toString();
    if (this.commercialRegisterNumber)
      data["commercial_register_number"] = this.commercialRegisterNumber;
    if (this.taxRegisterNumber)
      data["tax_register_number"] = this.taxRegisterNumber;
    if (this.firstDate) data["first_date"] = formatJoinDate(this.firstDate);
    if (this.clientCategoryId)
      data["client_category_id"] = this.clientCategoryId;
    if (this.clientSatisfactionId)
      data["client_satisfaction_id"] = this.clientSatisfactionId;
    if (this.parentId) data["parent_id"] = this.parentId;
    if (this.bio) data["bio"] = this.bio;
    if (this.reasonDeal) data["reason_deal"] = this.reasonDeal;
    if (this.countryId) data["country_id"] = this.countryId;
    if (this.cityId) data["city_id"] = this.cityId;
    if (this.regionId) data["region_id"] = this.regionId;
    if (this.governorateId) data["governorate_id"] = this.governorateId;
    if (this.officialTendency)
      data["official_tendency"] = this.officialTendency;
    if (this.employeeId) data["responsable_id"] = this.employeeId;
    if (this.clientStatus) data["status_registeration"] = this.clientStatus;
    if (this.type) data["type"] = this.type;
    if (this.nationalityId) data["nationality_id"] = this.nationalityId;
    if (this.clientStatus === 2) data["serial_number"] = this.clientCode;

    return data;
  }
}
