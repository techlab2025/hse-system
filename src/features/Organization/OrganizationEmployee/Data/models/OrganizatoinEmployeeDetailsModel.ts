import TitleInterface from '@/base/Data/Models/title_interface'
import RoleDetailsModel from '@/features/Organization/Role/Data/models/RoleDetailsModel'
import acc from '@/assets/images/acc.png'
import type CertificateModel from '@/features/setting/Certificate/Data/models/CertificateModel'
import ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'
import { EmployeeStatusEnum } from '../../Core/Enum/EmployeeStatus'
import type InspectionModel from '@/features/Organization/Inspection/Data/models/InspectionModel'

export default class OrganizatoinEmployeeDetailsModel {
  // =====================
  // Properties
  // =====================
  public id: number
  public name: string
  public phone: string
  public countryCode: string
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
  public canAccessDashboard: boolean
  public is_leader: number
  public allPermissions: boolean

  // =====================
  // Constructor
  // =====================
  constructor(
    id: number,
    name: string,
    phone: string,
    countryCode: string,
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
    canAccessDashboard: boolean,
    is_leader: number,
    allPermissions: boolean,
  ) {
    this.id = id
    this.name = name
    this.phone = phone
    this.countryCode = countryCode
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
    this.canAccessDashboard = canAccessDashboard
    this.is_leader = is_leader
    this.allPermissions = allPermissions
  }

  // =====================
  // Mapper (API → Model)
  // =====================
  static fromMap(data: unknown): OrganizatoinEmployeeDetailsModel {
    const item = (data ?? {}) as Record<string, unknown>
    const hierarchy = Array.isArray(item.hierarchy) ? item.hierarchy : []
    const roles = Array.isArray(item.roles) ? item.roles : []
    const projects = Array.isArray(item.projects) ? item.projects : []
    return new OrganizatoinEmployeeDetailsModel(
      Number(item.id ?? item.organization_employee_id ?? 0),
      String(item.name ?? ''),
      String(item.phone ?? ''),
      String(item.country_code ?? ''),
      String(item.email ?? ''),
      Number(item.is_master ?? 0),
      typeof item.image === 'string' && item.image ? item.image : null,
      hierarchy.map((hierarchyItem) => this.getTitle(hierarchyItem)),
      roles.map((roleData) => RoleDetailsModel.fromMap(roleData)),
      Number(item.organization_employee_id ?? item.id ?? 0),
      Number(item.organization_id ?? 0),
      String(item.serial_name ?? ''),
      String(item.serial_number ?? ''),
      (Array.isArray(item.certificates) ? item.certificates : []) as CertificateModel[],
      (Array.isArray(item.employee_certificates)
        ? item.employee_certificates
        : []) as CertificateModel[],
      hierarchy.map((hierarchyItem) => this.getTitle(hierarchyItem)),
      projects.map((project) => ProjectModel.fromMap(project)),
      Number(item.employee_type ?? EmployeeStatusEnum.Employee) as EmployeeStatusEnum,
      (Array.isArray(item.tasks) ? item.tasks : []) as InspectionModel[],
      Number(item.project_location_hierarchy_employee_id ?? 0),
      Number(item.project_location_team_employee_id ?? 0),
      Boolean(item.can_access_dashboard),
      Number(item.is_leader ?? 0),
      Boolean(item.allow_all_permissions),
      // data.employee_performance,
    )
  }

  // =====================
  // Helpers
  // =====================
  static getTitle(data: unknown) {
    const item = (data ?? {}) as Record<string, unknown>
    const titles = Array.isArray(item.titles) ? (item.titles as Array<Record<string, unknown>>) : []
    const savedLocale = localStorage.getItem('lang')

    const title =
      titles.find((translation) => translation.locale === savedLocale)?.title ?? // try saved locale
      titles.find((translation) => translation.locale === 'en')?.title ?? // fallback to English
      titles[0]?.title ?? // fallback to first available
      item.title ?? // fallback to flat title field
      item.name ?? // fallback to flat name field
      '' // last resort empty string

    return new TitleInterface({ id: Number(item.id ?? 0), title: String(title) })
  }

  // =====================
  // Example Data
  // =====================
  static example: OrganizatoinEmployeeDetailsModel = new OrganizatoinEmployeeDetailsModel(
    1,
    'Mohab',
    '01007599132',
    '+20',
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
    true,
    1,
    true,
  )
}
