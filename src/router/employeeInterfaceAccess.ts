import type { RouteLocationNormalized } from 'vue-router'

export const EMPLOYEE_HOME = '/organization/employee-interface'

// Keep this list limited to the home cards and the pages used by their workflows.
// In particular, allowing a project feature must not expose all project pages.
const employeeRoutes = new Set([
  'Employee Interface ',
  'Inspection',
  'Add Inspection',
  'Edit Inspection',
  'Overdue Inspection',
  'Inspection Result',
  'Observeration',
  'Add Observeration',
  'Edit Observeration',
  'Show Observeration',
  'Incedant',
  'Add Incedant ',
  'Edit Incedant',
  'Show Incedant',
  'Inductions',
  'Add Induction',
  'Show Induction',
  'Edit Induction',
  'Management Of Change',
  'Add Management Of Change',
  'Edit Management Of Change',
  'Create Employee Permit',
  'Project My Permits',
  'Project Permit Templates',
  'Project Permit Answer',
  'Project Leadership',
  'Project Leadership Visits',
  'Project Leadership Visit Report',
  'Project Risk Assessments',
  'Create Employee Risk Assessment',
  'Create Risk Assessment',
])

export function canAccessEmployeeRoute(
  to: Pick<RouteLocationNormalized, 'name' | 'path' | 'params'>,
  employeeId?: number,
) {
  if (!to.path.startsWith('/organization/')) return false

  if (to.name === 'Organization Employee Tasks') {
    return employeeId != null && String(to.params.id) === String(employeeId)
  }

  return typeof to.name === 'string' && employeeRoutes.has(to.name)
}
