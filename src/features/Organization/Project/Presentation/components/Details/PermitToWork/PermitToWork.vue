<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'

import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'

import PermitToWorkController from '../../../controllers/PermitToWork/PermitToWorkController'
import PermitToWorkParams from '@/features/Organization/Project/Core/params/PermitToWork/PermitToWorkParams'

import IndexPTWTypeController from '@/features/Organization/PTWType/Presentation/controllers/indexPTWTypeController'
import IndexPTWTypeParams from '@/features/Organization/PTWType/Core/params/indexPTWTypeParams'

import type TitleInterface from '@/base/Data/Models/title_interface'
import { formatJoinDate } from '@/base/Presentation/utils/date_format'
import { formatTime } from '@/base/Presentation/utils/time_format'

const route = useRoute()
const router = useRouter()

/* =========================
   Form Data
========================= */

const ptwNum = ref<string>('')

const PermitToWorkType = ref<TitleInterface>()

const startDate = ref<Date | null>(null)
const endDate = ref<Date | null>(null)

const startTime = ref<Date | null>(null)
const endTime = ref<Date | null>(null)

const location = ref<string>('')
const description = ref<string>('')

/* =========================
   Validation
========================= */

const requiredFieldErrors = ref<Record<string, string>>({})

const getFieldError = (key: string) => {
  return requiredFieldErrors.value[key] ?? ''
}

const setptwNo = () => {}

/* =========================
   PTW Type
========================= */

const indexPTWTypeController = IndexPTWTypeController.getInstance()

const indexPTWTypeParams = new IndexPTWTypeParams('', 1, 10, 0)

const updatePermitToWorkType = (data: TitleInterface) => {
  PermitToWorkType.value = data
}

/* =========================
   Submit
========================= */

const permitToWorkController = PermitToWorkController.getInstance()

const SubmitFrom = async () => {
  const permitToWorkParams = new PermitToWorkParams({
    project_id: Number(route.params.project_id!),

    ptw_number: ptwNum.value,

    ptw_type_id: PermitToWorkType.value?.id!,

    start_date: formatJoinDate(startDate.value!),
    end_date: formatJoinDate(endDate.value!),

    start_time: formatTime(startTime.value!),
    end_time: formatTime(endTime.value!),

    location: location.value,
    description: description.value,
  })

  await permitToWorkController.PermitToWork(permitToWorkParams, router)
}
</script>

<template>
  <section class="ptw-builder">
    <header class="ptw-hero">
      <div class="ptw-hero-copy">
        <span class="ptw-hero-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M8 7h8M8 11h8M8 15h5" />
            <path d="M9 3.5h6l1 2h2a2 2 0 0 1 2 2V20H4V7.5a2 2 0 0 1 2-2h2l1-2Z" />
          </svg>
        </span>
        <div>
          <span class="ptw-eyebrow">{{ $t('Work authorization') }}</span>
          <h1>{{ $t('Create permit to work') }}</h1>
          <p>{{ $t('Complete the permit details before work begins.') }}</p>
        </div>
      </div>

      <span class="ptw-draft"><i></i>{{ $t('New permit') }}</span>
    </header>

    <form class="ptw-form" @submit.prevent="SubmitFrom">
      <!-- <aside class="ptw-steps" aria-label="Permit form sections">
        <div class="ptw-step active">
          <span>01</span>
          <div>
            <strong>{{ $t('Permit details') }}</strong>
            <small>{{ $t('Number and permit type') }}</small>
          </div>
        </div>
        <div class="ptw-step">
          <span>02</span>
          <div>
            <strong>{{ $t('Work window') }}</strong>
            <small>{{ $t('Approved date and time') }}</small>
          </div>
        </div>
        <div class="ptw-step">
          <span>03</span>
          <div>
            <strong>{{ $t('Work scope') }}</strong>
            <small>{{ $t('Location and description') }}</small>
          </div>
        </div>

        <div class="ptw-safety-note">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 3 4.5 6v5.2c0 4.5 3.1 8.4 7.5 9.8 4.4-1.4 7.5-5.3 7.5-9.8V6L12 3Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <div>
            <strong>{{ $t('Safety first') }}</strong>
            <p>{{ $t('Verify the work scope and schedule before issuing this permit.') }}</p>
          </div>
        </div>
      </aside> -->

      <div class="ptw-content">
        <section class="ptw-card">
          <div class="ptw-card-header">
            <span>01</span>
            <div>
              <h2>{{ $t('Permit details') }}</h2>
              <p>{{ $t('Add a reference number and select the required permit type.') }}</p>
            </div>
          </div>

          <div class="ptw-grid ptw-grid--two">
            <div class="ptw-field " data-required-field="Name">
              <label for="name">
                {{ $t('Permit number') }}
                <span>*</span>
              </label>
              <InputText
                id="name"
                v-model="ptwNum"
                class="ptw-control"
                :placeholder="$t('Enter permit number')"
                @input="setptwNo"
              />
              <p v-if="getFieldError('Name')" class="required-field-message">
                {{ getFieldError('Name') }}
              </p>
            </div>

            <div class="ptw-field" data-required-field="SelectedWhereHouseType">
              <label for="permit_to_work_type">
                {{ $t('permit_to_work_type') }}
                <span>*</span>
              </label>
              <UpdatedCustomInputSelect
                id="permit_to_work_type"
                :required="true"
                :has-header="true"
                :model-value="PermitToWorkType"
                :controller="indexPTWTypeController"
                :params="indexPTWTypeParams"
                :placeholder="$t('Select_permit_to_work_type')"
                @update:model-value="updatePermitToWorkType"
              />
              <p v-if="getFieldError('SelectedWhereHouseType')" class="required-field-message">
                {{ getFieldError('SelectedWhereHouseType') }}
              </p>
            </div>
          </div>
        </section>

        <section class="ptw-card">
          <div class="ptw-card-header">
            <span>02</span>
            <div>
              <h2>{{ $t('Work window') }}</h2>
              <p>{{ $t('Set when this permit becomes active and when it expires.') }}</p>
            </div>
          </div>

          <div class="ptw-schedule">
            <div class="ptw-schedule-group start">
              <div class="ptw-schedule-title"><i></i>{{ $t('Starts') }}</div>
              <div class="ptw-grid ptw-grid--two">
                <div class="ptw-field">
                  <label for="start_date">{{ $t('start_date') }}</label>
                  <DatePicker
                    id="start_date"
                    v-model="startDate"
                    date-format="yy-mm-dd"
                    show-icon
                    fluid
                    :placeholder="$t('start_date')"
                  />
                </div>
                <div class="ptw-field">
                  <label for="start_time">{{ $t('start_time') }}</label>
                  <DatePicker
                    id="start_time"
                    v-model="startTime"
                    time-only
                    hour-format="24"
                    show-icon
                    fluid
                    :placeholder="$t('start_time')"
                  />
                </div>
              </div>
            </div>

            <div class="ptw-schedule-group end">
              <div class="ptw-schedule-title"><i></i>{{ $t('Ends') }}</div>
              <div class="ptw-grid ptw-grid--two">
                <div class="ptw-field">
                  <label for="end_date">{{ $t('end_date') }}</label>
                  <DatePicker
                    id="end_date"
                    v-model="endDate"
                    date-format="yy-mm-dd"
                    show-icon
                    fluid
                    :min-date="startDate ?? undefined"
                    :placeholder="$t('end_date')"
                  />
                </div>
                <div class="ptw-field">
                  <label for="end_time">{{ $t('end_time') }}</label>
                  <DatePicker
                    id="end_time"
                    v-model="endTime"
                    time-only
                    hour-format="24"
                    show-icon
                    fluid
                    :placeholder="$t('end_time')"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="ptw-card">
          <div class="ptw-card-header">
            <span>03</span>
            <div>
              <h2>{{ $t('Work scope') }}</h2>
              <p>{{ $t('Describe the work location and activity clearly.') }}</p>
            </div>
          </div>

          <div class="ptw-grid">
            <div class="ptw-field">
              <label for="location">{{ $t('location') }}</label>
              <InputText
                id="location"
                v-model="location"
                class="ptw-control"
                :placeholder="$t('Enter work location')"
              />
            </div>
            <div class="ptw-field">
              <label for="description">{{ $t('description') }}</label>
              <textarea
                id="description"
                v-model="description"
                class="ptw-control ptw-textarea"
                rows="4"
                :placeholder="$t('Describe the work activity and safety requirements')"
              ></textarea>
            </div>
          </div>
        </section>

        <footer class="ptw-actions">
          <p>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16.5v.1" />
            </svg>
            {{ $t('Review all information before creating the permit.') }}
          </p>
          <button type="submit" class="ptw-submit">
            {{ $t('Create permit') }}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M14 7l5 5-5 5" />
            </svg>
          </button>
        </footer>
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">
.ptw-builder {
  // width: min(1120px, 100%);
  margin: 18px auto;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 15%, var(--main-border));
  border-radius: 28px;
  background: color-mix(in srgb, var(--PrimaryColor) 2.5%, var(--surface-2));
  box-shadow: 0 25px 60px color-mix(in srgb, var(--text-strong) 9%, transparent);
}

.ptw-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  overflow: hidden;
  padding: 25px 28px;
  color: white;
  background:
    radial-gradient(circle at 92% 5%, color-mix(in srgb, white 16%, transparent), transparent 27%),
    linear-gradient(125deg, var(--brand-primary-900), var(--PrimaryColor));
}

.ptw-hero::after {
  position: absolute;
  right: -65px;
  bottom: -125px;
  width: 230px;
  height: 230px;
  border: 1px solid color-mix(in srgb, white 14%, transparent);
  border-radius: 50%;
  content: '';
}

.ptw-hero-copy {
  display: flex;
  align-items: center;
  gap: 14px;
}

.ptw-hero-icon {
  display: grid;
  width: 52px;
  height: 52px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid color-mix(in srgb, white 24%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, white 12%, transparent);
  backdrop-filter: blur(8px);
}

.ptw-hero-icon svg {
  width: 27px;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ptw-eyebrow {
  color: color-mix(in srgb, white 76%, transparent);
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.ptw-hero h1,
.ptw-hero p {
  margin: 0;
}

.ptw-hero h1 {
  margin-top: 2px;
  font: clamp(1.15rem, 2vw, 1.45rem) 'Bold';
}

.ptw-hero p {
  margin-top: 4px;
  color: color-mix(in srgb, white 72%, transparent);
  font-size: 0.72rem;
}

.ptw-draft {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid color-mix(in srgb, white 23%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, white 10%, transparent);
  font-size: 0.65rem;
  font-weight: 800;
  backdrop-filter: blur(8px);
}

.ptw-draft i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #64e8a2;
  box-shadow: 0 0 0 4px color-mix(in srgb, #64e8a2 17%, transparent);
}

.ptw-form {
  display: grid;
  grid-template-columns: 220px minmax(1, 1fr);
  gap: 16px;
  padding: 18px;
}

.ptw-steps {
  position: relative;
  align-self: start;
  padding: 18px;
  border: 1px solid var(--main-border);
  border-radius: 19px;
  background: var(--surface-1);
}

.ptw-step {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 25px;
}

.ptw-step:not(:nth-child(3))::after {
  position: absolute;
  top: 34px;
  bottom: 2px;
  inset-inline-start: 16px;
  width: 1px;
  background: var(--main-border);
  content: '';
}

.ptw-step > span {
  position: relative;
  z-index: 1;
  display: grid;
  width: 33px;
  height: 33px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid var(--main-border);
  border-radius: 11px;
  color: var(--text-soft);
  background: var(--surface-2);
  font-size: 0.62rem;
  font-weight: 900;
}

.ptw-step.active > span {
  border-color: transparent;
  color: white;
  background: var(--PrimaryColor);
  box-shadow: 0 7px 15px color-mix(in srgb, var(--PrimaryColor) 20%, transparent);
}

.ptw-step strong,
.ptw-step small {
  display: block;
}

.ptw-step strong {
  color: var(--text-strong);
  font-size: 0.68rem;
}

.ptw-step small {
  margin-top: 3px;
  color: var(--text-soft);
  font-size: 0.55rem;
}

.ptw-safety-note {
  display: flex;
  gap: 9px;
  margin-top: 2px;
  padding: 12px;
  border: 1px solid color-mix(in srgb, var(--status-success) 18%, var(--main-border));
  border-radius: 14px;
  background: color-mix(in srgb, var(--status-success) 5%, var(--surface-2));
}

.ptw-safety-note svg {
  width: 21px;
  flex: 0 0 auto;
  color: var(--status-success);
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ptw-safety-note strong {
  color: var(--text-strong);
  font-size: 0.62rem;
}

.ptw-safety-note p {
  margin: 3px 0 0;
  color: var(--text-soft);
  font-size: 0.54rem;
  line-height: 1.45;
}

.ptw-content {
  display: grid;
  min-width: 0;
  gap: 12px;
}

.ptw-card {
  padding: 19px;
  border: 1px solid var(--main-border);
  border-radius: 19px;
  background: var(--surface-1);
  box-shadow: 0 8px 22px color-mix(in srgb, var(--text-strong) 4%, transparent);
}

.ptw-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.ptw-card-header > span {
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 11px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 9%, var(--surface-2));
  font-size: 0.63rem;
  font-weight: 900;
}

.ptw-card-header h2,
.ptw-card-header p {
  margin: 0;
}

.ptw-card-header h2 {
  color: var(--text-strong);
  font-size: 0.83rem;
}

.ptw-card-header p {
  margin-top: 3px;
  color: var(--text-soft);
  font-size: 0.6rem;
}

.ptw-grid {
  display: grid;
  gap: 14px;
}

.ptw-grid--two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.ptw-field {
  min-width: 0;
}

.ptw-field > label {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 7px;
  color: var(--text-strong);
  font-size: 0.68rem;
  font-weight: 800;
}

.ptw-field > label span {
  color: var(--status-danger);
}

.ptw-control,
:deep(.p-datepicker-input),
:deep(.input-select) {
  width: 100%;
  min-height: 46px;
  border: 1px solid color-mix(in srgb, var(--text-soft) 20%, var(--main-border)) !important;
  border-radius: 12px !important;
  color: var(--text-strong) !important;
  background: var(--surface-2) !important;
  box-shadow: none !important;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.ptw-control {
  padding: 10px 12px;
}

.ptw-control:focus,
:deep(.p-datepicker-input:focus),
:deep(.input-select.p-focus) {
  outline: none;
  border-color: var(--PrimaryColor) !important;
  background: var(--surface-1) !important;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--PrimaryColor) 9%, transparent) !important;
}

.ptw-textarea {
  min-height: 105px;
  resize: vertical;
  font: inherit;
  line-height: 1.55;
}

:deep(.updated-custom-input-select .input-label) {
  display: none;
}

:deep(.p-datepicker) {
  width: 100%;
}

:deep(.p-datepicker-dropdown) {
  border: 0 !important;
  border-inline-start: 1px solid var(--main-border) !important;
  color: var(--PrimaryColor) !important;
  background: transparent !important;
}

.ptw-schedule {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.ptw-schedule-group {
  padding: 13px;
  border: 1px solid var(--main-border);
  border-radius: 15px;
  background: color-mix(in srgb, var(--PrimaryColor) 2.5%, var(--surface-2));
}

.ptw-schedule-group.start {
  border-color: color-mix(in srgb, var(--status-success) 20%, var(--main-border));
}

.ptw-schedule-group.end {
  border-color: color-mix(in srgb, var(--status-danger) 16%, var(--main-border));
}

.ptw-schedule-title {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 10px;
  color: var(--text-soft);
  font-size: 0.59rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ptw-schedule-title i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--status-success);
}

.ptw-schedule-group.end .ptw-schedule-title i {
  background: var(--status-danger);
}

.required-field-message {
  margin: 5px 0 0;
  color: var(--status-danger);
  font-size: 0.61rem;
}

.ptw-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 14px 16px;
  border: 1px solid var(--main-border);
  border-radius: 17px;
  background: var(--surface-1);
}

.ptw-actions p {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0;
  color: var(--text-soft);
  font-size: 0.61rem;
}

.ptw-actions p svg {
  width: 18px;
  flex: 0 0 auto;
  color: var(--PrimaryColor);
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
}

.ptw-submit {
  display: inline-flex;
  min-width: 164px;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 10px 17px;
  border: 0;
  border-radius: 12px;
  color: white;
  background: linear-gradient(135deg, var(--PrimaryColor), var(--brand-primary-700));
  box-shadow: 0 10px 20px color-mix(in srgb, var(--PrimaryColor) 20%, transparent);
  font-weight: 900;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.ptw-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 25px color-mix(in srgb, var(--PrimaryColor) 26%, transparent);
}

.ptw-submit svg {
  width: 17px;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

[dir='rtl'] .ptw-submit svg {
  transform: rotate(180deg);
}

@media (max-width: 900px) {
  .ptw-form {
    grid-template-columns: 1fr;
  }

  .ptw-steps {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .ptw-step {
    padding: 0;
  }

  .ptw-step::after,
  .ptw-safety-note {
    display: none;
  }
}

@media (max-width: 680px) {
  .ptw-builder {
    margin: 8px auto;
    border-radius: 20px;
  }

  .ptw-hero {
    align-items: flex-start;
    padding: 21px 18px;
  }

  .ptw-draft {
    display: none;
  }

  .ptw-form {
    padding: 12px;
  }

  .ptw-steps {
    grid-template-columns: 1fr;
    padding: 13px;
  }

  .ptw-step:not(.active) {
    display: none;
  }

  .ptw-grid--two,
  .ptw-schedule {
    grid-template-columns: 1fr;
  }

  .ptw-card {
    padding: 16px;
  }

  .ptw-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .ptw-submit {
    width: 100%;
  }
}
</style>
