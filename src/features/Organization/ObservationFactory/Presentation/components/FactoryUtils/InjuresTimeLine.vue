<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import AddAnswer from '@/shared/icons/AddAnswer.vue'
import DeleteItemAction from '@/shared/icons/DeleteItemAction.vue'
import { onMounted, ref, watch } from 'vue'
import DatePicker from 'primevue/datepicker'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import IndexInjuryController from '@/features/Organization/Injury/Presentation/controllers/indexInjuryController'
import IndexInjuryParams from '@/features/Organization/Injury/Core/params/indexInjuryParams'
import MultiImagesInput from '@/shared/FormInputs/MultiImagesInput.vue'
import Checkbox from 'primevue/checkbox'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import AddInjury from '@/views/Organization/Injury/AddInjury.vue'
import type InjuryDetailsModel from '../../../Data/models/InjuryModel'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'

const emit = defineEmits(['update:data'])
const props = defineProps<{
  isOpen?: boolean
  injuries?: InjuryDetailsModel[]
}>()
const fetchOriganizatioEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const fetchOrganizationEmployeeParams = new IndexOrganizatoinEmployeeParams('', 1, 10, 0)
const employeeOptions = ref<TitleInterface[]>([])
const injuryOptions = ref<TitleInterface[]>([])
type AnswerModel = {
  text: string
  employee: TitleInterface
  employeeName: string
  isWorkStopped: boolean
  images: any[]
  infectionTypeId: TitleInterface
}
const createEmptyAnswer = (): AnswerModel => ({
  text: ' ',
  employee: new TitleInterface({ id: 0, title: '' }),
  infectionTypeId: new TitleInterface({ id: 0, title: '' }),
  employeeName: '',
  isWorkStopped: false,
  images: [],
})

const Answers = ref<AnswerModel[]>([createEmptyAnswer()])

const fetchEmployees = async () => {
  employeeOptions.value = await fetchOriganizatioEmployeeController.fetch(
    fetchOrganizationEmployeeParams,
  )
}

const fetchInjuryTypes = async () => {
  injuryOptions.value = await indexInjuryController.fetch(indexInjuryParams)
}

const addNewAnswer = () => {
  Answers.value.push({
    ...createEmptyAnswer(),
    text: '',
  })
  isSelectHasContent.value.push(false)
  UpdateData()
}

const DeleteItem = (index: number) => {
  if (Answers.value.length <= 1) return
  Answers.value.splice(index, 1)
  isSelectHasContent.value.splice(index, 1)
  UpdateData()
}

const UpdateData = () => {
  Answers.value.forEach(ensureEmployee)

  emit('update:data', Answers.value)
}

const getSelectedEmployeeIds = (currentIndex: number) =>
  Answers.value
    .filter((_, index) => index !== currentIndex)
    .map((item) => item.employee?.id)
    .filter((id): id is number => !!id)

const UpdateInjury = (item: TitleInterface | null, index: number) => {
  Answers.value[index].infectionTypeId = item
    ? new TitleInterface({ id: item.id, title: item.title })
    : new TitleInterface({ id: 0, title: '' })
  UpdateData()
}

const handleInjuryCreated = async () => {
  InjuryVisable.value = false
  await fetchInjuryTypes()
}

const isSelectHasContent = ref<boolean[]>([])

const indexInjuryController = IndexInjuryController.getInstance()
const indexInjuryParams = new IndexInjuryParams('', 1, 10, 0)

const setImages = async (data: File[] | string, index: number) => {
  Answers.value[index].images =
    typeof data === 'string' ? [data] : ((await filesToBase64(data)) as any[])
  UpdateData()
}
const ensureEmployee = (item: any) => {
  if (!item.employee) {
    item.employee = new TitleInterface({ id: 0, title: '' })
  }
}
const InjuryVisable = ref(false)

const toggleMode = (index: number, isManual: boolean) => {
  // 1. Update the toggle state
  isSelectHasContent.value[index] = isManual

  // 2. Reset the employee object to a clean slate
  // This prevents the "Select" mode from holding onto old data
  Answers.value[index].employee = new TitleInterface({ id: 0, title: '' })

  // 3. Notify parent
  UpdateData()
}

const toggleWorkStopped = (index: number) => {
  Answers.value[index].isWorkStopped = !Answers.value[index].isWorkStopped
  UpdateData()
}

const mapInjuryToAnswer = (item: InjuryDetailsModel): AnswerModel => {
  const organizationEmployee = item?.organization_employee as any
  const employeeId = organizationEmployee?.organization_employee_id || organizationEmployee?.id || 0
  const employeeTitle =
    organizationEmployee?.name ||
    organizationEmployee?.title ||
    (item as any)?.employee?.name ||
    (item as any)?.employee?.title ||
    item?.employee_name ||
    (item as any)?.name ||
    (item as any)?.title ||
    ''
  const manualEmployeeName = item?.employee_name || (!employeeId ? employeeTitle : '')

  return {
    employee: new TitleInterface({ id: employeeId, title: employeeTitle }),
    employeeName: manualEmployeeName,
    images: item?.media?.map((file: any) => file?.url || file).filter(Boolean) || [],
    infectionTypeId:
      new TitleInterface({ id: item?.injury_type?.id, title: item?.injury_type?.title }) ||
      new TitleInterface({ id: 0, title: '' }),
    isWorkStopped: !!item?.is_work_stopped,
    text: item?.note || '',
  }
}

watch(
  () => props.injuries,
  (newInjuries) => {
    if (props.isOpen && newInjuries?.length) {
      Answers.value = newInjuries.map(mapInjuryToAnswer)
      isSelectHasContent.value = Answers.value.map(
        (item) => !item.employee?.id && !!item.employee?.title,
      )
      UpdateData()
      return
    }

    if (!props.isOpen) {
      emit('update:data', Answers.value)
    }
  },
  { immediate: true, deep: true },
)

onMounted(async () => {
  await Promise.all([fetchEmployees(), fetchInjuryTypes()])
})
</script>
<template>
  <div class="template-container col-span-6 injuries-timeline">
    <div class="heirarchy-info">
      <div class="timeline-container injury-timeline-container">
        <div class="timeline-wrapper">
          <div class="timeline-line"></div>

          <div
            class="timeline-item"
            v-for="(item, index) in Answers"
            :key="index"
            :class="{ active: index === 0 }"
            :style="{ animationDelay: `${index * 0.15}s` }"
          >
            <div class="timeline-marker">
              <div class="timeline-dot">
                <div class="timeline-dot-inner"></div>
                <div class="timeline-pulse"></div>
              </div>

              <div class="timeline-icon">
                <DeleteItemAction
                  class="cursor-pointer"
                  v-if="Answers.length > 1"
                  @click="DeleteItem(index)"
                />
                <AddAnswer
                  v-if="index === Answers.length - 1"
                  @click="addNewAnswer"
                  class="cursor-pointer"
                />
              </div>
            </div>

            <!-- timeline-content -->
            <div class="injury-timeline-card grid grid-cols-12 gap-3">
              <div class="injury-card-header col-span-12">
                <div>
                  <span>{{ $t('injury record') }}</span>
                  <strong>#{{ index + 1 }}</strong>
                </div>
                <p v-if="item.isWorkStopped">{{ $t('stopped work ') }}</p>
              </div>
              <div class="col-span-12 md:col-span-12 input-wrapper w-full">
                <UpdatedCustomInputSelect
                  :staticOptions="employeeOptions"
                  v-model="item.employee"
                  placeholder="Select Employee"
                  class="mt-4 mr-2 input"
                  :label="$t('Injured Person')"
                  help-text="Select the injured employee, or enter the person's name manually if they are not an employee."
                  :reload="true"
                  :excludedOptionIds="getSelectedEmployeeIds(index)"
                  @update:model-value="UpdateData"
                  @update:reload="fetchEmployees"
                  :hascontent="isSelectHasContent[index]"
                >
                  <!-- <template #reloadHeader>
                    <div class="flex gap-2 items-center">
                      <button :class="isSelectHasContent[index] ? 'active' : ''" class="emp-name"
                        @click.prevent="isSelectHasContent[index] = true; item.employee.title = ''">{{
                          $t('name_of_the_injured_person')
                        }}</button>
                      <button :class="isSelectHasContent[index] ? '' : 'active'" class="emp-select"
                        @click.prevent="isSelectHasContent[index] = false; item.employee.title = ''">{{ $t('select')
                        }}</button>
                    </div>
                  </template> -->
                  <template #reloadHeader>
                    <div class="flex gap-2 items-center">
                      <button
                        :class="isSelectHasContent[index] ? 'active' : ''"
                        class="emp-name"
                        @click.prevent="toggleMode(index, true)"
                      >
                        {{ $t('unemployed_injured_name ') }}
                      </button>

                      <button
                        :class="isSelectHasContent[index] ? '' : 'active'"
                        class="emp-select"
                        @click.prevent="toggleMode(index, false)"
                      >
                        {{ $t('select') }}
                      </button>
                    </div>
                  </template>
                  <template #content>
                    <input
                      type="text"
                      v-model="item.employee.title"
                      class="input"
                      placeholder="Select Employee"
                      @input="UpdateData"
                    />
                  </template>
                </UpdatedCustomInputSelect>
              </div>
              <div class="col-span-12 md:col-span-12 input-wrapper w-full">
                <!-- <CustomSelectInput :modelValue="item.infectionTypeId" class="input" :controller="indexInjuryController"
                  :params="indexInjuryParams" :label="$t('injury Type')" id="injury"
                  :placeholder="$t('select your injury')" @update:modelValue="UpdateInjury($event, index)" /> -->

                <UpdatedCustomInputSelect
                  :modelValue="item.infectionTypeId"
                  :staticOptions="injuryOptions"
                  class="input"
                  :label="$t('Type and Nature of Injury')"
                  help-text="Choose the classification that best describes the injury sustained."
                  id="injury"
                  :placeholder="$t('select your injury Classification')"
                  @update:modelValue="UpdateInjury($event, index)"
                  @update:reload="fetchInjuryTypes"
                  @close="InjuryVisable = false"
                  :isDialog="true"
                  v-model:dialogVisible="InjuryVisable"
                  :reload="true"
                >
                  <template #LabelHeader>
                    <span class="add-dialog" @click="InjuryVisable = true">{{ $t('New') }}</span>
                  </template>
                  <template #Dialog>
                    <AddInjury
                      @close:dialog="InjuryVisable = false"
                      @update:data="handleInjuryCreated"
                    />
                  </template>
                </UpdatedCustomInputSelect>
              </div>
              <div class="col-span-12 md:col-span-12 input-wrapper w-full">
                <div class="flex items-center gap-2">
                  <label :for="`injury-description-${index}`">{{
                    $t('Description of Injury')
                  }}</label>
                  <FieldHelpIcon
                    text="Describe the injury, affected body part, and any relevant medical details."
                  />
                </div>
                <input
                  type="text"
                  :id="`injury-description-${index}`"
                  class="input"
                  :placeholder="$t('add your title')"
                  v-model="item.text"
                  @input="UpdateData"
                />
              </div>

              <div class="col-span-12 md:col-span-12 input-wrapper w-full">
                <div class="flex items-center gap-2">
                  <label>{{ $t('Evidence Retrieval (Photos)') }}</label>
                  <FieldHelpIcon
                    text="Attach photos that document the injury or related evidence, where appropriate and permitted."
                  />
                </div>
                <MultiImagesInput
                  :initialImages="item.images"
                  @update:images="setImages($event, index)"
                  :index="index + 2000"
                />
              </div>
              <div
                v-if="!props.isOpen"
                class="col-span-12 md:col-span-12 input-wrapper w-full is-stopped is-stopped-white"
                @click="toggleWorkStopped(index)"
              >
                <div class="flex items-center gap-2 w-full">
                  <label :for="`is-stopped-${index}`">{{
                    $t('Did The Injury Cause He Stopped To Work?')
                  }}</label>
                  <FieldHelpIcon
                    text="Indicate whether the injured person had to stop working because of the injury."
                  />
                </div>
                <Checkbox
                  binary
                  disabled
                  :modelValue="item.isWorkStopped"
                  @change="UpdateData"
                  :inputId="`is-stopped-${index}`"
                  :name="`is-stopped-${index}`"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-wrapper:nth-child(2) {
  grid-column: span 12 !important;
}
.injuries-timeline {
  position: relative;
  width: 100%;
}

.injuries-timeline .heirarchy-info {
  padding: 0;
}

.injury-timeline-container {
  position: relative;
  width: 100%;
  padding: 8px 0;
}

.injury-timeline-container .timeline-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-inline-start: 54px;
}

.injury-timeline-container .timeline-line {
  position: absolute;
  inset-block: 28px;
  inset-inline-start: 22px;
  width: 2px;
  border-radius: 999px;
  background: linear-gradient(180deg, var(--brand-primary-500) 0%, var(--status-success) 48%, color-mix(in srgb, var(--brand-primary-200) 35%, transparent) 100%);
}

.injury-timeline-container .timeline-item {
  position: relative;
  animation: injuryFadeUp 0.35s ease both;
}

.injury-timeline-container .timeline-marker {
  position: absolute;
  inset-inline-start: -54px;
  top: 18px;
  display: grid;
  place-items: center;
  width: 44px;
  gap: 8px;
}

.injury-timeline-container .timeline-dot {
  position: relative;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--surface-1);
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 22%, transparent);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--brand-primary-500) 14%, transparent);
}

.injury-timeline-container .timeline-dot-inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand-primary-500), var(--status-success));
}

.injury-timeline-container .timeline-pulse {
  position: absolute;
  inset: -7px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 18%, transparent);
  border-radius: inherit;
  animation: injuryPulse 1.8s ease-out infinite;
}

.injury-timeline-container .timeline-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 95%, transparent);
  border-radius: 12px;
  background: var(--surface-1);
  color: var(--brand-primary-500);
  box-shadow: 0 12px 24px color-mix(in srgb, var(--brand-primary-900) 8%, transparent);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.injury-timeline-container .timeline-icon:hover {
  /* transform: translateY(-1px); */
  border-color: color-mix(in srgb, var(--brand-primary-500) 24%, transparent);
  box-shadow: 0 16px 30px color-mix(in srgb, var(--brand-primary-500) 14%, transparent);
}

.injury-timeline-card {
  position: relative;
  overflow: visible;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-100) 95%, transparent);
  border-radius: 22px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--surface-1) 98%, transparent), color-mix(in srgb, var(--brand-primary-50) 94%, transparent)),
    radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--status-success) 9%, transparent), transparent 30%);
  box-shadow: 0 20px 46px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.injury-timeline-card:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--brand-primary-500) 18%, transparent);
  box-shadow: 0 24px 56px color-mix(in srgb, var(--brand-primary-900) 10%, transparent);
}

.injury-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid color-mix(in srgb, var(--brand-primary-100) 90%, transparent);
}

.injury-card-header div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.injury-card-header span {
  color: var(--brand-primary-500);
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
}

.injury-card-header strong {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 28px;
  padding-inline: 10px;
  border-radius: 999px;
  color: var(--brand-primary-500);
  background: var(--brand-primary-50);
  font-weight: 900;
}

.injury-card-header p {
  padding: 7px 11px;
  border-radius: 999px;
  color: var(--status-danger);
  background: var(--status-danger-soft);
  font-size: 12px;
  font-weight: 800;
}

.injury-timeline-card .input-wrapper {
  margin: 0;
}

.injury-timeline-card .input-wrapper label {
  display: inline-flex;
  margin-bottom: 7px;
  color: var(--brand-primary-700);
  font-size: 13px;
  font-weight: 800;
}

.injury-timeline-card .input {
  min-height: 46px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-200) 90%, transparent);
  border-radius: 14px;
  background: var(--surface-1);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--brand-primary-900) 4%, transparent);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.injury-timeline-card .input:focus {
  border-color: color-mix(in srgb, var(--brand-primary-500) 42%, transparent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand-primary-500) 8%, transparent);
}

.injury-timeline-card .add-dialog {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 6px 11px;
  border-radius: 999px;
  color: var(--brand-primary-500);
  background: var(--brand-primary-50);
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.injury-timeline-card .emp-name,
.injury-timeline-card .emp-select {
  min-height: 32px;
  padding: 7px 12px;
  border-radius: 999px;
  color: var(--brand-primary-500);
  background: var(--brand-primary-50);
  font-size: 12px;
  font-weight: 800;
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.injury-timeline-card .emp-name.active,
.injury-timeline-card .emp-select.active {
  color: var(--text-on-brand);
  background: var(--brand-primary-500);
  box-shadow: 0 10px 22px color-mix(in srgb, var(--brand-primary-500) 18%, transparent);
}

.injury-timeline-card .is-stopped {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 54px;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, var(--brand-accent-500) 22%, transparent);
  border-radius: 16px;
  background: var(--brand-accent-50);
  cursor: pointer;
}

.injury-timeline-card .is-stopped label {
  margin: 0;
  color: var(--brand-accent-700);
}

@media screen and (max-width: 720px) {
  .injury-timeline-container .timeline-wrapper {
    padding-inline-start: 0;
  }

  .injury-timeline-container .timeline-line,
  .injury-timeline-container .timeline-marker {
    display: none;
  }

  .injury-timeline-card {
    padding: 14px;
  }

  .injury-card-header {
    align-items: flex-start;
    flex-direction: column;
  }
}

@keyframes injuryFadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes injuryPulse {
  0% {
    opacity: 0.8;
    transform: scale(0.75);
  }

  100% {
    opacity: 0;
    transform: scale(1.35);
  }
}
</style>
