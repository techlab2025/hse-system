<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import TitleInterface from '@/base/Data/Models/title_interface'
import { DataEmpty } from '@/base/core/networkStructure/Resources/dataState/data_state'
import PermissionHandler from '@/base/Presentation/utils/permission_handler'
import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'
import IndexMyNcrsParams from '../../../Core/params/my/indexMyNcrsParams'
import ShowInternalAuditPlanParams from '../../../Core/params/plan/showInternalAuditPlanParams'
import type InternalAuditNcrDetailsModel from '../../../Data/models/ncrs/InternalAuditNcrDetailsModel'
import type InternalAuditNcrModel from '../../../Data/models/ncrs/InternalAuditNcrModel'
import FetchMyNcrsController from '../../controllers/my/fetchMyNcrsController'
import ShowInternalAuditPlanController from '../../controllers/plan/showInternalAuditPlanController'
import InternalAuditNcrForm from '../ncrs/InternalAuditNcrForm.vue'
import InternalAuditNcrIndex from '../ncrs/InternalAuditNcrIndex.vue'

const props = withDefaults(
  defineProps<{
    internalAuditPlanId?: number
  }>(),
  { internalAuditPlanId: 0 },
)

const fetchController = FetchMyNcrsController.getInstance()
const showPlanController = ShowInternalAuditPlanController.getInstance()
const route = useRoute()
const listsLoaded = ref(false)
const detailsLoaded = ref(false)
let loadVersion = 0

const ncrs = ref<InternalAuditNcrModel[]>([])
const showForm = ref(false)
const openedNcrId = ref(0)
const selectedDetails = ref<InternalAuditNcrDetailsModel | null>(null)
const auditSerialName = ref('')
const auditLeadAuditor = ref<TitleInterface | null>(null)
const areaOptions = ref<TitleInterface[]>([])
const feedback = ref('')
const hasError = ref(false)

const isLoading = computed(() => fetchController.isDataLoading())
const currentAuditId = computed(() => {
  const value = Number(
    props.internalAuditPlanId ||
      route.query.internal_audit_plan_id ||
      route.query.internal_audit_id ||
      route.query.id ||
      route.params.id,
  )
  return Number.isInteger(value) && value > 0 ? value : 0
})
const canCreateNcr = computed(
  () =>
    currentAuditId.value > 0 &&
    listsLoaded.value &&
    detailsLoaded.value &&
    !hasError.value &&
    PermissionHandler.Instance.handle([
      PermissionsEnum.ADMIN,
      PermissionsEnum.MY_INTERNAL_AUDIT_ALL,
      PermissionsEnum.MY_INTERNAL_AUDIT_CREATE,
    ]),
)

function titleFrom(value: unknown): TitleInterface | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const item = value as Record<string, unknown>
  return new TitleInterface({
    id: Number(item.id ?? 0),
    title: String(item.title ?? item.name ?? ''),
  })
}

async function fetchNcrs(version = loadVersion) {
  feedback.value = ''
  hasError.value = false
  await fetchController.getData(new IndexMyNcrsParams(currentAuditId.value))
  if (version !== loadVersion) return
  listsLoaded.value = true
  if (fetchController.isDataSuccess() || fetchController.state.value instanceof DataEmpty) {
    ncrs.value = fetchController.state.value.data ?? []
    return
  }
  ncrs.value = []
  hasError.value = true
  feedback.value = fetchController.state.value.error?.title ?? 'Unable to load NCRs.'
}

async function fetchAuditDetails(version = loadVersion) {
  if (!currentAuditId.value) return
  await showPlanController.getData(new ShowInternalAuditPlanParams(currentAuditId.value))
  if (version !== loadVersion) return
  if (!showPlanController.isDataSuccess() || !showPlanController.state.value.data) {
    hasError.value = true
    feedback.value =
      showPlanController.state.value.error?.title ?? 'Unable to load internal audit details.'
    return
  }

  detailsLoaded.value = true
  const plan = showPlanController.state.value.data
  auditSerialName.value = plan.serial_name || plan.title
  const leadAuditor = plan.auditTeam.find((entry) => {
    const member = (entry ?? {}) as Record<string, unknown>
    return Boolean(member.is_lead_auditor)
  }) as Record<string, unknown> | undefined
  auditLeadAuditor.value = titleFrom(leadAuditor?.employee)
  const departments = plan.auditScope
    .map((entry) => {
      const item = (entry ?? {}) as Record<string, unknown>
      return titleFrom(item.department ?? item.depertment)
    })
    .filter((department): department is TitleInterface => Boolean(department))
  areaOptions.value = departments.filter(
    (department, index, all) =>
      all.findIndex((item) => Number(item.id) === Number(department.id)) === index,
  )
}

function toggleNewNcrForm() {
  if (!canCreateNcr.value) return
  if (showForm.value && !openedNcrId.value) {
    closeForm()
    return
  }
  openedNcrId.value = 0
  selectedDetails.value = null
  showForm.value = true
}

async function openNcr(item: InternalAuditNcrModel) {
  if (!item.id || !ncrs.value.some((ncr) => ncr.id === item.id)) return
  feedback.value = ''
  hasError.value = false
  if (!item.details) {
    hasError.value = true
    feedback.value = 'Unable to load NCR details.'
    return
  }
  showForm.value = false
  await nextTick()
  openedNcrId.value = item.id
  selectedDetails.value = item.details
  showForm.value = true
  await nextTick()
  document.querySelector('.ncr-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function closeForm() {
  showForm.value = false
  openedNcrId.value = 0
  selectedDetails.value = null
}

async function handleEdited() {
  closeForm()
  await fetchNcrs()
  if (!hasError.value) feedback.value = 'NCR updated successfully.'
}

async function handleCreated() {
  closeForm()
  await fetchNcrs()
  if (!hasError.value) feedback.value = 'NCR created successfully.'
}

async function loadAudit() {
  const version = ++loadVersion
  closeForm()
  ncrs.value = []
  auditSerialName.value = ''
  auditLeadAuditor.value = null
  areaOptions.value = []
  listsLoaded.value = false
  detailsLoaded.value = false
  feedback.value = ''
  hasError.value = false
  if (!currentAuditId.value) {
    hasError.value = true
    feedback.value = 'Select a valid internal audit.'
    return
  }
  await Promise.all([fetchNcrs(version), fetchAuditDetails(version)])
}

watch(currentAuditId, () => void loadAudit())
onMounted(() => void loadAudit())
</script>

<template>
  <section class="ncr-tab">
    <!-- <router-link class="btn btn-secondary" to="/organization/my-internal-audit">{{
      $t('back_to_my_internal_audits')
    }}</router-link> -->
    <header class="ncr-header">
      <h2>Non-conformance reports</h2>
      <div class="header-actions">
        <button v-if="canCreateNcr" class="primary-button" type="button" @click="toggleNewNcrForm">
          {{ showForm && !openedNcrId ? 'Close form' : 'New NCR' }}
        </button>
      </div>
    </header>

    <p
      v-if="feedback"
      class="message"
      :class="{ error: hasError, success: !hasError }"
      role="status"
    >
      {{ feedback }}
    </p>

    <div
      v-if="listsLoaded && detailsLoaded && !ncrs.length && !showForm && !hasError"
      class="empty-actions"
    >
      <button v-if="canCreateNcr" class="primary-button" type="button" @click="toggleNewNcrForm">
        {{ $t('create_first_ncr') }}
      </button>
    </div>

    <InternalAuditNcrForm
      v-if="showForm"
      :key="openedNcrId || 'new'"
      :internal-audit-plan-id="currentAuditId"
      :audit-serial-name="auditSerialName"
      :area-options="areaOptions"
      :details="selectedDetails"
      @close="closeForm"
      @created="handleCreated"
      @edited="handleEdited"
    />

    <InternalAuditNcrIndex
      :ncrs="ncrs"
      :audit-lead-auditor="auditLeadAuditor"
      :loading="isLoading"
      :has-error="hasError"
      @open="openNcr"
    />
  </section>
</template>

<style scoped>
.ncr-tab {
  display: grid;
  gap: 18px;
}
.ncr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 8px 0 16px;
  border-bottom: 1px solid var(--main-border, #d9e1df);
}
.ncr-header h2 {
  margin: 0;
  color: var(--text-primary, #172334);
  font-size: 1.05rem;
}
.header-actions {
  display: flex;
  gap: 10px;
}
.primary-button {
  border: 1px solid var(--PrimaryColor, #087d80);
  border-radius: 9px;
  background: var(--PrimaryColor, #087d80);
  padding: 10px 15px;
  color: #fff;
  font-weight: 650;
}
.message {
  margin: 0;
  border-radius: 10px;
  padding: 12px 16px;
}
.message.error {
  background: #fff0f0;
  color: #b42318;
}
.message.success {
  background: #e9f8f1;
  color: #16734b;
}
@media (max-width: 600px) {
  .ncr-header {
    align-items: flex-start;
    flex-direction: column;
  }
  .header-actions,
  .header-actions button {
    width: 100%;
  }
}
</style>
