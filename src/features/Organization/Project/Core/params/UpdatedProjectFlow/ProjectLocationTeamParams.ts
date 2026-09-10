export type ProjectLocationTeam = {
  project_location_id: number
  project_teams: {
    team_id: number
    organization_employees: { organization_employee_id: number }[]
  }[]
}
