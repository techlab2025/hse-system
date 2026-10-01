# Project and Inspection Update

This release improves project-level safety workflows, PPE matrix handling, and inspection task management.

## Highlights

- Improved project summaries and navigation.
- Added project-aware PPE matrix requests and delivery history.
- Updated PPE delivery parsing for employees with multiple activities and tools.
- Improved inspection filtering, task tabs, previews, and empty states.
- Improved inspection behavior when opened from a selected project.

## Project updates

- Added total drill information and display drill progress as completed versus total.
- Clarified the project scope-of-work presentation.
- Added a quick link for creating project permits to work.
- Improved project header alignment and project summary formatting.
- Updated project and PPE labels for clearer navigation.
- Improved project card setup actions and progress presentation.

## PPE matrix updates

- Scoped PPE activity/tool requests to the active project using `project_id`.
- Scoped PPE delivery-history requests to the active project.
- Included `project_id` when assigning or removing tools from PPE activities.
- Added support for the new employee-based delivery response containing multiple `ppe_activity` entries.
- Aggregated tools across all employee activities and removed duplicate tool columns.
- Calculated delivered status across every activity assigned to an employee.
- Preserved compatibility with the previous single-activity response format.

## Inspection and audit updates

- Added clear tabs for **All Tasks**, **My Tasks**, and **Submitted Tasks**.
- Kept task totals and displayed results aligned with the selected tab.
- Improved inspection search and data refresh behavior.
- Added controlled project filtering for inspections.
- Reused project selection from the route or globally selected project.
- Reset zone filters when the selected project changes.
- Preselected the project in employee and zone inspection forms when opened from a project.
- Resolved the selected project name after project options finish loading.
- Improved standalone inspection and project audit routing.
- Added contextual empty states for:
  - No inspections created yet.
  - No submitted results yet.
  - No records matching the selected filters.
- Added permission-aware actions for creating inspections or audits.
- Added read-only task-question previews from inspection cards.
- Grouped preview questions by localized template tags while retaining ungrouped questions.
- Improved inspection card labels and details actions for inspection and audit contexts.

## Compatibility

- Existing PPE responses with a single activity remain supported.
- Project-specific and standalone inspection flows continue to use their appropriate routes and labels.

## Included work

- Project summary and project-navigation improvements.
- PPE matrix and PPE delivery response updates.
- Inspection filtering and project-context integration.
- Inspection task navigation, previews, cards, and empty-state improvements.

