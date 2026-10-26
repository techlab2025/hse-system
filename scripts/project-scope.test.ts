/** Run: npx tsx --tsconfig tsconfig.app.json scripts/project-scope.test.ts */
import assert from 'node:assert/strict'
import ProjectCatalog from '../src/features/Organization/Project/Core/params/indexProjectParams'
import { createPinia, setActivePinia } from 'pinia'
import { useProjectSelectStore } from '../src/stores/ProjectSelect'
import {
  resolveProjectId,
  resolveProjectIds,
  withProjectId,
  withProjectIds,
  validProjectId,
} from '../src/shared/utils/projectScope'
import MOC from '../src/features/Organization/MangementOfChange/Core/params/indexMangementChangeParams'
import Meetings from '../src/features/Organization/Project/Core/params/ProjectMeeting/FetchProjectMeetingsParams'
import Drills from '../src/features/Organization/Project/Core/params/Drill/FetchDrillsParams'
import Risk from '../src/features/Organization/Project/Core/params/RiskAssessment/FetchRiskAssessmentsParams'
import Leadership from '../src/features/Organization/Project/Core/params/Leadership/FetchAllLeadershipVisitsParams'
import PPEMatrix from '../src/features/Organization/Project/Core/params/ppematrix/FetchPPEActivityToolsParams'
import PPEDeliveries from '../src/features/Organization/Project/Core/params/ppematrix/FetchPPEMatrixDeliveriesParams'
import TodayTalk from '../src/features/Organization/Project/Core/params/TodayTalk/GetTodayTalkParams'
import Inductions from '../src/features/Organization/Project/Core/params/induction/indexInductionParams'
import Permits from '../src/features/Organization/Project/Core/params/PermitToWork/fetchPermitsParams'
import MyPermits from '../src/features/Organization/Project/Core/params/PermitToWork/fetchMyPermitToWorkParams'
import PermitStats from '../src/features/Organization/Project/Core/params/PermitToWork/fetchStaticsMyPermitToWorkParams'
import Reports from '../src/features/Organization/TaskReports/Core/params/FetchTaskReportParams'
import Audits from '../src/features/Organization/InternalAudit/Core/params/plan/indexInternalAuditPlanParams'
import MyAudits from '../src/features/Organization/InternalAudit/Core/params/my/indexMyInternalAuditParams'
import Equipment from '../src/features/setting/Equipment/Core/params/indexEquipmentParams'
import Employees from '../src/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import Zones from '../src/features/Organization/ProjectZone/Core/params/indexProjectZoneParams'
import Objectives from '../src/features/Organization/objectives/Core/params/indexObjectivesParams'
import Hazard from '../src/features/Organization/ObservationFactory/Core/params/indexHazardParams'
import Inspection from '../src/features/Organization/Inspection/Core/params/indexInspectionParams'
import Tasks from '../src/features/Organization/Inspection/Core/params/FetchAllTasksParams'
import Results from '../src/features/Organization/Inspection/Core/params/FetchInspectionsResultsParams'
import Capa from '../src/features/Organization/Capa/Core/params/indexCapaParams'
import HomeInspection from '../src/features/Home/core/params/FetchHomeInspectionParams'
import HomeEquipment from '../src/features/Home/core/params/FetchEquipmentStaticsParams'
import HomeHazards from '../src/features/Home/core/params/OverviewHazardChartParams'
import HomeInvestigations from '../src/features/Home/core/params/OverviewInvestigationsChartParams'
import HomeProjects from '../src/features/Home/core/params/FetchProjectStatisticsParams'
import LocationHierarchy from '../src/features/Organization/Project/Core/params/Hierarchy/LocationHierarchy/indexLocationHierarchiesParams'
import HierarchyEmployees from '../src/features/Organization/Project/Core/params/Hierarchy/HierarchyEmployee/indexLocationHierarchyEmployeeParams'

setActivePinia(createPinia())
const store = useProjectSelectStore()
const scalar = [
  new MOC(),
  new Meetings(0),
  new Drills(0),
  new Risk({}),
  new Leadership({}),
  new PPEMatrix(),
  new PPEDeliveries(),
  new TodayTalk(),
  new Inductions(''),
  new Permits({ projectId: 0 }),
  new MyPermits({ projectId: 0 }),
  new PermitStats({ projectId: 0 }),
  new Reports(),
  new Audits(),
  new MyAudits(),
  new Equipment(''),
  new Employees(''),
  new Zones(''),
  new Objectives(''),
  new HomeInspection(),
  new HomeEquipment(),
  new HomeHazards(),
  new HomeInvestigations(),
  new HomeProjects(''),
  new LocationHierarchy(),
  new HierarchyEmployees(),
]
const arrays = [
  new Hazard('', 1, 10, 1, []),
  new Inspection(''),
  new Tasks(''),
  new Results(''),
  new Capa({ word: '', type: [] }),
]
for (const id of [41, 52]) {
  store.setProjectId({ id, title: `Project ${id}` })
  for (const params of scalar) assert.equal(params.toMap().project_id, id, params.constructor.name)
  for (const params of arrays)
    assert.deepEqual(params.toMap().project_ids, [id], params.constructor.name)
  assert.deepEqual(store.SelectedProjectId([]), [id])
  assert.deepEqual(resolveProjectIds([0, -1, NaN]), [id])
}
assert.deepEqual(resolveProjectIds([7, 8, 7, 0, -1]), [7, 8])
assert.equal(resolveProjectId(7), 7)
assert.equal(new Meetings(7).toMap().project_id, 7)
assert.equal(new Risk({ projectId: 7 }).toMap().project_id, 7)
assert.equal(new Permits({ projectId: 7 }).toMap().project_id, 7)
assert.equal(new Inductions('', 1, 10, 1, false, true).toMap().project_id, undefined)
for (const invalid of [true, false, {}, [], null, '', -1, 0, Infinity, 1.2])
  assert.equal(validProjectId(invalid), undefined)
const original = { project_id: 0, page: 3, limit: 25 }
assert.deepEqual(withProjectId(original), { page: 3, limit: 25, project_id: 52 })
assert.equal(original.project_id, 0)
assert.deepEqual(withProjectIds({ word: 'risk' }, []), { word: 'risk', project_ids: [52] })
assert.equal(new ProjectCatalog('').toMap().project_id, undefined)
assert.equal(new ProjectCatalog('', 1, 10, 0, undefined, undefined, 7).toMap().project_id, 7)
store.clearProject()
for (const params of scalar)
  assert.equal('project_id' in params.toMap(), false, params.constructor.name)
for (const params of arrays)
  assert.equal('project_ids' in params.toMap(), false, params.constructor.name)
assert.equal(new Meetings(7).toMap().project_id, 7)
assert.equal(store.SelectedProjectId([]), null)
console.log(
  `PASS: ${scalar.length + arrays.length} project-scoped request types follow the header, preserve explicit projects, and clear correctly for All Projects.`,
)
