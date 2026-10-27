import { translate as localizeUi } from '@/localization/i18n'
import { computed, onScopeDispose, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PermissionHandler from '@/base/Presentation/utils/permission_handler'
import TitleInterface from '@/base/Data/Models/title_interface'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import { useProjectSelectStore } from '@/stores/ProjectSelect'
import FetchMyProjectsController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyProjectsController'
import FetchMyProjectsParams from '@/features/Organization/ObservationFactory/Core/params/fetchMyProjectsParams'
import FetchMyZonesController from '@/features/Organization/ObservationFactory/Presentation/controllers/FetchMyZonesController'
import FetchMyZonesParams from '@/features/Organization/ObservationFactory/Core/params/FetchMyZonesParams'
import type MyZonesModel from '@/features/Organization/ObservationFactory/Data/models/MyZonesModel'
import type ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'
import { InspectionPageType } from '@/features/Organization/ObservationFactory/Core/Enums/InspectionTypeEnum'
import { InspectionTypeEnum } from '../../Core/Enum/InspectionTypeEnum'
import IndexInspectionParams from '../../Core/params/indexInspectionParams'
import FetchAllTasksParams from '../../Core/params/FetchAllTasksParams'
import FetchInspectionsResultsParams from '../../Core/params/FetchInspectionsResultsParams'
import IndexInspectionController from '../controllers/indexInspectionController'
import FetchAllTasksController from '../controllers/FetchAllTasksController'
import FetchInspectionsResultsController from '../controllers/FetchInspectionsResultsController'

export function useInspectionIndex() {
  const route = useRoute()
  const router = useRouter()
  const selectedProject = useProjectSelectStore()
  const currentPage = ref(1)
  const countPerPage = ref(10)
  const activeAuditTab = ref<'all' | 'mine'>('all')
  const selectedProjectId = ref<number>()
  const selectedZoneIds = ref<number[]>([])
  const projects = ref<ProjectModel[]>([])
  const zones = ref<MyZonesModel[]>([])
  const filterDate = ref('')
  const filterInspectionType = ref<number | null>(null)
  const isAuditPage = computed(() => route.name === 'Audits')
  const inspectionType = computed(() => {
    const type = Number(route.query.inspectionType)
    return [1, 2, 3].includes(type) ? type : InspectionPageType.InspectionForm
  })
  const auditProjectId = computed(
    () => Number(route.query.project_id) || Number(route.params.id) || undefined,
  )
  const auditCreateRoute = computed(() => ({
    name: 'Add Audit',
    query: { project_id: auditProjectId.value },
    params: { id: auditProjectId.value },
  }))
  const inspectionCreateRoute = computed(() => ({
    name: 'Add Inspection',
    query: selectedProjectId.value ? { project_id: String(selectedProjectId.value) } : undefined,
  }))
  const createPermissions = [
    PermissionsEnum.ADMIN,
    PermissionsEnum.ORG_INSPECTION_ALL,
    PermissionsEnum.ORG_INSPECTION_CREATE,
  ]
  const canCreateRecord = computed(() => PermissionHandler.Instance.handle(createPermissions))
  const canViewRecords = computed(() =>
    PermissionHandler.Instance.handle([
      PermissionsEnum.ADMIN,
      PermissionsEnum.ORG_INSPECTION_ALL,
      ...(inspectionType.value === InspectionPageType.Result
        ? [PermissionsEnum.INSPECTION_RESULTS_FETCH]
        : [PermissionsEnum.ORG_INSPECTION_FETCH, PermissionsEnum.MY_TASKS_ALL]),
    ]),
  )
  const taskTabs = [
    {
      type: InspectionPageType.InspectionForm,
      get label() {
        return localizeUi('All tasks')
      },
    },
    {
      type: InspectionPageType.DragInspection,
      get label() {
        return localizeUi('My tasks')
      },
    },
    {
      type: InspectionPageType.Result,
      get label() {
        return localizeUi('Submitted tasks')
      },
    },
  ]
  const filterFields = [
    {
      key: 'inspectionType',
      get label() {
        return localizeUi('Inspection Type')
      },
      options: [
        new TitleInterface({ id: InspectionTypeEnum.DAY, title: 'Daily', translationKey: 'Daily' }),
        new TitleInterface({
          id: InspectionTypeEnum.PERIOD,
          title: 'Periodic',
          translationKey: 'Periodic',
        }),
      ],
    },
  ]

  // Controller states are already refs; copying them into refs required redundant watchers.
  const indexController = IndexInspectionController.getInstance()
  const tasksController = FetchAllTasksController.getInstance()
  const resultsController = FetchInspectionsResultsController.getInstance()
  let ready = false
  let disposed = false
  let selectionVersion = 0
  let projectsRequest: Promise<void> | undefined
  const pendingRequests = new Map<string, Promise<unknown>>()
  const pendingZones = new Map<number, Promise<MyZonesModel[]>>()
  onScopeDispose(() => {
    disposed = true
    selectionVersion++
  })

  async function fetchRecords() {
    if (!ready || disposed || !canViewRecords.value) return
    const type = isAuditPage.value
      ? activeAuditTab.value === 'all'
        ? InspectionPageType.InspectionForm
        : InspectionPageType.DragInspection
      : inspectionType.value
    const zoneIds =
      !isAuditPage.value && selectedZoneIds.value.length ? selectedZoneIds.value : undefined
    const common = [
      selectedProjectId.value || undefined,
      filterInspectionType.value ?? undefined,
      filterDate.value,
      isAuditPage.value,
    ] as const
    const params =
      type === InspectionPageType.DragInspection
        ? new IndexInspectionParams(
            '',
            currentPage.value,
            countPerPage.value,
            1,
            undefined,
            zoneIds,
            undefined,
            selectedProjectId.value || undefined,
            route.query.typeId ? Number(route.query.typeId) : undefined,
            filterInspectionType.value ?? undefined,
            filterDate.value,
            isAuditPage.value,
          )
        : type === InspectionPageType.InspectionForm
          ? new FetchAllTasksParams(
              '',
              currentPage.value,
              countPerPage.value,
              1,
              zoneIds,
              ...common,
            )
          : new FetchInspectionsResultsParams(
              '',
              currentPage.value,
              countPerPage.value,
              1,
              zoneIds,
              ...common,
            )
    const controller =
      type === InspectionPageType.DragInspection
        ? indexController
        : type === InspectionPageType.InspectionForm
          ? tasksController
          : resultsController
    const key = JSON.stringify([type, params.toMap()])
    if (pendingRequests.has(key)) return pendingRequests.get(key)
    // Controllers expose failure through DataStatus and may also reject the promise.
    const request = controller
      .getData(params)
      .catch((error: unknown) => {
        console.error('Failed to load inspections', error)
      })
      .finally(() => pendingRequests.delete(key))
    pendingRequests.set(key, request)
    return request
  }

  function loadProjects() {
    projectsRequest ??= FetchMyProjectsController.getInstance()
      .getData(new FetchMyProjectsParams(false))
      .then((response) => {
        if (!disposed) projects.value = response.value.data ?? []
      })
      .catch((error: unknown) => {
        console.error('Failed to load inspection projects', error)
      })
    return projectsRequest
  }

  async function loadZones(version: number) {
    zones.value = []
    if (isAuditPage.value || !selectedProjectId.value) return
    const projectId = selectedProjectId.value
    let request = pendingZones.get(projectId)
    if (!request) {
      request = FetchMyZonesController.getInstance()
        .FetchMyZones(new FetchMyZonesParams(projectId), router)
        .then((response) => response.value.data ?? [])
        .finally(() => pendingZones.delete(projectId))
      pendingZones.set(projectId, request)
    }
    const availableZones = await request
    if (disposed || version !== selectionVersion) return
    zones.value = availableZones
    if (zones.value.length === 1) selectedZoneIds.value = [zones.value[0]!.id]
  }

  async function selectProject(projectId?: number) {
    if (selectedProjectId.value === projectId) return
    const version = ++selectionVersion
    ready = false
    selectedProjectId.value = projectId
    selectedZoneIds.value = []
    currentPage.value = 1
    await loadZones(version)
    if (disposed || version !== selectionVersion) return
    ready = true
    await fetchRecords()
  }

  function changeTaskTab(type: InspectionPageType) {
    if (inspectionType.value !== type) {
      return router.push({ query: { ...route.query, inspectionType: String(type) } })
    }
  }
  function changeAuditTab(tab: 'all' | 'mine') {
    if (activeAuditTab.value === tab) return
    activeAuditTab.value = tab
    currentPage.value = 1
    return fetchRecords()
  }
  function applyZones(ids: number[]) {
    selectedZoneIds.value = ids
    currentPage.value = 1
    return fetchRecords()
  }
  function applyFilters({ date, values }: { date: string; values: Record<string, number | null> }) {
    filterDate.value = date
    filterInspectionType.value = values.inspectionType ?? null
    currentPage.value = 1
    return fetchRecords()
  }
  function resetFilters() {
    return applyFilters({ date: '', values: {} })
  }
  function changePage(page: number) {
    currentPage.value = page
    return fetchRecords()
  }
  function changePageSize(count: number) {
    countPerPage.value = count
    return fetchRecords()
  }

  // Resolve automatic project/zone selections before the first list request.
  // Tab-only changes reuse the existing options and selected zones.
  watch(
    () =>
      [
        route.query.typeId,
        route.query.inspectionType,
        auditProjectId.value,
        route.name,
        selectedProject.getProjectId(),
      ] as const,
    async (values, previous) => {
      const version = ++selectionVersion
      const selectionPending = !ready
      ready = false
      const projectChanged =
        !previous ||
        values[2] !== previous[2] ||
        values[3] !== previous[3] ||
        values[4] !== previous[4]
      if (!isAuditPage.value) await loadProjects()
      if (disposed || version !== selectionVersion) return
      if (projectChanged) {
        selectedProjectId.value = auditProjectId.value ?? selectedProject.getProjectId()
        if (!selectedProjectId.value && projects.value.length === 1) {
          selectedProjectId.value = projects.value[0]!.id
        }
        selectedZoneIds.value = []
      }
      if (projectChanged || selectionPending) await loadZones(version)
      if (disposed || version !== selectionVersion) return
      currentPage.value = 1
      ready = true
      await fetchRecords()
    },
    { immediate: true },
  )

  return {
    route,
    selectedProject,
    currentPage,
    countPerPage,
    activeAuditTab,
    selectedProjectId,
    selectedZoneIds,
    projects,
    zones,
    filterDate,
    filterInspectionType,
    isAuditPage,
    inspectionType,
    auditProjectId,
    auditCreateRoute,
    inspectionCreateRoute,
    canCreateRecord,
    canViewRecords,
    taskTabs,
    filterFields,
    state: indexController.state,
    allTasksState: tasksController.state,
    resultsState: resultsController.state,
    selectProject,
    changeTaskTab,
    changeAuditTab,
    applyZones,
    applyFilters,
    resetFilters,
    changePage,
    changePageSize,
  }
}
