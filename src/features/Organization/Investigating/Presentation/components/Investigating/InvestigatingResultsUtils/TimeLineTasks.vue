<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import AddAnswer from '@/shared/icons/AddAnswer.vue'
import DeleteItemAction from '@/shared/icons/DeleteItemAction.vue'
import { onMounted, ref } from 'vue'
import DatePicker from 'primevue/datepicker'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'

const emit = defineEmits(['update:data'])

const { capaStyles, staticEmployeeOptions, useStaticEmployeeOptions } = defineProps<{
  capaStyles?: boolean
  staticEmployeeOptions?: TitleInterface[]
  useStaticEmployeeOptions?: boolean
}>()
const fetchOriganizatioEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const fetchOrganizationEmployeeParams = new IndexOrganizatoinEmployeeParams('', 1, 10, 1)
const employeeOptions = ref<TitleInterface[]>([])
const createEmptyAnswer = () => ({
  text: ' ',
  employee: new TitleInterface({ id: 0, title: '' }),
  date: capaStyles ? null : new Date(),
  ResponablePerson: new TitleInterface({ id: 0, title: '' }),
})

const Answers = ref([createEmptyAnswer()])

const addNewAnswer = () => {
  Answers.value.push({
    ...createEmptyAnswer(),
    text: '',
  })
  UpdateData()
}

const DeleteItem = (index: number) => {
  if (Answers.value.length <= 1) return
  Answers.value.splice(index, 1)
  UpdateData()
}

const UpdateData = () => {
  emit('update:data', Answers.value)
}

const fetchEmployees = async () => {
  if (useStaticEmployeeOptions) {
    employeeOptions.value = staticEmployeeOptions ?? []
    return
  }

  employeeOptions.value = await fetchOriganizatioEmployeeController.fetch(
    fetchOrganizationEmployeeParams,
  )
}

onMounted(async () => {
  await fetchEmployees()
  emit('update:data', Answers.value)
})
</script>
<template>
  <div class="template-container">
    <div class="heirarchy-info">
      <div class="timeline-container">
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

            <div class="timeline-content" :class="{ 'capa-timeline-content': capaStyles }">
              <div class="timeline-content-text input-wrapper">
                <div class="flex items-center gap-2">
                  <label :for="`action-${index}`">Action</label
                  ><FieldHelpIcon
                    text="Describe the specific corrective or preventive action to be completed."
                  />
                </div>
                <input
                  type="text"
                  :id="`action-${index}`"
                  v-model="item.text"
                  class="input"
                  placeholder="add your title"
                  @input="UpdateData"
                />
              </div>
              <div class="timeline-contect-select" :class="{ 'capa-timeline-select': capaStyles }">
                <div class="input-wrapper">
                  <UpdatedCustomInputSelect
                    :staticOptions="employeeOptions"
                    v-model="item.employee"
                    placeholder="Select Employee"
                    class="mt-4 mr-2 input"
                    label="Implementation Responsibility "
                    help-text="Select the person responsible for carrying out this action."
                    :reload="false"
                    @update:model-value="UpdateData"
                  />
                </div>
                <div class="flex flex-col gap-2 input-wrapper">
                  <div class="flex items-center gap-2">
                    <label :for="`implementation-date-${index}`"
                      >Expected Time for Implementation</label
                    ><FieldHelpIcon
                      text="Select the target date by which this action should be completed."
                    />
                  </div>
                  <DatePicker
                    v-model="item.date"
                    class="mt-4 mr-2 input date-picker"
                    placeholder="Select Date"
                    @update:model-value="UpdateData"
                    :input-id="`implementation-date-${index}`"
                  />
                </div>
                <div class="input-wrapper">
                  <UpdatedCustomInputSelect
                    :staticOptions="employeeOptions"
                    v-model="item.ResponablePerson"
                    placeholder="Select Responable Person"
                    class="mt-4 mr-2 input"
                    label="Monitoring Responsibility "
                    help-text="Select the person responsible for verifying progress and confirming completion."
                    :reload="false"
                    @update:model-value="UpdateData"
                  />
                </div>
              </div>
              <!-- </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.template-container,
.heirarchy-info,
.timeline-container,
.timeline-wrapper,
.timeline-item,
.timeline-content {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}

.timeline-content .input-wrapper,
.timeline-content input {
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.capa-timeline-content {
  gap: 12px;
}

.capa-timeline-content .timeline-content-text,
.capa-timeline-select .input-wrapper {
  width: 100%;
}

.capa-timeline-select {
  display: grid !important;
  grid-template-columns: 1fr !important;
  gap: 12px !important;
  width: 100%;
}

@media (max-width: 768px) {
  .timeline-wrapper {
    padding-left: 0;
    padding-inline-start: 0;
  }

  .timeline-line,
  .timeline-dot {
    display: none;
  }

  .timeline-item {
    position: relative;
    padding-top: 44px;
    margin-bottom: 14px;
    border: 1px solid var(--brand-primary-100);
    border-radius: 8px;
    background: var(--surface-1);
    grid-template-columns: 1fr;
  }

  .timeline-marker {
    position: absolute;
    inset-inline-start: auto;
    inset-inline-end: 10px;
    top: 8px;
    width: auto;
    z-index: 3;
    padding-top: 0;
  }

  .timeline-icon {
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: auto;
    height: auto;
    border: 0;
    background: transparent;
    box-shadow: none;
  }

  .timeline-icon > svg,
  .timeline-icon > :deep(svg) {
    width: 32px;
    height: 32px;
    padding: 6px;
    border-radius: 50%;
    background: var(--brand-primary-50);
    border: 1px solid color-mix(in srgb, var(--brand-primary-500) 20%, transparent);
    cursor: pointer;
  }

  .timeline-content {
    padding: 10px 12px 12px;
    border: 0;
    box-shadow: none;
    background: transparent;
  }
}
</style>
