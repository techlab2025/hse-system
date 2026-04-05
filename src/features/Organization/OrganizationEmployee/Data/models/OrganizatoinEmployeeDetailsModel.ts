import TitleInterface from '@/base/Data/Models/title_interface'
import HierarchyEmployeeModel from '@/features/Organization/Project/Data/models/LocationHierarchyEmployeeModel'
import RoleDetailsModel from '@/features/Organization/Role/Data/models/RoleDetailsModel'
import acc from '@/assets/images/acc.png'
import type CertificateModel from '@/features/setting/Certificate/Data/models/CertificateModel'
import ProjectDetailsModel from '@/features/Organization/Project/Data/models/ProjectDetailsModel'
import ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'
import { EmployeeStatusEnum } from '../../Core/Enum/EmployeeStatus'
import type TasksModel from '@/features/Organization/Investigating/Data/models/Tasks/TasksModel'
import type InspectionModel from '@/features/Organization/Inspection/Data/models/InspectionModel'

export default class OrganizatoinEmployeeDetailsModel {
  // =====================
  // Properties
  // =====================
  public id: number
  public name: string
  public phone: string
  public email: string
  public is_master: number
  public image: string | null
  public hierarchy: TitleInterface[]
  public roles: RoleDetailsModel[]
  public organization_employee_id: number
  public organization_id: number
  public serial_number: string
  public certificates: CertificateModel[]
  public employee_certificates: CertificateModel[]
  public showHierarchy: TitleInterface[]
  public projects: ProjectModel[]
  public emplyeeStatus: EmployeeStatusEnum
  public serialName: string
  public tasks: InspectionModel[]
  public projectLocationHierarchyEmployeeId: number
  public projectLocationTeamEmployeeId: number

  // =====================
  // Constructor
  // =====================
  constructor(
    id: number,
    name: string,
    phone: string,
    email: string,
    is_master: number,
    image: string | null,
    hierarchy: TitleInterface[],
    roles: RoleDetailsModel[],
    organization_employee_id: number,
    organization_id: number,
    serialName: string,
    serial_number: string,
    certificates: CertificateModel[],
    employee_certificates: CertificateModel[],
    showHierarchy: TitleInterface[],
    projects: ProjectModel[],
    emplyeeStatus: EmployeeStatusEnum,
    tasks: InspectionModel[],
    projectLocationHierarchyEmployeeId: number,
    projectLocationTeamEmployeeId: number,
  ) {
    this.id = id
    this.name = name
    this.phone = phone
    this.email = email
    this.is_master = is_master
    this.image = image
    this.hierarchy = hierarchy
    this.roles = roles
    this.organization_employee_id = organization_employee_id
    this.organization_id = organization_id
    this.serialName = serialName
    this.serial_number = serial_number
    this.certificates = certificates
    this.employee_certificates = employee_certificates
    this.showHierarchy = showHierarchy
    this.projects = projects
    this.emplyeeStatus = emplyeeStatus
    this.tasks = tasks
    this.projectLocationHierarchyEmployeeId = projectLocationHierarchyEmployeeId
    this.projectLocationTeamEmployeeId = projectLocationTeamEmployeeId
  }

  // =====================
  // Mapper (API → Model)
  // =====================
  static fromMap(data: any): OrganizatoinEmployeeDetailsModel {
    return new OrganizatoinEmployeeDetailsModel(
      data.id,
      data.name,
      data.phone,
      data.email,
      data.is_master,
      data.image,
      data.hierarchy?.map((item: any) => this.getTitle(item)) || [],
      // data.projects?.map((item: any) => ProjectDetailsModel.fromMap(item))  || [],
      data.roles?.map((roleData: any) => RoleDetailsModel.fromMap(roleData)) || [],
      data.organization_employee_id,
      data.organization_id,
      data.serial_name,
      data.serial_number,
      data.certificates,
      data.employee_certificates,
      data.hierarchy,
      data?.projects?.map((item: any) => ProjectModel.fromMap(item)),
      data?.employee_type,
      data.tasks,
      data.project_location_hierarchy_employee_id,
      data.project_location_team_employee_id,
      // data.employee_performance,
    )
  }

  // =====================
  // Helpers
  // =====================
  static getTitle(data: any) {
    const savedLocale = localStorage.getItem('lang')

    const title =
      data.titles?.find((t: any) => t.locale === savedLocale)?.title ?? // try saved locale
      data.titles?.find((t: any) => t.locale === 'en')?.title ?? // fallback to English
      data.titles?.[0]?.title ?? // fallback to first available
      data.title ?? // fallback to flat title field
      '' // last resort empty string

    return new TitleInterface({ id: data.id, title })
  }

  // =====================
  // Example Data
  // =====================
  static example: OrganizatoinEmployeeDetailsModel = new OrganizatoinEmployeeDetailsModel(
    1,
    'Mohab',
    '01007599132',
    'Mohab@gmail.com',
    1,
    acc,
    [
      {
        id: 1,
        title: 'Manger',
      },
    ],
    [],
    1,
    1,
    'EMP',
    '0001',
    [],
    [],
    [],
    [],
    1,
    [],
    1,
    1,
  )
}
