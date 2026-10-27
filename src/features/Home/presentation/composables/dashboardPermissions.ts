import { PermissionsEnum as P } from '@/features/users/Admin/Core/Enum/permission_enum'
export interface DashboardUser {
  isMaster?: number
  permission?: readonly string[]
}
export function dashboardPermissions(user: DashboardUser | null) {
  const can = (...permissions: string[]) =>
    !!user &&
    (user.isMaster === 1 || permissions.some((permission) => user.permission?.includes(permission)))
  const access = {
    reportIncident: can(P.ORG_INCEDANT_ALL, P.ORG_INCEDANT_CREATE),
    createInspection: can(P.ORG_INSPECTION_ALL, P.ORG_INSPECTION_CREATE),
    addObservation: can(P.ORG_OBSERVATION_ALL, P.ORG_OBSERVATION_CREATE),
    projects: can(P.PROJECT_ALL, P.PROJECT_FETCH),
    projectDetails: can(P.PROJECT_ALL, P.PROJECT_DETAILS),
    incidents: can(P.ORG_INCEDANT_ALL, P.ORG_INCEDANT_FETCH),
    observations: can(P.ORG_OBSERVATION_ALL, P.ORG_OBSERVATION_FETCH),
    hazards: can(P.ORG_HAZARD_ALL, P.ORG_HAZARD_FETCH),
    inspections: can(P.ORG_INSPECTION_ALL, P.ORG_INSPECTION_FETCH),
    corrective: can(P.CAPA_ALL, P.CAPA_FETCH),
    certificates: can(P.EMPLOYEE_CERTIFICATE_ALL, P.EMPLOYEE_CERTIFICATE_FETCH),
    equipment: can(P.ORG_EQUIPMENT_ALL, P.ORG_EQUIPMENT_FETCH),
    investigations: can(P.INVESTIGATION_ALL, P.INVESTIGATION_FETCH),
  }
  // Existing aggregate endpoints cannot request individual permission-filtered fields.
  return {
    ...access,
    summary:
      access.incidents &&
      access.observations &&
      access.hazards &&
      access.inspections &&
      access.corrective &&
      access.certificates,
    safety: access.incidents && access.observations && access.hazards,
  }
}
