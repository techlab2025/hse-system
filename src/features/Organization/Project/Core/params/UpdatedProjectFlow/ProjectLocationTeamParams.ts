export type ProjectLocationTeam = {
  project_location_id: number
  project_teams: {
    team_id: number
    organizaion_employees: { organizaion_employee_id: number }[]
  }[]
}
