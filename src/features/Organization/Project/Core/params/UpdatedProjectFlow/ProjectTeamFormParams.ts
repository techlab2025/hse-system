import type TitleInterface from '@/base/Data/Models/title_interface'
import type IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'

export type TeamForm = {
  team: TitleInterface | null
  employees: TitleInterface[]
  employeeParams: IndexOrganizatoinEmployeeParams
}

export type TeamLocationForm = {
  projectLocation: TitleInterface | null
  projectTeams: TeamForm[]
}
