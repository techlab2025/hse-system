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

const emit = defineEmits(['update:data'])
const props = defineProps<{
  isOpen?: boolean
  injuries?: InjuryDetailsModel[]
}>()
const fetchOriganizatioEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const fetchOrganizationEmployeeParams = new IndexOrganizatoinEmployeeParams('', 1, 10, 0)
const employeeOptions = ref<TitleInterface[]>([])
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

const addNewAnswer = () => {
  Answers.value.push({
    ...createEmptyAnswer(),
    text: '',
  })
  isSelectHasContent.value.push(false)
  UpdateData()
}

const DeleteItem = (index: number) => {
  Answers.value.splice(index, 1)
  isSelectHasContent.value.splice(index, 1)
  UpdateData()
}

const UpdateData = () => {
  Answers.value.forEach(ensureEmployee)

  emit('update:data', Answers.value)
}

const UpdateInjury = (item: TitleInterface, index: number) => {
  console.log(item)
  Answers.value[index].infectionTypeId = new TitleInterface({ id: item.id, title: item.title })
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
  const employeeId =
    item?.organization_employee?.organization_employee_id || item?.organization_employee?.id || 0
  const employeeTitle = item?.organization_employee?.name || item?.employee_name || ''

  return {
    employee: new TitleInterface({ id: employeeId, title: employeeTitle }),
    employeeName: item?.employee_name || employeeTitle,
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

onMounted(fetchEmployees)
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
                  v-if="index >= 0 && index !== Answers.length - 1"
                  @click="DeleteItem(index)"
                />
                <AddAnswer v-else @click="addNewAnswer" class="cursor-pointer" />
              </div>
            </div>

            <!-- timeline-content -->
            <div class="injury-timeline-card grid grid-cols-12 gap-3">
              <div class="injury-card-header col-span-12">
                <div>
                  <span>{{ $t('injury record') }}</span>
                  <strong>#{{ index + 1 }}</strong>
                </div>
                <p v-if="item.isWorkStopped">{{ $t('work stopped') }}</p>
              </div>
              <div class="col-span-12 md:col-span-4 input-wrapper w-full">
                <label for="">{{ $t('Nature of injury & body part') }}</label>
                <input
                  type="text"
                  class="input"
                  :placeholder="$t('add your title')"
                  v-model="item.text"
                  @input="UpdateData"
                />
              </div>
              <div class="col-span-12 md:col-span-4 input-wrapper w-full">
                <UpdatedCustomInputSelect
                  :staticOptions="employeeOptions"
                  v-model="item.employee"
                  placeholder="Select Employee"
                  class="mt-4 mr-2 input"
                  :label="$t('Employee')"
                  :reload="false"
                  @update:model-value="UpdateData"
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
                        {{ $t('injured person name /id') }}
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
              <div class="col-span-12 md:col-span-4 input-wrapper w-full">
                <!-- <CustomSelectInput :modelValue="item.infectionTypeId" class="input" :controller="indexInjuryController"
                  :params="indexInjuryParams" :label="$t('injury Type')" id="injury"
                  :placeholder="$t('select your injury')" @update:modelValue="UpdateInjury($event, index)" /> -->

                <UpdatedCustomInputSelect
                  :modelValue="item.infectionTypeId"
                  class="input"
                  :controller="indexInjuryController"
                  :params="indexInjuryParams"
                  :label="$t('injury Classification')"
                  id="injury"
                  :placeholder="$t('select your injury Classification')"
                  @update:modelValue="UpdateInjury($event, index)"
                  @close="InjuryVisable = false"
                  :isDialog="true"
                  v-model:dialogVisible="InjuryVisable"
                >
                  <template #LabelHeader>
                    <span class="add-dialog" @click="InjuryVisable = true">{{ $t('New') }}</span>
                  </template>
                  <template #Dialog>
                    <AddInjury
                      @close:dialog="InjuryVisable = false"
                      @update:data="InjuryVisable = false"
                    />
                  </template>
                </UpdatedCustomInputSelect>
              </div>
              <div class="col-span-12 md:col-span-12 input-wrapper w-full">
                <label for="">{{ $t('upload image') }}</label>
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
                <label class="w-full" for="is_sstoped">{{ $t('is_work_stopped') }}</label>
                <Checkbox
                  binary
                  disabled
                  :modelValue="item.isWorkStopped"
                  @change="UpdateData"
                  inputId="is_sstoped"
                  :name="`is_sstoped`"
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
  background: linear-gradient(180deg, #1d4ed8 0%, #14b8a6 48%, rgba(203, 213, 225, 0.35) 100%);
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
  background: #ffffff;
  border: 1px solid rgba(29, 78, 216, 0.22);
  box-shadow: 0 10px 24px rgba(29, 78, 216, 0.14);
}

.injury-timeline-container .timeline-dot-inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1d4ed8, #14b8a6);
}

.injury-timeline-container .timeline-pulse {
  position: absolute;
  inset: -7px;
  border: 1px solid rgba(29, 78, 216, 0.18);
  border-radius: inherit;
  animation: injuryPulse 1.8s ease-out infinite;
}

.injury-timeline-container .timeline-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 12px;
  background: #ffffff;
  color: #1d4ed8;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.injury-timeline-container .timeline-icon:hover {
  /* transform: translateY(-1px); */
  border-color: rgba(29, 78, 216, 0.24);
  box-shadow: 0 16px 30px rgba(29, 78, 216, 0.14);
}

.injury-timeline-card {
  position: relative;
  overflow: visible;
  padding: 18px;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 22px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.94)),
    radial-gradient(circle at 100% 0%, rgba(20, 184, 166, 0.09), transparent 30%);
  box-shadow: 0 20px 46px rgba(15, 23, 42, 0.07);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.injury-timeline-card:hover {
  transform: translateY(-2px);
  border-color: rgba(29, 78, 216, 0.18);
  box-shadow: 0 24px 56px rgba(15, 23, 42, 0.1);
}

.injury-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
}

.injury-card-header div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.injury-card-header span {
  color: #64748b;
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
  color: #1d4ed8;
  background: #eff6ff;
  font-weight: 900;
}

.injury-card-header p {
  padding: 7px 11px;
  border-radius: 999px;
  color: #b42318;
  background: #fff1f2;
  font-size: 12px;
  font-weight: 800;
}

.injury-timeline-card .input-wrapper {
  margin: 0;
}

.injury-timeline-card .input-wrapper label {
  display: inline-flex;
  margin-bottom: 7px;
  color: #334155;
  font-size: 13px;
  font-weight: 800;
}

.injury-timeline-card .input {
  min-height: 46px;
  border: 1px solid rgba(203, 213, 225, 0.9);
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.04);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.injury-timeline-card .input:focus {
  border-color: rgba(29, 78, 216, 0.42);
  box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.08);
}

.injury-timeline-card .add-dialog {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 6px 11px;
  border-radius: 999px;
  color: #1d4ed8;
  background: #eff6ff;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.injury-timeline-card .emp-name,
.injury-timeline-card .emp-select {
  min-height: 32px;
  padding: 7px 12px;
  border-radius: 999px;
  color: #64748b;
  background: #f8fafc;
  font-size: 12px;
  font-weight: 800;
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.injury-timeline-card .emp-name.active,
.injury-timeline-card .emp-select.active {
  color: #ffffff;
  background: #1d4ed8;
  box-shadow: 0 10px 22px rgba(29, 78, 216, 0.18);
}

.injury-timeline-card .is-stopped {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 54px;
  padding: 12px 14px;
  border: 1px solid rgba(245, 158, 11, 0.22);
  border-radius: 16px;
  background: #fffbeb;
  cursor: pointer;
}

.injury-timeline-card .is-stopped label {
  margin: 0;
  color: #92400e;
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
