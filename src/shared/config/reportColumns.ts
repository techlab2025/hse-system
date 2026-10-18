export interface ReportColumnConfig {
  /** Dot-separated API response path, for example `project.title`. */
  key: string
  /** Translation key or the exact header text to display. */
  label: string
}

const column = (key: string, label: string): ReportColumnConfig => ({ key, label })

/**
 * Report table columns, header names, and display order.
 *
 * Rename a header by changing its second `column()` argument.
 * Reorder, add, or remove entries to change the rendered report table.
 * A configured column is still omitted when the API returns no value for it.
 */
export const reportColumns = {
  investigation: [
    column('serial_name', 'Serial'),
    column('title', 'title'),
    column('observation.title', 'Observation'),
    column('project.title', 'project'),
    column('investigation_date', 'Investigation Date'),
    column('investigation_meeting_date', 'Meeting Date'),
    column('investigation_meeting_time', 'Meeting Time'),
    column('location.title', 'Location'),
    column('zoon.title', 'Zone'),
    // column('status', 'status'),
    // column('has_results', 'Has Results'),
  ],
  incident: [
    column('serial_name', 'Serial'),
    column('title', 'title'),
    column('observer.name', 'observer'),
    column('project.title', 'project'),
    column('date', 'date'),
    column('time', 'time'),
    column('location.title', 'Location'),
    column('zoon.title', 'Zone'),
    column('equipment.title', 'Machine'),
    column('equipment.license_plate_number', 'License Plate Number'),
    column('description', 'description'),
    // column('investigation_status', 'status'),
    // column('media', 'Attachment'),
  ],
  observation: [
    column('serial_name', 'Serial'),
    column('title', 'title'),
    column('observer.name', 'observer'),
    column('project.title', 'project'),
    column('date', 'date'),
    column('time', 'time'),
    column('location.title', 'Location'),
    column('zoon.title', 'Zone'),
    column('equipment.title', 'Machine'),
    column('type', 'observation_type'),
    column('risk_level', 'Risk Level'),
    column('description', 'description'),
    column('action_status', 'Action Status'),
    column('is_work_stopped', 'Work Stopped'),
    column('media', 'Attachment'),
  ],
  corrective: [
    column('id', 'ID'),
    column('description', 'task'),
    column('title', 'title'),
    column('status', 'task_status'),
    column('reason', 'task_reason'),
    column('due_date', 'task_due_date'),
    column('created_at', 'Created At'),
    column('project.title', 'project'),
    column('project.serial_name', 'Project Serial'),
    column('observation.serial_name', 'Observation Serial'),
    column('investigation.serial_name', 'Investigation Serial'),
    column('investigation_task_employees', 'assigned_to'),
  ],
  preventive: [
    column('id', 'ID'),
    column('description', 'task'),
    column('title', 'title'),
    column('status', 'task_status'),
    column('reason', 'task_reason'),
    column('due_date', 'task_due_date'),
    column('created_at', 'Created At'),
    column('project.title', 'project'),
    column('project.serial_name', 'Project Serial'),
    column('observation.serial_name', 'Observation Serial'),
    column('investigation.serial_name', 'Investigation Serial'),
    column('investigation_task_employees', 'assigned_to'),
  ],
  lessonsLearnt: [
    column('lesson_learnt', 'lessons_report_title'),
    column('project.title', 'project'),
    column('project.serial_name', 'Project Serial'),
    column('observation.title', 'Observation'),
    column('observation.serial_name', 'Observation Serial'),
    column('investigation_id', 'Investigation ID'),
    column('serial_name', 'Investigation Serial'),
    column('created_at', 'Created At'),
  ],
} satisfies Record<string, ReportColumnConfig[]>
