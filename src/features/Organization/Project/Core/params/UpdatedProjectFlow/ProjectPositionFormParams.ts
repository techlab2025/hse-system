import type TitleInterface from '@/base/Data/Models/title_interface'
import type IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'

export type PositionHierarchyForm = {
  hierarchy: TitleInterface | null
  employees: TitleInterface[]
  employeeParams: IndexOrganizatoinEmployeeParams
}

export type PositionLocationForm = {
  projectLocation: TitleInterface | null
  heirarchys: PositionHierarchyForm[]
}
