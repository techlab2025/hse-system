export type ProjectLocationHierarchyDetails = {
  project_location_id: number
  heirarchys: {
    heirarchy_id: number
    organizaion_employees: { organizaion_employee_id: number }[]
  }[]
}
