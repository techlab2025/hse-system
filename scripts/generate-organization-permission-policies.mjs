import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

// Existing enum families, not new backend identifiers. Custom operations without a
// matching registered permission stay explicitly unsupported instead of borrowing CRUD.
const families = {
 AttachmentMatrix:'ATTACHMENT_MATRIX', AuditActivity:'ORG_AUDIT_ACTIVITIES', AuditStandard:'ORG_AUDIT_STANDARDS', Capa:'CAPA', CheckList:null,
 DocumentCategory:'ORG_DOCUMENT_CATEGORY', DocumentRefrence:'ORG_DOCUMENTATION_REFERENCE', DrillType:'ORG_DRILL_TYPE', EmployeesCertificates:'EMPLOYEE_CERTIFICATE', Herikaly:'HERIKALY', Injury:'INJURY', Inspection:'ORG_INSPECTION', InternalAudit:'INTERNAL_AUDIT', Investigating:'INVESTIGATION', MangementChangeTopicType:'ORG_MANAGEMENT_CHANGE_TOPIC_TYPE', MangementOfChange:'MOC', MeetingType:'ORG_MEETING_TYPE', ObservationFactory:null, OrganizationEmployee:'ORG_EMPLOYEE', OrganizationLocation:'ORG_LOCATION', PPEActivity:'ORG_PPE_ACTIVITY', PPETool:'ORG_PPE_TOOLS', PTWType:'ORG_PTW_TYPE', Partner:'PARTNER', Project:'PROJECT', ProjectPrgoress:'PROJECT_PROGRESS', ProjectZone:'PROJECT_ZONE', Role:'ORG_ROLE', Scope:'SCOPE', SerialNumber:'CODING_SYSTEM', Shifts:'ORG_SHIFT', TaskReports:null, Ticket:'TICKET', TicketType:null, TraningTopic:'ORG_TRANING_TOPIC', VisitActivity:'ORG_VISIT_ACTIVITIES', VisitCategory:'ORG_VISIT_CATEGORY', VisitTheme:'ORG_VISIT_THEME', WhereHouse:'WHIERE_HOUSE', WhereHouseType:'WHIERE_HOUSE_TYPE', notificationPlan:'NOTIFICATION_PLAN', objectives:'objectives', ppeItem:'ORG_PPE_ITEM',
 Equipment:'ORG_EQUIPMENT', EquipmentType:'ORG_EQUIPMENT_TYPE', AccidentsType:'ORG_ACCIDENTS_TYPE', Factory:'ORG_FACTORY', FactoryItem:'ORG_FACTORY_ITEM', Hazard:'ORG_HAZARD', HazardType:'ORG_HAZARD_TYPE', Methods:'ORG_METHOD', ObserverationType:'ORG_OBSERVATION_TYPE', Certificate:'ORGANIZATION_CERTIFICATE', OrganizationDocument:'ORGANIZATION_DOCUMENTS', Team:'ORG_TEAM', Teams:'ORG_TEAM', HealthConditions:'ORG_HEALTH_CONDITION', contractor:'ORG_CONTRACTOR', Contractor:'ORG_CONTRACTOR', RootCauses:'ROOT_CAUSES', Location:'LOCATION_ORG',
}
const suffixes = {fetch:'FETCH',details:'DETAILS',create:'CREATE',update:'UPDATE',delete:'DELETE'}
const aliases = {CAPA_CREATE:'CAPA_CAREATE', MOC_CREATE:'MOC_CRAETE', LEADERSHIP_CREATE:'LEADERSHIP_CRAETE'}
const inventory=JSON.parse(fs.readFileSync('docs/permission-audit/inventory.json','utf8'))
const enumNames=new Set(inventory.permissions.map(item=>item.name))
const requirement=(family, operation)=>{
 const direct=aliases[family+'_'+suffixes[operation]]??family+'_'+suffixes[operation]
 const names=[family+'_ALL',direct].filter(name=>enumNames.has(name))
 return family && enumNames.has(direct)?{anyOf:names}: {anyOf:[],unsupported:`No confirmed ${operation} permission for ${family??'this feature'}`}
}
const exact=(...names)=>({anyOf:names})
const unsupported=(description)=>({anyOf:[],unsupported:description})
const apiOverrides={
 IndexInspection:exact('ORG_INSPECTION_ALL','ORG_INSPECTION_FETCH','MY_TASKS_ALL'), FetchInspectionsResults:exact('ORG_INSPECTION_ALL','INSPECTION_RESULTS_FETCH'),
 FetchMyProjects:{authenticated:true}, FetchMyZones:{authenticated:true}, ShowPermission:exact('PERMISSION_DETAILS','PERMISSION_UPDATE'), EditPermission:exact('PERMISSION_UPDATE'), IndexPermission:exact('PERMISSION_FETCH'), DeletePermission:exact('PERMISSION_DELETE'),
 FetchEmployeeTasks:exact('MY_TASKS_ALL','TASK_FETCH'), fetchTaskhistory:exact('MY_TASKS_ALL','TASK_DETAILS'), changeTaskStatus:unsupported('Task status needs a backend operation permission'),
 CreateObjectiveProgress:requirement('objectives','update'), EditObjectiveProgress:requirement('objectives','update'), IndexObjectiveProgress:requirement('objectives','details'), ShowObjectiveProgress:requirement('objectives','details'),
 CreateCapaResult:exact('CAPA_ALL','CAPA_SET_RESULT'), UpdateTasks:requirement('INVESTIGATION_TASK','update'),
 CreateInvestegation:exact('INVESTIGATION_ALL','FULL_INVESTIGATION_CREATE'), CreateInvestigatingResult:exact('INVESTIGATION_ALL','FULL_INVESTIGATION_MEETING_RESULT_CREATE'), CreateInvestigationTaskResult:requirement('INVESTIGATION_TASK_RESULT','create'), AddTasks:requirement('INVESTIGATION_TASK','create'), IndexTasks:requirement('INVESTIGATION_TASK','fetch'), AddMeetings:requirement('INVESTIGATION_MEETING','create'), IndexMeeting:requirement('INVESTIGATION_MEETING','fetch'),
 IndexInvestigatingResult:requirement('INVESTIGATION','fetch'), ShowInvestigatingResult:requirement('INVESTIGATION','details'),
 CreatePermitToWork:requirement('PTW','create'), FetchMyPermits:requirement('PTW','fetch'), FetchPermits:requirement('PTW','fetch'), FetchPermitsAudits:requirement('PTW','fetch'), FetchStaticsMyPermits:requirement('PTW','fetch'), CreatePermitToWorkResult:unsupported('Permit results need a distinct backend operation permission'),
 CreateRiskAssessment:requirement('RISK_ASSESSMENT','create'), FetchRiskAssessments:requirement('RISK_ASSESSMENT','fetch'), FetchRiskAssessmentDetails:requirement('RISK_ASSESSMENT','details'),
 CreateLeadershipPlan:requirement('LEADERSHIP','create'), CreateLeadershipVisitReport:requirement('LEADERSHIP','create'), FetchAllLeadershipVisits:requirement('LEADERSHIP','fetch'), FetchLeadershipVisitDetails:requirement('LEADERSHIP','details'),
 create_induction:requirement('inductions','create'), update_induction:requirement('inductions','update'), delete_induction:requirement('inductions','delete'), fetch_inductions:requirement('inductions','fetch'), fetch_induction_details:requirement('inductions','details'),
 CreatePPEActivityTool:requirement('ppe_matrix_logs','update'), FetchPPEActivityTools:requirement('ppe_matrix_logs','fetch'), CreatePPEMatrixDelivery:requirement('ppe_matrix_logs','create'), FetchPPEMatrixDeliveries:requirement('ppe_matrix_logs','fetch'),
 CreateBasicProject:requirement('PROJECT','create'), UpdateBasicProject:requirement('PROJECT','update'), ShowProjectSummaryDetails:requirement('PROJECT','details'),
 CreateLocationHierarchy:requirement('PROJECT_LOCATION_HIERARCHY','create'), IndexLocationHierarchy:requirement('PROJECT_LOCATION_HIERARCHY','fetch'), CreateHierarchyEmployee:requirement('PROJECT_LOCATION_HIERARCHY_EMPLOYEE','create'), IndexHierarchyEmployee:requirement('PROJECT_LOCATION_HIERARCHY_EMPLOYEE','fetch'),
 CreateProjectLocationPositionEmployees:requirement('PROJECT_LOCATION_HIERARCHY_EMPLOYEE','create'), UpdateProjectLocationPositionEmployees:requirement('PROJECT_LOCATION_HIERARCHY_EMPLOYEE','update'), DeleteProjectLocationHeirarchyEmployee:requirement('PROJECT_LOCATION_HIERARCHY_EMPLOYEE','delete'),
 CreateProjectZoon:requirement('PROJECT_ZOON','create'), CreateProjectZoonEquipment:requirement('PROJECT_ZOON_EQUIPMENT','create'), CreateProjectLocationTeamEmployee:requirement('PROJECT_LOCATION_TEAM_EMPLOYEE','create'), DeleteProjectLocationTeamEmployee:requirement('PROJECT_LOCATION_TEAM_EMPLOYEE','delete'),
 FetchProjectLocationEmployee:requirement('PROJECT_LOCATION_EMPLOYEE','fetch'), FetchProjectLocationsEmployee:requirement('PROJECT_LOCATION_EMPLOYEE','fetch'), IndexProjectLocationZones:requirement('PROJECT_ZOON','fetch'), FetchProjectZones:requirement('PROJECT_ZONE','fetch'),
 CreateInternalAuditPlan:requirement('INTERNAL_AUDIT','create'), EditInternalAuditPlan:requirement('INTERNAL_AUDIT','update'), IndexInternalAuditPlan:requirement('INTERNAL_AUDIT','fetch'), ShowInternalAuditPlan:requirement('INTERNAL_AUDIT','details'), DeleteInternalAuditPlan:requirement('INTERNAL_AUDIT','delete'), IndexMyInternalAudit:requirement('MY_INTERNAL_AUDIT','fetch'), FetchMyInternalAuditNcrs:requirement('MY_INTERNAL_AUDIT','details'), CreateInternalAuditNcrs:requirement('MY_INTERNAL_AUDIT','create'),
 EditInternalAuditNcrs:unsupported('NCR correction needs its own backend operation permission'), FetchInternalAuditNcrDetails:requirement('MY_INTERNAL_AUDIT','details'), FetchInternalAuditNcrs:requirement('MY_INTERNAL_AUDIT','fetch'), FetchInternalAuditAttendance:requirement('INTERNAL_AUDIT','details'), FetchInternalAuditPlanDetailsForReport:requirement('INTERNAL_AUDIT','details'), FetchInternalAuditReport:requirement('INTERNAL_AUDIT','details'),
 AddInternalAuditParticipants:unsupported('Audit participant assignment permission is absent'), SaveInternalAuditAttendance:unsupported('Audit attendance permission is absent'), CreateInternalAuditReport:unsupported('Audit report submission permission is absent'),
 FetchCorrectiveTasks:requirement('INVESTIGATION_TASK','fetch'), FetchPreventiveTasks:requirement('INVESTIGATION_TASK','fetch'), FetchLessonsLearnt:requirement('INVESTIGATION','fetch'),
 createCodingSystem:requirement('CODING_SYSTEM','create'), fetchCodingSystem:requirement('CODING_SYSTEM','fetch'), IndexProjectProgress:exact('PROJECT_PROGRESS_ALL'),
 ProjectCustomLocation:unsupported('Project resource request must be scoped to its resource-specific permission'),
 CloseInvestigating:unsupported('Investigation close permission is absent'), ToggleObservationActionStatus:unsupported('Observation action status permission is absent'), ToggleObservationWorkStopped:unsupported('Observation stop-work permission is absent'),
 GetTodayTalk:unsupported('Today talk permission family is absent'), CreateTodayTalk:unsupported('Today talk permission family is absent'), CreateTodayTalkAnswer:unsupported('Today talk permission family is absent'),
 FetchDrills:unsupported('Drill operations differ from drill-type configuration and lack permission identifiers'), FetchDrillPlans:unsupported('Drill plan permission is absent'), FetchDrillActions:unsupported('Drill action permission is absent'), CreateDrill:unsupported('Drill create permission is absent'), CreateDrillPlanning:unsupported('Drill plan create permission is absent'), CreateDrillAction:unsupported('Drill action create permission is absent'), DeleteDrillAction:unsupported('Drill action delete permission is absent'), DeleteDrillPlan:unsupported('Drill plan delete permission is absent'),
 CreateProjectMeeting:unsupported('Project meeting permission family is absent'), CreateProjectMeetingResult:unsupported('Project meeting result permission is absent'), FetchProjectMeetings:unsupported('Project meeting permission family is absent'), FetchMeetingDetails:unsupported('Project meeting permission family is absent'),
}
const operationFor=(getter)=> /clone|excel|import|upload|close|replace|toggle|disable|^dis[A-Z]|active|status|verification|holiday|assign|addCertificate|deleteCertificate/i.test(getter)?null : /Details|_details|^Show/.test(getter)?'details':/^Delete|^delete_/.test(getter)?'delete':/^Edit|^Update|^update_/.test(getter)?'update':/^Create|^create_|^Add/.test(getter)?'create':/^Index|^Fetch|^fetch_|^Get/.test(getter)?'fetch':null
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])
const apiAssignments={...apiOverrides}
for(const file of walk('src/features').filter(f=>f.includes('/Data/api')&&f.endsWith('.ts'))){
 const feature=file.split('/')[3]
 const family=families[feature]
 for(const match of fs.readFileSync(file,'utf8').matchAll(/ApiNames\.instance\.(\w+)/g)){
 const getter=match[1]
 if(apiAssignments[getter])continue
 if(family===undefined)continue
 const op=operationFor(getter)
 apiAssignments[getter]=op?requirement(family,op):unsupported(`No independently confirmed backend permission for ${getter}`)
 }
}
const sf=ts.createSourceFile('apiNames.ts',fs.readFileSync('src/base/core/networkStructure/apiNames.ts','utf8'),ts.ScriptTarget.Latest,true)
const endpoints={}
const getterEndpoints={}
function visit(node){
 if(ts.isGetAccessorDeclaration(node)){
 const getter=node.name.getText(sf);const literals=[]
 function strings(child){if(ts.isStringLiteral(child))literals.push(child.text);ts.forEachChild(child,strings)}
 if(node.body)strings(node.body)
 const endpoint=literals.at(-1)
 if(endpoint&&!endpoint.includes('/')){
 getterEndpoints[getter]=endpoint
 const policy=apiAssignments[getter]
 if(policy){
 if(endpoints[endpoint]&&JSON.stringify(endpoints[endpoint])!==JSON.stringify(policy))endpoints[endpoint]=unsupported(`Conflicting policies for endpoint ${endpoint}`)
 else endpoints[endpoint]=policy
 }
 }
 }
 ts.forEachChild(node,visit)
}
visit(sf)
const routeFamily={
 'Capa.ts':'CAPA','CheckList.ts':null,'EmployeeCertificate.ts':'EMPLOYEE_CERTIFICATE','Incedant.ts':'ORG_INCEDANT','Injury.ts':'INJURY','MangementChangeTopicType.ts':'ORG_MANAGEMENT_CHANGE_TOPIC_TYPE','MangementOfChange.ts':'MOC','OrganizationCertificate.ts':'ORGANIZATION_CERTIFICATE','OrganizationDocuments.ts':'ORGANIZATION_DOCUMENTS','SerialNumber.ts':'CODING_SYSTEM','allInvestigationTasks.ts':'INVESTIGATION_TASK','allInvestigationmeetings.ts':'INVESTIGATION_MEETING','attachmentMatrix.ts':'ATTACHMENT_MATRIX','audits.ts':'ORG_INSPECTION','document-refrence.ts':'ORG_DOCUMENTATION_REFERENCE','hazard.ts':'ORG_HAZARD','herikaly.ts':'HERIKALY','induction.ts':'inductions','inspection.ts':'ORG_INSPECTION','investigating.ts':'INVESTIGATION','investigationmeeting.ts':'INVESTIGATION_MEETING','notificationPlan.ts':'NOTIFICATION_PLAN','objectives.ts':'objectives','observation.ts':'ORG_OBSERVATION','organizationEmployee.ts':'ORG_EMPLOYEE','organizationLocation.ts':'ORG_LOCATION','partner.ts':'PARTNER','project.ts':'PROJECT','projectProgress.ts':'PROJECT_PROGRESS','projectZone.ts':'PROJECT_ZONE','shifts.ts':'ORG_SHIFT','whereHouse.ts':'WHIERE_HOUSE','whereHouseType.ts':'WHIERE_HOUSE_TYPE',
 'accidents.ts':'ORG_ACCIDENTS_TYPE','audit_activity.ts':'ORG_AUDIT_ACTIVITIES','audit_standard.ts':'ORG_AUDIT_STANDARDS','certificate.ts':'ORGANIZATION_CERTIFICATE','contractor.ts':'ORG_CONTRACTOR','document_category.ts':'ORG_DOCUMENT_CATEGORY','drillType.ts':'ORG_DRILL_TYPE','equipment.ts':'ORG_EQUIPMENT','factory.ts':'ORG_FACTORY','hazardtypes.ts':'ORG_HAZARD_TYPE','healthconditions.ts':'ORG_HEALTH_CONDITION','incidentCategories.ts':null,'meeting_type.ts':'ORG_MEETING_TYPE','methods.ts':'ORG_METHOD','observeration.ts':'ORG_OBSERVATION_TYPE','ppeItem.ts':'ORG_PPE_ITEM','ppe_activity.ts':'ORG_PPE_ACTIVITY','ppe_tool.ts':'ORG_PPE_TOOLS','ptw_type.ts':'ORG_PTW_TYPE','role.ts':'ORG_ROLE','rootCauses.ts':'ROOT_CAUSES','scope.ts':'SCOPE','subHazard.ts':'ORG_HAZARD','team.ts':'ORG_TEAM','template.ts':'ORG_TEMPLATE','templateItem.ts':'TEMPLATE_ITEM','ticket.ts':'TICKET','ticketType.ts':null,'traning_topic.ts':'ORG_TRANING_TOPIC','visitActivity.ts':'ORG_VISIT_ACTIVITIES','visitCategory.ts':'ORG_VISIT_CATEGORY','visitTheme.ts':'ORG_VISIT_THEME',
}
const routeOverrides={
 'Organization':{authenticated:true},'Organization App':{authenticated:true},'Employee Interface':{authenticated:true},'Organization Setting':{authenticated:true},'Access Denied Organization':{authenticated:true},
 'Permission Organization':exact('PERMISSION_UPDATE'), 'Project Progress':exact('PROJECT_PROGRESS_ALL'), 'Serial Number':requirement('CODING_SYSTEM','fetch'), 'NCR Details':requirement('MY_INTERNAL_AUDIT','details'), 'Internal Audit':requirement('INTERNAL_AUDIT','fetch'), 'Internal Audit Register':requirement('INTERNAL_AUDIT','fetch'), 'My Internal Audit':requirement('MY_INTERNAL_AUDIT','fetch'), 'My Internal Audit NCRs':requirement('MY_INTERNAL_AUDIT','details'),
 'Project Leadership':requirement('LEADERSHIP','fetch'),'Project Leadership Visits':requirement('LEADERSHIP','fetch'),'Project Leadership Visit Report':requirement('LEADERSHIP','create'),
 'Company PPE Matrix':requirement('ppe_matrix_logs','fetch'),'Company PPE Deliveries':requirement('ppe_matrix_logs','fetch'),'Company PPE Delivery':requirement('ppe_matrix_logs','create'),
 'Project Risk Assessments':requirement('RISK_ASSESSMENT','fetch'),'Create Risk Assessment':requirement('RISK_ASSESSMENT','create'),'Create Employee Risk Assessment':requirement('RISK_ASSESSMENT','create'),
 'management-of-change':requirement('MOC','fetch'),'Project Meetings':unsupported('Project meetings need backend permission identifiers'),'Create Today Talk':unsupported('Today talks need backend permission identifiers'),'Today Talks':unsupported('Today talks need backend permission identifiers'),'Add Today Talk':unsupported('Today talks need backend permission identifiers'),
 'Employee Details':requirement('PROJECT_LOCATION_EMPLOYEE','fetch'),'Project Hierarchy':requirement('PROJECT_LOCATION_HIERARCHY','create'),'Project Employee':requirement('PROJECT_LOCATION_HIERARCHY_EMPLOYEE','create'),'Project Equipment':requirement('PROJECT_ZOON_EQUIPMENT','create'),
 'Create Employee Permit':requirement('PTW','create'),'Project Permit':requirement('PTW','create'),'Project My Permits':requirement('PTW','fetch'),'Project Permits':requirement('PTW','fetch'),'Project Template Result':requirement('PTW','fetch'),'Project Permit Templates':unsupported('Permit template answer operation needs its own backend identifier'),'Project Permit Answer':unsupported('Permit answer submission needs its own backend identifier'),
 'organization-objectives-details':requirement('objectives','details'),'organization-objectives-update-progress':requirement('objectives','update'),'organization-objectives-edit-progress':requirement('objectives','update'),
 'Corrective Report':requirement('INVESTIGATION_TASK','fetch'),'Preventive Report':requirement('INVESTIGATION_TASK','fetch'),'Lessons Learnt Report':requirement('INVESTIGATION','fetch'),
 'Organization Employee Tasks':exact('MY_TASKS_ALL','TASK_FETCH'),'Show Organization Employee':requirement('ORG_EMPLOYEE','details'),
 'Add Investigating':exact('INVESTIGATION_ALL','FULL_INVESTIGATION_CREATE'),'Investigating Result':exact('INVESTIGATION_ALL','FULL_INVESTIGATION_MEETING_RESULT_CREATE'),'Investigating Result Answer':requirement('INVESTIGATION','details'),
 'Hierarchy Matrix':requirement('HERIKALY','fetch'), 'Project Summary':requirement('PROJECT','details'),'Project Summary Data':requirement('PROJECT','details'),
 'System Identity':unsupported('Identity management has no independently confirmed backend permission'),
}
const routeAssignments={...routeOverrides}
for(const route of inventory.routes.filter(route=>route.file.includes('/organization/')||route.file.includes('/shared/'))){
 const name=route.name?.trim();if(!name||routeAssignments[name])continue
 let family=routeFamily[path.basename(route.file)]
 if(family===undefined){routeAssignments[name]=unsupported(`No reviewed feature mapping for ${name}`);continue}
 if(path.basename(route.file)==='equipment.ts'&&/Equipment Type/.test(name))family='ORG_EQUIPMENT_TYPE'
 if(path.basename(route.file)==='factory.ts'&&/Item/.test(name))family='ORG_FACTORY_ITEM'
 const op=/upload|import|excel/i.test(name)?null:/^Add |^Create /.test(name)?'create':/^Edit /.test(name)?'update':/^Show |Details|History/.test(name)?'details':'fetch'
 routeAssignments[name]=op?requirement(family,op):unsupported(`No independent import permission for ${name}`)
}
for(const place of ['Country','State','City','Area','Location'])for(const [prefix,operation]of [['','fetch'],['Add ','create'],['Edit ','update']])routeAssignments[prefix+place]=requirement('LOCATION_ORG',operation)
const expression=policy=>'{ '+Object.entries(policy).map(([key,value])=>key+': '+(key==='anyOf'?'['+value.map(name=>'P.'+name).join(', ')+']':JSON.stringify(value))).join(', ')+' }'
const table=(name,entries)=>`export const ${name}: Readonly<Record<string, OrganizationPolicy>> = {\n${Object.entries(entries).sort(([a],[b])=>a.localeCompare(b)).map(([key,value])=>'  '+JSON.stringify(key)+': '+expression(value)+',').join('\n')}\n}\n`
fs.mkdirSync('src/features/permission/Core',{recursive:true})
fs.writeFileSync('src/features/permission/Core/organizationPolicies.ts',`// Explicit policies generated by scripts/generate-organization-permission-policies.mjs.\n// Existing enum identifiers only; unsupported backend operations are deliberately denied.\nimport { PermissionsEnum as P } from '@/features/users/Admin/Core/Enum/permission_enum'\nexport interface OrganizationPolicy { anyOf?: readonly P[]; allOf?: readonly P[]; authenticated?: boolean; unsupported?: string }\n\n`+table('organizationRoutePolicies',routeAssignments)+'\n'+table('organizationApiPolicies',endpoints))
const matrix={features:families,routes:routeAssignments,api:apiAssignments,endpoints,getterEndpoints}
fs.writeFileSync('docs/permission-audit/policy-matrix.json',JSON.stringify(matrix,null,2)+'\n')
console.log(JSON.stringify({routes:Object.keys(routeAssignments).length,endpoints:Object.keys(endpoints).length,unsupportedRoutes:Object.values(routeAssignments).filter(policy=>policy.unsupported).length,unsupportedEndpoints:Object.values(endpoints).filter(policy=>policy.unsupported).length}))
