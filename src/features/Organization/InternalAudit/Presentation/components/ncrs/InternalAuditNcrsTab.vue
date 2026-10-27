<script setup lang="ts">
import { translate as localizeUi } from '@/localization/i18n'

import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import FetchNcrDetailsParams from '../../../Core/params/ncrs/fetchNcrDetailsParams'
import FetchNcrDetailsController from '../../controllers/ncrs/fetchNcrDetailsController'
import TitleInterface from '@/base/Data/Models/title_interface'
import { InrernalAuditStatusEnum } from '../../../Core/enums/plan/PlanStatusENum'
import IndexNcrsParams from '../../../Core/params/ncrs/indexNcrsParams'
import ShowInternalAuditPlanParams from '../../../Core/params/plan/showInternalAuditPlanParams'
import type InternalAuditNcrDetailsModel from '../../../Data/models/ncrs/InternalAuditNcrDetailsModel'
import type InternalAuditNcrModel from '../../../Data/models/ncrs/InternalAuditNcrModel'
import FetchNcrsController from '../../controllers/ncrs/fetchNcrsController'
import ShowInternalAuditPlanController from '../../controllers/plan/showInternalAuditPlanController'
import InternalAuditNcrForm from './InternalAuditNcrForm.vue'
import InternalAuditNcrIndex from './InternalAuditNcrIndex.vue'

const props = withDefaults(
  defineProps<{
    internalAuditPlanId?: number
    auditStatus?: string
    auditStartDate?: string
  }>(),
  { internalAuditPlanId: 0, auditStatus: '', auditStartDate: '' },
)

const fetchController = FetchNcrsController.getInstance()
const showPlanController = ShowInternalAuditPlanController.getInstance()
const route = useRoute()
const indexParams = new IndexNcrsParams('', 1, 1, 0, Number(route.query?.internal_audit_plan_id))

const ncrs = ref<InternalAuditNcrModel[]>([])
const showForm = ref(false)
const openingNcrId = ref(0)
let openVersion = 0
const ncrDetailsController = FetchNcrDetailsController.getInstance()
const openedNcrId = ref(0)
const openedNcrHasResult = ref(false)
const selectedDetails = ref<InternalAuditNcrDetailsModel | null>(null)
const auditSerialName = ref('')
const auditLeadAuditor = ref<TitleInterface | null>(null)
const auditDetailsStatus = ref<string | number>('')
const auditDetailsStartDate = ref('')
const areaOptions = ref<TitleInterface[]>([])
const standardOptions = ref<TitleInterface[]>([])
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
  return Number.isFinite(value) && value > 0 ? value : 0
})
const canCreateNcr = computed(() => {
  const status = String(auditDetailsStatus.value || props.auditStatus).toLowerCase()
  const isPlanned =
    status === 'planned' || Number(status) === Number(InrernalAuditStatusEnum.planned)
  const auditStartDate = auditDetailsStartDate.value || props.auditStartDate
  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  return (
    currentAuditId.value > 0 &&
    isPlanned &&
    (!auditStartDate || auditStartDate.slice(0, 10) <= today)
  )
})

function titleFrom(value: unknown): TitleInterface | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const item = value as Record<string, unknown>
  return new TitleInterface({
    id: Number(item.id ?? 0),
    title: String(item.title ?? item.name ?? ''),
  })
}

async function fetchNcrs() {
  feedback.value = ''
  hasError.value = false
  await fetchController.getData(indexParams)
  if (fetchController.isDataSuccess()) {
    ncrs.value = fetchController.state.value.data ?? []
    return
  }
  ncrs.value = []
  hasError.value = true
  feedback.value = fetchController.state.value.error?.title ?? 'Unable to load NCRs.'
}

async function fetchAuditDetails() {
  standardOptions.value = []
  if (!currentAuditId.value) return
  await showPlanController.getData(new ShowInternalAuditPlanParams(currentAuditId.value))
  if (!showPlanController.isDataSuccess() || !showPlanController.state.value.data) {
    hasError.value = true
    feedback.value =
      showPlanController.state.value.error?.title ?? 'Unable to load internal audit details.'
    return
  }

  const plan = showPlanController.state.value.data
  standardOptions.value = plan.auditStandards
  auditSerialName.value = plan.serial_name || plan.title
  const leadAuditor = plan.auditTeam.find((entry) => {
    const member = (entry ?? {}) as Record<string, unknown>
    return Boolean(member.is_lead_auditor)
  }) as Record<string, unknown> | undefined
  auditLeadAuditor.value = titleFrom(leadAuditor?.employee)
  auditDetailsStatus.value = plan.status
  auditDetailsStartDate.value = plan.auditStartDate
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
  if (openingNcrId.value) return
  if (showForm.value && !openedNcrId.value) {
    closeForm()
    return
  }
  openedNcrId.value = 0
  openedNcrHasResult.value = false
  selectedDetails.value = null
  showForm.value = true
}

async function openNcr(item: InternalAuditNcrModel) {
  if (openingNcrId.value || !item.id || !ncrs.value.some((ncr) => ncr.id === item.id)) return
  const version = ++openVersion
  openingNcrId.value = item.id
  feedback.value = ''
  hasError.value = false
  showForm.value = false
  selectedDetails.value = null
  try {
    await ncrDetailsController.getData(new FetchNcrDetailsParams(item.id))
    if (version !== openVersion) return
    const ncr = ncrDetailsController.state.value.data
    if (!ncrDetailsController.isDataSuccess() || !ncr?.details || ncr.id !== item.id) {
      hasError.value = true
      feedback.value =
        ncrDetailsController.state.value.error?.title ?? 'Unable to load NCR details.'
      return
    }
    openedNcrId.value = ncr.id
    selectedDetails.value = ncr.details
    openedNcrHasResult.value = ncr.hasResult
    showForm.value = true
    await nextTick()
    if (version === openVersion) {
      document.querySelector('.ncr-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  } catch {
    if (version === openVersion) {
      hasError.value = true
      feedback.value = localizeUi('Unable to load NCR details. Please try again.')
    }
  } finally {
    if (version === openVersion) openingNcrId.value = 0
  }
}

function closeForm() {
  ++openVersion
  openingNcrId.value = 0
  showForm.value = false
  openedNcrId.value = 0
  openedNcrHasResult.value = false
  selectedDetails.value = null
}

async function handleEdited() {
  closeForm()
  await fetchNcrs()
  if (!hasError.value) feedback.value = localizeUi('NCR updated successfully.')
}

async function handleCreated() {
  closeForm()
  await fetchNcrs()
  if (!hasError.value) feedback.value = localizeUi('NCR created successfully.')
}

watch(currentAuditId, () => {
  closeForm()
  void fetchAuditDetails()
})
onMounted(() => void Promise.all([fetchNcrs(), fetchAuditDetails()]))
onBeforeUnmount(() => {
  ++openVersion
})
</script>

<template>
  <section class="ncr-tab">
    <header class="ncr-header">
      <h2>{{ $t('Non-conformance reports') }}</h2>
      <div class="header-actions">
        <button
          v-if="canCreateNcr"
          :disabled="Boolean(openingNcrId)"
          class="primary-button"
          type="button"
          @click="toggleNewNcrForm"
        >
          {{ showForm && !openedNcrId ? $t('Close form') : $t('New NCR') }}
        </button>
      </div>
    </header>

    <!-- <p
      v-if="feedback"
      class="message"
      :class="{ error: hasError, success: !hasError }"
      role="status"
    >
      {{ feedback }}
    </p> -->

    <InternalAuditNcrForm
      v-if="showForm"
      :key="openedNcrId || 'new'"
      :internal-audit-plan-id="currentAuditId"
      :audit-serial-name="auditSerialName"
      :area-options="areaOptions"
      :standard-options="standardOptions"
      :details="selectedDetails"
      :readonly="openedNcrHasResult"
      @close="closeForm"
      @created="handleCreated"
      @edited="handleEdited"
    />

    <InternalAuditNcrIndex
      :ncrs="ncrs"
      :audit-lead-auditor="auditLeadAuditor"
      :loading="isLoading"
      :opening-ncr-id="openingNcrId"
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
