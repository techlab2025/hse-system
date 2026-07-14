<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import AddAnswer from '@/shared/icons/AddAnswer.vue'
import DeleteItemAction from '@/shared/icons/DeleteItemAction.vue'
import { onMounted, ref } from 'vue'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'

const emit = defineEmits(['update:data'])

const fetchOriganizatioEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const fetchOrganizationEmployeeParams = new IndexOrganizatoinEmployeeParams('', 1, 10, 0)
const Answers = ref([
  {
    text: ' ',
    employee: new TitleInterface({ id: 0, title: '' }),
  },
])

const addNewAnswer = () => {
  Answers.value.push({
    text: '',
    employee: new TitleInterface({ id: 0, title: '' }),
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

onMounted(() => {
  emit('update:data', Answers.value)
})

const isSelectHasContent = ref<boolean[]>([])
const ensureEmployee = (item: any) => {
  if (!item.employee) {
    item.employee = new TitleInterface({ id: 0, title: '' })
  }
}
const toggleMode = (index: number, isManual: boolean) => {
  // 1. Update the toggle state
  isSelectHasContent.value[index] = isManual

  // 2. Reset the employee object to a clean slate
  // This prevents the "Select" mode from holding onto old data
  Answers.value[index].employee = new TitleInterface({ id: 0, title: '' })

  // 3. Notify parent
  UpdateData()
}
</script>
<template>
  <div class="template-container col-span-6">
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

              <div class="timeline-icon timeline-actions">
                <DeleteItemAction
                  class="timeline-action cursor-pointer"
                  v-if="Answers.length > 1"
                  @click="DeleteItem(index)"
                />
                <AddAnswer
                  v-if="index === Answers.length - 1"
                  @click="addNewAnswer"
                  class="timeline-action cursor-pointer"
                />
              </div>
            </div>

            <div class="timeline-content">
              <div class="input-wrapper">
                <UpdatedCustomInputSelect
                  :controller="fetchOriganizatioEmployeeController"
                  :params="fetchOrganizationEmployeeParams"
                  v-model="item.employee"
                  placeholder="Select Witness name"
                  class="mt-4 mr-2 input"
                  :label="$t('Witness name')"
                  help-text="Select the witness from the employee list, or enter their name manually if they are not an employee."
                  :excludedOptionIds="getSelectedEmployeeIds(index)"
                  @update:model-value="UpdateData"
                  :hascontent="isSelectHasContent[index]"
                >
                  <template #reloadHeader>
                    <div class="flex gap-2 items-center">
                      <button
                        :class="isSelectHasContent[index] ? 'active' : ''"
                        class="emp-name"
                        @click.prevent="toggleMode(index, true)"
                      >
                        {{ $t('unemployed_witness') }}
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
              <div class="input-wrapper">
                <div class="flex items-center gap-2">
                  <label :for="`witness-text-${index}`">{{ $t('Witness statement') }}</label>
                  <FieldHelpIcon
                    text="Record what this witness saw, heard, or knows about the event."
                  />
                </div>
                <input
                  type="text"
                  :id="`witness-text-${index}`"
                  v-model="item.text"
                  class="input"
                  placeholder="add your title"
                  @input="UpdateData"
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
.timeline-actions {
  width: auto;
  height: auto;
  min-width: 30px;
  min-height: 30px;
  gap: 6px;
  flex-direction: column;
  background: transparent;
  border: 0;
}

.timeline-action {
  width: 30px;
  height: 30px;
  padding: 5px;
  border: 1px solid rgba(156, 163, 175, 0.4);
  border-radius: 50%;
  background: #f1f3f5;
}
</style>
