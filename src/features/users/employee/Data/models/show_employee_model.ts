import ContractModel from "@/features/users/employee/Data/models/contract_model";
import AttachmentModel from "@/features/users/employee/Data/models/attachment_model";
import TitleModel from "@/base/core/Models/title_model";
import { MemberTypeEnum } from "@/features/users/employee/Core/enums/member_type_enum";

export default class ShowEmployeeModel {
  public id: number;
  public image: string;
  public name: string;
  public email: string;
  public password: string;
  public phone: string;
  public address: string;
  public academicDegree: number | null;
  public country: TitleModel | null;
  public governorate: TitleModel | null;
  public city: TitleModel | null;
  public region: TitleModel | null;
  public place: TitleModel | null;
  public department: TitleModel | null;
  public maritalStatus: number; // 1=>single, 2=>married
  public gender: number; // 1=>male, 2=>female, 3=>hawam
  public crudNumber: string;
  public endDateCrud: string;
  public sponsorship: number; // 1=>inside, 2=>outside
  public fromWork: string;
  public toWork: string;
  public annualVacations: string;
  public workPerWeeks: string;
  public contracts: ContractModel | null;
  public permits: TitleModel[];
  public attachments: AttachmentModel[];
  public hierarchys: TitleModel | null;
  public memberType: MemberTypeEnum = MemberTypeEnum.TEAM_MEMBER;

  constructor(
    id: number,
    image: string,
    name: string,
    email: string,
    password: string,
    phone: string,
    address: string,
    academicDegree: number | null,
    country: TitleModel | null,
    governorate: TitleModel | null,
    city: TitleModel | null,
    region: TitleModel | null,
    place: TitleModel | null,
    department: TitleModel | null,
    maritalStatus: number,
    gender: number,
    crudNumber: string,
    endDateCrud: string,
    sponsorship: number,
    fromWork: string,
    toWork: string,
    annualVacations: string,
    workPerWeeks: string,
    contracts: ContractModel | null,
    permits: TitleModel[],
    attachments: AttachmentModel[],
    hierarchys: TitleModel | null,
    memberType: MemberTypeEnum = MemberTypeEnum.TEAM_MEMBER,
  ) {
    this.id = id;
    this.image = image;
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.address = address;
    this.academicDegree = academicDegree;
    this.country = country;
    this.governorate = governorate;
    this.city = city;
    this.region = region;
    this.place = place;
    this.department = department;
    this.maritalStatus = maritalStatus;
    this.gender = gender;
    this.crudNumber = crudNumber;
    this.endDateCrud = endDateCrud;
    this.sponsorship = sponsorship;
    this.fromWork = fromWork;
    this.toWork = toWork;
    this.annualVacations = annualVacations;
    this.workPerWeeks = workPerWeeks;
    this.contracts = contracts;
    this.permits = permits;
    this.attachments = attachments;
    this.hierarchys = hierarchys;
    this.memberType = memberType;
  }

  static fromMap(data: any): ShowEmployeeModel {
    return new ShowEmployeeModel(
      data.id,
      data.image,
      data.name,
      data.email,
      data.password,
      data.phone,
      data.address,
      data.academic_degree,
      data.country ? TitleModel.fromMap(data.country) : null,
      data.governorate ? TitleModel.fromMap(data.governorate) : null,
      data.city ? TitleModel.fromMap(data.city) : null,
      null,
      null,
      data.department ? TitleModel.fromMap(data.department) : null,
      data.marital_status,
      data.gender,
      data.crud_number,
      data.end_date_crud,
      data.sponsorship,
      data.working_hours.from,
      data.working_hours.to,
      data.working_hours.annual_vacations,
      data.working_hours.work_per_weeks,
      data.contracts ? ContractModel.fromMap(data.contracts) : null,
      data.permits?.map((permit: any) => TitleModel.fromMap(permit)),
      data.attachments?.map((attachment: any) =>
        AttachmentModel.fromMap(attachment),
      ),
      data.herikaly ? TitleModel.fromMap(data.herikaly) : null,
      data.type,
    );
  }
}
