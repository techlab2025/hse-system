<script lang="ts" setup>
import FetchPermitsParams from '@/features/Organization/Project/Core/params/PermitToWork/fetchPermitsParams'
import FetchProjectPermitsController from '../../../controllers/PermitToWork/FetchProjectPermitsController'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { PermitToWorkStatusEnum } from '@/features/Organization/Project/Core/Enums/PermitToWorkStatusEnum'
import { ref } from 'vue'
import FetchProjectPermitsAuditsController from '../../../controllers/PermitToWork/FetchProjectPermitsAuditsController'
import FetchPermitsAuditsParams from '@/features/Organization/Project/Core/params/PermitToWork/FetchPermitAuditParams'
import PermitToWorkResultDialog from './PermitToWorkResultDialog.vue'

const route = useRoute()
const router = useRouter()
const emit = defineEmits(['has_data'])
const fetchProjectPermitsController = FetchProjectPermitsController.getInstance()

const state = computed(() => fetchProjectPermitsController.state.value)

const permits = computed(() => state.value?.data ?? [])

const FetchProjectPermits = async (status?: number) => {
  const fetchProjectPermitsParams = new FetchPermitsParams({
    projectId: Number(route.params.project_id),
    hasResult: status == 1 ? true : false,
  })
  await fetchProjectPermitsController.FetchProjectPermits(fetchProjectPermitsParams, router)
}

const formatTime = (time?: string | null) => {
  if (!time) return '—'

  return time.substring(0, 5)
}

const getPermitTitle = (permit: any) => {
  if (permit.permitType?.title) {
    return permit.permitType.title
  }

  if (permit.permitToWork?.title) {
    return permit.permitToWork.title
  }

  return `Permit #${permit.serial || permit.id}`
}

const GetStatus = (status: PermitToWorkStatusEnum) => {
  switch (status) {
    case PermitToWorkStatusEnum.ACTIVE:
      return 'active'
      break
    case PermitToWorkStatusEnum.DRAFT:
      return 'draft'
      break

    case PermitToWorkStatusEnum.CANCEL:
      return 'cancel'
      break
  }
}

onMounted(async () => {
  await FetchProjectPermits()

  // emit('has_data', state.value.data?.length! > 0)
})
const SelectedStatus = ref<number>(2)
const SetStatus = (status: number) => {
  SelectedStatus.value = status
  if (status == 1) {
    FetchProjectPermits(1)
  } else {
    FetchProjectPermits(2)
  }
}
const fetchProjectPermitsAuditsController = FetchProjectPermitsAuditsController.getInstance()
const PermitResult = computed(() => fetchProjectPermitsAuditsController.state.value)
const resultDialogVisible = ref(false)
const loadingAuditPermitId = ref<number | null>(null)

const FetchPermitsAuidtResult = async (permitId: number) => {
  loadingAuditPermitId.value = permitId
  const fetchProjectPermitsParams = new FetchPermitsAuditsParams({ permitToWorkId: permitId })
  await fetchProjectPermitsAuditsController.FetchProjectPermitsAudits(
    fetchProjectPermitsParams,
    router,
  )

  if (fetchProjectPermitsAuditsController.isDataSuccess()) {
    resultDialogVisible.value = true
  }

  loadingAuditPermitId.value = null
}
</script>

<template>
  <div class="permits-page">
    <!-- Header -->
    <div class="permits-page-header">
      <div>
        <h2>
          {{ $t('Project Permits') }}
        </h2>
      </div>

      <div class="permits-count">
        <span>
          {{ permits.length }}
        </span>

        {{ $t('Permits') }}
      </div>
    </div>

    <div class="filter-btns">
      <button type="button" :class="{ active: SelectedStatus === 1 }" @click="SetStatus(1)">
        <span class="filter-status-dot" />
        {{ $t('Submitted Permits') }}
      </button>
      <button type="button" :class="{ active: SelectedStatus === 2 }" @click="SetStatus(2)">
        <span class="filter-status-dot" />
        {{ $t('Not Submitted Permits') }}
      </button>
    </div>
    <!-- Permits -->
    <div v-if="permits.length" class="permits-grid">
      <article v-for="permit in permits" :key="permit.id" class="permit-card">
        <!-- Top -->
        <div class="permit-card-top">
          <div class="permit-card-title-wrapper">
            <div class="permit-card-icon">PTW</div>

            <div class="permit-card-title">
              <small>
                {{ $t('Permit To Work') }}
              </small>

              <h3>
                {{ getPermitTitle(permit) }}
              </h3>
            </div>
          </div>

          <span class="permit-serial"> {{ GetStatus(permit.status) }} </span>
        </div>

        <!-- Description -->
        <div class="permit-description">
          <span class="permit-detail-label">
            {{ $t('Description') }}
          </span>

          <p>
            {{ permit.description || '—' }}
          </p>
        </div>

        <!-- Information -->
        <div class="permit-information-grid">
          <!-- Location -->
          <div class="permit-info-item permit-info-location">
            <span class="permit-info-icon"> LOC </span>

            <div>
              <span class="permit-detail-label">
                {{ $t('Location') }}
              </span>

              <strong>
                {{ permit.location || '—' }}
              </strong>
            </div>
          </div>

          <!-- Permit Type -->
          <div class="permit-info-item">
            <span class="permit-info-icon"> TP </span>

            <div>
              <span class="permit-detail-label">
                {{ $t('Permit Type') }}
              </span>

              <strong>
                {{ permit.permitType?.title || permit.permitToWork?.title || '—' }}
              </strong>
            </div>
          </div>

          <!-- Permit Type -->
          <div class="permit-info-item">
            <span class="permit-info-icon"> CB </span>

            <div>
              <span class="permit-detail-label">
                {{ $t('Created By ') }}
              </span>

              <strong>
                {{ permit.createdBy.name || '-' }}
              </strong>
            </div>
          </div>
        </div>

        <!-- Duration -->
        <div class="permit-duration">
          <div class="permit-duration-heading">
            <span>
              {{ $t('Permit Duration') }}
            </span>

            <span class="permit-duration-line" />
          </div>

          <div class="permit-date-grid">
            <!-- Start -->
            <div class="permit-date-card">
              <span class="permit-date-status start">
                {{ $t('Start') }}
              </span>

              <strong>
                {{ permit.startDate || '—' }}
              </strong>

              <small>
                {{ formatTime(permit.startTime) }}
              </small>
            </div>

            <div class="permit-duration-arrow">→</div>

            <!-- End -->
            <div class="permit-date-card">
              <span class="permit-date-status end">
                {{ $t('End') }}
              </span>

              <strong>
                {{ permit.endDate || '—' }}
              </strong>

              <small>
                {{ formatTime(permit.endTime) }}
              </small>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="permit-card-footer">
          <div>
            <span>
              {{ $t('Permit ID') }}
            </span>

            <strong> #{{ permit.serialName }} </strong>
          </div>
          <router-link
            v-if="!permit.hasResult"
            :to="{
              path: `/organization/project-permit/project/templates`,
              query: {
                permit_id: permit.id,
                project_id: route.params.project_id,
              },
            }"
            >Create Audit</router-link
          >
          <!-- :to="{
              path: `/organization/project-permit/project/templates-result`,
              query: {
                permit_id: permit.id,
                project_id: route.params.project_id,
              },
            }" -->
          <button
            v-if="permit.hasResult"
            type="button"
            :disabled="loadingAuditPermitId === permit.id"
            @click="FetchPermitsAuidtResult(permit.id)"
          >
            {{ loadingAuditPermitId === permit.id ? $t('Loading') : $t('Show Audit') }}
          </button>
        </div>
      </article>
    </div>

    <!-- Empty State -->
    <div v-else class="permits-empty">
      <div class="permits-empty-icon">PTW</div>

      <strong>
        {{ $t('No permits found') }}
      </strong>

      <p>
        {{ $t('There are no permits created for this project yet') }}
      </p>
    </div>

    <PermitToWorkResultDialog
      v-model:visible="resultDialogVisible"
      :audits="PermitResult.data ?? []"
    />
  </div>
</template>

<style scoped lang="scss">
.filter-btns {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 20px;
  padding: 4px;
  border: 1px solid var(--main-border);
  border-radius: 14px;
  background: color-mix(in srgb, var(--surface-2) 90%, var(--PrimaryColor) 10%);
  box-shadow: 0 6px 18px color-mix(in srgb, var(--brand-primary-900) 5%, transparent);

  button {
    display: inline-flex;
    min-height: 38px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 14px;
    border: 1px solid transparent;
    border-radius: 10px;
    color: var(--text-soft);
    background: transparent;
    font-size: 0.72rem;
    font-weight: 800;
    cursor: pointer;
    transition:
      color 0.2s ease,
      border-color 0.2s ease,
      background 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.2s ease;

    &:hover:not(.active) {
      color: var(--text-strong);
      background: color-mix(in srgb, var(--PrimaryColor) 6%, transparent);
    }

    &:active {
      transform: scale(0.98);
    }

    &.active {
      border-color: color-mix(in srgb, var(--PrimaryColor) 80%, transparent);
      color: #fff;
      background: linear-gradient(135deg, var(--PrimaryColor), var(--brand-primary-700));
      box-shadow: 0 5px 12px color-mix(in srgb, var(--PrimaryColor) 24%, transparent);

      .filter-status-dot {
        border-color: color-mix(in srgb, #fff 55%, transparent);
        background: #fff;
        box-shadow: 0 0 0 3px color-mix(in srgb, #fff 18%, transparent);
      }
    }
  }
}

.filter-status-dot {
  width: 7px;
  height: 7px;
  flex: 0 0 auto;
  border: 1px solid color-mix(in srgb, var(--text-soft) 65%, transparent);
  border-radius: 50%;
  background: transparent;
  transition: inherit;
}
.permits-page {
  width: 100%;
}

/* ==========================================================================
   Page Header
   ========================================================================== */

.permits-page-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  overflow: hidden;
  margin-bottom: 12px;
  padding: 18px 20px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 17%, var(--main-border));
  border-radius: 16px;
  background:
    radial-gradient(
      circle at top right,
      color-mix(in srgb, var(--PrimaryColor) 12%, transparent),
      transparent 42%
    ),
    linear-gradient(135deg, var(--surface-1), var(--surface-2));
  box-shadow: 0 10px 26px color-mix(in srgb, var(--brand-primary-900) 6%, transparent);
}

.permits-page-header::before {
  position: absolute;
  inset-block: 12px;
  inset-inline-start: 0;
  width: 4px;
  border-radius: 0 999px 999px 0;
  content: '';
  background: linear-gradient(180deg, var(--PrimaryColor), var(--brand-primary-700));
}

.permits-page-kicker {
  display: block;

  margin-bottom: 4px;

  color: var(--PrimaryColor);

  font-size: 0.68rem;
  font-weight: 900;
  text-transform: uppercase;
}

.permits-page-header h2 {
  margin: 0;
  color: var(--text-strong);
  font-size: 1.2rem;
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.permits-page-header p {
  margin: 5px 0 0;

  color: var(--text-soft);

  font-size: 0.74rem;
}

.permits-count {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px 6px 6px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 25%, var(--main-border));
  border-radius: 999px;
  color: var(--text-soft);
  background: color-mix(in srgb, var(--PrimaryColor) 6%, var(--surface-1));
  font-size: 0.68rem;
  font-weight: 800;
  white-space: nowrap;
}

.permits-count span {
  display: grid;
  min-width: 25px;
  height: 25px;
  place-items: center;
  padding: 0 6px;
  border-radius: 50%;
  color: #fff;
  background: linear-gradient(145deg, var(--PrimaryColor), var(--brand-primary-700));
  font-size: 0.7rem;
  font-weight: 900;
  box-shadow: 0 3px 8px color-mix(in srgb, var(--PrimaryColor) 26%, transparent);
}

/* ==========================================================================
   Grid
   ========================================================================== */

.permits-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

/* ==========================================================================
   Permit Card
   ========================================================================== */

.permit-card {
  position: relative;

  overflow: hidden;

  border: 1px solid var(--main-border);
  border-radius: 16px;

  background: var(--surface-2);

  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.permit-card::before {
  position: absolute;
  top: 0;
  inset-inline-start: 0;

  width: 4px;
  height: 100%;

  content: '';

  background: linear-gradient(to bottom, var(--PrimaryColor), var(--brand-primary-700));
}

.permit-card:hover {
  transform: translateY(-2px);

  border-color: color-mix(in srgb, var(--PrimaryColor) 35%, var(--main-border));

  box-shadow: 0 12px 28px color-mix(in srgb, var(--brand-primary-900) 8%, transparent);
}

/* ==========================================================================
   Card Top
   ========================================================================== */

.permit-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;

  padding: 15px 16px;
}

.permit-card-title-wrapper {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;
}

.permit-card-icon {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  place-items: center;

  border-radius: 12px;

  color: #fff;

  background: linear-gradient(145deg, var(--PrimaryColor), var(--brand-primary-700));

  font-size: 0.6rem;
  font-weight: 900;
}

.permit-card-title {
  min-width: 0;
}

.permit-card-title small {
  display: block;

  margin-bottom: 2px;

  color: var(--PrimaryColor);

  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
}

.permit-card-title h3 {
  overflow: hidden;

  margin: 0;

  color: var(--text-strong);

  font-size: 0.85rem;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.permit-serial {
  flex: 0 0 auto;

  padding: 6px 9px;

  border-radius: 8px;

  color: var(--PrimaryColor);

  background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);

  font-size: 0.68rem;
  font-weight: 900;
}

/* ==========================================================================
   Description
   ========================================================================== */

.permit-description {
  margin: 0 16px;
  padding: 12px;

  border: 1px solid var(--main-border);
  border-radius: 11px;

  background: var(--surface-1);
}

.permit-detail-label {
  display: block;

  margin-bottom: 4px;

  color: var(--text-soft);

  font-size: 0.62rem;
  font-weight: 600;
}

.permit-description p {
  margin: 0;

  color: var(--text-strong);

  font-size: 0.75rem;
  line-height: 1.5;

  word-break: break-word;
}

/* ==========================================================================
   Information
   ========================================================================== */

.permit-information-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  padding: 13px 16px 0;
}

.permit-info-item {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 9px;

  padding: 10px;

  border: 1px solid var(--main-border);
  border-radius: 11px;

  background: var(--surface-1);
}

.permit-info-icon {
  display: grid;
  width: 31px;
  height: 31px;
  flex: 0 0 auto;
  place-items: center;

  border-radius: 8px;

  color: var(--PrimaryColor);

  background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);

  font-size: 0.5rem;
  font-weight: 900;
}

.permit-info-item > div {
  min-width: 0;
}

.permit-info-item strong {
  display: block;
  overflow: hidden;

  color: var(--text-strong);

  font-size: 0.7rem;

  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ==========================================================================
   Duration
   ========================================================================== */

.permit-duration {
  padding: 14px 16px;
}

.permit-duration-heading {
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 9px;

  color: var(--text-soft);

  font-size: 0.62rem;
  font-weight: 700;
}

.permit-duration-line {
  height: 1px;
  flex: 1;

  background: var(--main-border);
}

.permit-date-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 28px minmax(0, 1fr);
  align-items: center;
  gap: 8px;
}

.permit-date-card {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;

  padding: 10px 11px;

  border: 1px solid var(--main-border);
  border-radius: 11px;

  background: var(--surface-1);
}

.permit-date-status {
  width: max-content;

  margin-bottom: 3px;
  padding: 3px 7px;

  border-radius: 6px;

  font-size: 0.57rem;
  font-weight: 800;
}

.permit-date-status.start {
  color: var(--PrimaryColor);

  background: color-mix(in srgb, var(--PrimaryColor) 9%, transparent);
}

.permit-date-status.end {
  color: var(--status-danger);

  background: color-mix(in srgb, var(--status-danger) 8%, transparent);
}

.permit-date-card strong {
  overflow: hidden;

  color: var(--text-strong);

  font-size: 0.7rem;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.permit-date-card small {
  color: var(--text-soft);

  font-size: 0.64rem;
}

.permit-duration-arrow {
  color: var(--PrimaryColor);

  font-size: 1rem;
  font-weight: 900;
  text-align: center;
}

/* ==========================================================================
   Footer
   ========================================================================== */

.permit-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 10px 16px;

  border-top: 1px solid var(--main-border);

  color: var(--text-soft);

  background: color-mix(in srgb, var(--surface-1) 60%, transparent);

  font-size: 0.62rem;
  div {
    gap: 5px;
    display: flex;
    align-items: center;
  }
  a {
    border: 1px solid lightgray;
    padding: 5px;
    border-radius: 5px;
    transition: 0.3s all linear;
    &:hover {
      background-color: lightgray;
      color: black;
    }
  }
}

.permit-card-footer strong {
  color: var(--text-strong);

  font-size: 0.66rem;
}

/* ==========================================================================
   Empty
   ========================================================================== */

.permits-empty {
  display: flex;
  min-height: 280px;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  padding: 30px;

  border: 1px dashed var(--main-border);
  border-radius: 16px;

  text-align: center;

  background: var(--surface-2);
}

.permits-empty-icon {
  display: grid;
  width: 55px;
  height: 55px;
  place-items: center;

  margin-bottom: 12px;

  border-radius: 15px;

  color: var(--PrimaryColor);

  background: color-mix(in srgb, var(--PrimaryColor) 10%, transparent);

  font-size: 0.65rem;
  font-weight: 900;
}

.permits-empty strong {
  color: var(--text-strong);

  font-size: 0.85rem;
}

.permits-empty p {
  margin: 5px 0 0;

  color: var(--text-soft);

  font-size: 0.7rem;
}

/* ==========================================================================
   Responsive
   ========================================================================== */

@media (max-width: 900px) {
  .permits-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .permits-page-header {
    gap: 12px;
    padding: 15px 16px;
  }

  .permits-page-header h2 {
    font-size: 1rem;
  }

  .filter-btns {
    display: flex;
    width: 100%;

    button {
      min-width: 0;
      flex: 1;
      padding-inline: 8px;
      font-size: 0.66rem;
    }
  }

  .permit-information-grid {
    grid-template-columns: 1fr;
  }

  .permit-date-grid {
    grid-template-columns: 1fr;
  }

  .permit-duration-arrow {
    transform: rotate(90deg);
  }

  .permit-card-top {
    align-items: flex-start;
  }
}
</style>
