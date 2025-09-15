import type Params from "@/base/core/params/params";
import { formatJoinDate } from "@/base/persention/utils/date_format";
import ContactParams from "@/features/dashboard/users/employee/Core/params/contract_params";
import AttachmentParams from "@/features/dashboard/users/employee/Core/params/attatchment_params";
import { MemberTypeEnum } from "@/features/dashboard/users/employee/Core/enums/member_type_enum";

export default class EditEmployeeParams implements Params {
  public id: string;
  public name: string;
  public email: string;
  public password: string;
  public phone: string;
  public address: string;
  public academicDegreeId: number | null;
  public countryId: number | null;
  public governorateId: number | null;
  public cityId: number | null;
  public regionId: number | null;
  public placeId: number | null;
  public departmentId: number | null;
  public maritalStatus: number; // 1=>single, 2=>married
  public gender: number; // 1=>male, 2=>female, 3=>hawam
  public crudNumber: string;
  public endDateCrud: string;
  public sponsorship: number; // 1=>inside, 2=>outside
  public fromWork: string;
  public toWork: string;
  public annualVacations: string;
  public workPerWeeks: string;
  public contracts: ContactParams;
  public permits: number[];
  public attachments: AttachmentParams[];
  public hierarchyId: number | null;
  public memberType: MemberTypeEnum = MemberTypeEnum.TEAM_MEMBER;

  // Array of objects for required fields and their messages
  requiredFields = [
    { field: "name", message: "name is required." },
    { field: "email", message: "email is required." },
    { field: "phone", message: "phone is required." },
    // { field: "password", message: "password is required." },
  ];

  constructor(data: {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    academicDegreeId: number | null;
    countryId: number | null;
    governorateId: number | null;
    cityId: number | null;
    regionId: number | null;
    placeId: number | null;
    departmentId: number | null;
    maritalStatus: number;
    gender: number;
    crudNumber: string;
    endDateCrud: string;
    sponsorship: number;
    fromWork: string;
    toWork: string;
    annualVacations: string;
    workPerWeeks: string;
    contracts: ContactParams;
    permits: number[];
    attachments: AttachmentParams[];
    hierarchyId: number | null;
    memberType: MemberTypeEnum;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.phone = data.phone;
    this.address = data.address;
    this.academicDegreeId = data.academicDegreeId;
    this.countryId = data.countryId;
    this.governorateId = data.governorateId;
    this.cityId = data.cityId;
    this.regionId = data.regionId;
    this.placeId = data.placeId;
    this.departmentId = data.departmentId;
    this.maritalStatus = data.maritalStatus;
    this.gender = data.gender;
    this.crudNumber = data.crudNumber;
    this.endDateCrud = data.endDateCrud;
    this.sponsorship = data.sponsorship;
    this.fromWork = data.fromWork;
    this.toWork = data.toWork;
    this.annualVacations = data.annualVacations;
    this.workPerWeeks = data.workPerWeeks;
    this.contracts = data.contracts;
    this.permits = data.permits;
    this.memberType = data.memberType;
    this.attachments = data.attachments;
    this.hierarchyId = data.hierarchyId;
  }

  toMap(): { [key: string]: any } {
    // console.log(this.id);
    return {
      employee_id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,
      address: this.address,
      academic_degree_id: this.academicDegreeId,
      country_id: this.countryId,
      governorate_id: this.governorateId,
      city_id: this.cityId,
      region_id: this.regionId,
      place_id: this.placeId,
      department_id: this.departmentId,
      marital_status: this.maritalStatus,
      gender: this.gender,
      crud_number: this.crudNumber,
      end_date_crud: formatJoinDate(this.endDateCrud),
      sponsorship: this.sponsorship,
      from_work: this.fromWork,
      to_work: this.toWork,
      annual_vacations: this.annualVacations,
      work_per_weeks: this.workPerWeeks,
      contracts: this.contracts,
      permits: this.permits,
      attachments: this.attachments.map((attachment) => attachment.toMap()),
      herikaly_id: this.hierarchyId,
      type: this.memberType,
    };
  }
}
