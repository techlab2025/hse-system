import { translate as localizeUi } from '@/localization/i18n'
import { computed, onBeforeUnmount, shallowRef, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  DataInitial,
  DataLoading,
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import PermissionHandler from '@/base/Presentation/utils/permission_handler'
import { PermissionsEnum as P } from '@/features/users/Admin/Core/Enum/permission_enum'
import ShowObjectivesController from '../../../Presentation/controllers/showObjectivesController'
import ShowObjectivesParams from '../../../Core/params/showObjectivesParams'
import type ObjectivesDetailsModel from '../../../Data/models/objectivesDetailsModel'
import IndexObjectiveProgressController from '../controllers/indexObjectiveProgressController'
import IndexObjectiveProgressParams from '../../Core/params/indexObjectiveProgressParams'
import type ObjectiveProgressModel from '../../Data/models/objectiveProgressModel'
import type ObjectiveProgressHistoryModel from '../../Data/models/objectiveProgressHistoryModel'
import { supportsProgress } from '../../Data/apiServices/objectiveProgressContract'
import { validId } from '../../Core/utils/objectiveProgress'
export const objectiveViewPermissions = [
  P.ORGANIZATION_EMPLOYEE,
  P.OBJECTIVE_ORG_ALL,
  P.OBJECTIVE_ORG_FETCH,
  P.OBJECTIVE_ORG_UPDATE,
  P.OBJECTIVE_ORG_CREATE,
  P.OBJECTIVE_ORG_DELETE,
]
export const objectiveUpdatePermissions = [
  P.ORGANIZATION_EMPLOYEE,
  P.OBJECTIVE_ORG_ALL,
  P.OBJECTIVE_ORG_UPDATE,
]
export function useObjectiveProgress() {
  const route = useRoute()
  const objectiveId = computed(() => validId(route.params.objectiveId))
  const canView = computed(() => PermissionHandler.Instance.handle(objectiveViewPermissions))
  const canUpdate = computed(() => PermissionHandler.Instance.handle(objectiveUpdatePermissions))
  const objective = shallowRef<ObjectivesDetailsModel | null>(null)
  const loading = ref(false),
    error = ref('')
  const history = shallowRef<DataState<ObjectiveProgressHistoryModel>>(new DataInitial())
  const records = computed<ObjectiveProgressModel[]>(() =>
    history.value instanceof DataSuccess ? (history.value.data?.records ?? []) : [],
  )
  let generation = 0
  async function load() {
    const request = ++generation
    objective.value = null
    error.value = ''
    history.value = new DataInitial()
    if (!canView.value) {
      error.value = localizeUi('op.forbidden')
      loading.value = false
      return
    }
    const id = objectiveId.value
    if (!id) {
      error.value = localizeUi('op.invalidObjective')
      loading.value = false
      return
    }
    loading.value = true
    // Per-load controller prevents singleton state from leaking between different objectives/routes.
    const controller = ShowObjectivesController.create()
    try {
      const state = await controller.showObjectivesType(new ShowObjectivesParams(id))
      if (request !== generation) return
      if (!state.value.data || Number(state.value.data.id) !== id) {
        error.value = localizeUi('op.notFound')
        return
      }
      objective.value = state.value.data
    } catch {
      if (request === generation) error.value = localizeUi('op.loadFailed')
    } finally {
      if (request === generation) loading.value = false
    }
    if (request === generation && objective.value) await loadHistory()
  }
  async function loadHistory() {
    if (!objectiveId.value || !objective.value || !canView.value || !supportsProgress('index'))
      return
    const request = generation
    history.value = new DataLoading()
    const state = await IndexObjectiveProgressController.getInstance().getData(
      new IndexObjectiveProgressParams(objectiveId.value),
    )
    if (request === generation) history.value = state.value
  }
  watch(() => [route.params.objectiveId, route.params.progressId, route.name], load, {
    immediate: true,
  })
  onBeforeUnmount(() => {
    generation++
  })
  return {
    objectiveId,
    objective,
    loading,
    error,
    history,
    records,
    canView,
    canUpdate,
    load,
    loadHistory,
  }
}
