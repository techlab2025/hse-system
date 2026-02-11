<script setup lang="ts">
import TitleInterface from '@/base/Data/Models/title_interface'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import AddAnswer from '@/shared/icons/AddAnswer.vue'
import DeleteItemAction from '@/shared/icons/DeleteItemAction.vue'
import { onMounted, ref } from 'vue'
import DatePicker from 'primevue/datepicker'
import UpdatedCustomInputSelect from '@/shared/FormInputs/UpdatedCustomInputSelect.vue'
import IndexInjuryController from '@/features/Organization/Injury/Presentation/controllers/indexInjuryController'
import IndexInjuryParams from '@/features/Organization/Injury/Core/params/indexInjuryParams'
import MultiImagesInput from '@/shared/FormInputs/MultiImagesInput.vue'
import Checkbox from 'primevue/checkbox'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'

const emit = defineEmits(['update:data'])

const fetchOriganizatioEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const fetchOrganizationEmployeeParams = new IndexOrganizatoinEmployeeParams('', 1, 10, 0)
const Answers = ref([
  {
    text: ' ',
    employee: new TitleInterface({ id: 0, title: '' }),
    infectionTypeId: new TitleInterface({ id: 0, title: '' }),
    employeeName: '',
    isWorkStopped: false,
    images: [],
  },
])

const addNewAnswer = () => {
  Answers.value.push({
    text: '',
    employee: new TitleInterface({ id: 0, title: '' }),
    infectionTypeId: new TitleInterface({ id: 0, title: '' }),
    employeeName: '',
    isWorkStopped: false,
    images: [],
  })
  UpdateData()
}

const DeleteItem = (index: number) => {
  Answers.value.splice(index, 1)
  UpdateData()
}

const UpdateData = () => {
  Answers.value.forEach(ensureEmployee)

  emit('update:data', Answers.value)
}
onMounted(() => {
  emit('update:data', Answers.value)
})

const UpdateInjury = (item: TitleInterface, index: number) => {
  console.log(item);
  Answers.value[index].infectionTypeId = new TitleInterface({ id: item.id, title: item.title })
}

const isSelectHasContent = ref([])

const indexInjuryController = IndexInjuryController.getInstance()
const indexInjuryParams = new IndexInjuryParams('', 1, 10, 0)



const setImages = async (data: string[], index: number) => {
  Answers.value[index].images = typeof data === 'string' ? data : await filesToBase64(data)
  UpdateData()
}
const ensureEmployee = (item: any) => {
  if (!item.employee) {
    item.employee = new TitleInterface({ id: 0, title: '' })
  }
}

</script>
<template>
  <div class="template-container col-span-6">
    <div class="heirarchy-info">
      <div class="timeline-container">
        <div class="timeline-wrapper">
          <div class="timeline-line"></div>

          <div class="timeline-item" v-for="(item, index) in Answers" :key="index" :class="{ active: index === 0 }"
            :style="{ animationDelay: `${index * 0.15}s` }">
            <div class="timeline-marker">
              <div class="timeline-dot">
                <div class="timeline-dot-inner"></div>
                <div class="timeline-pulse"></div>
              </div>

              <div class="timeline-icon">
                <DeleteItemAction class="cursor-pointer" v-if="index >= 0 && index !== Answers.length - 1"
                  @click="DeleteItem(index)" />
                <AddAnswer v-else @click="addNewAnswer" class="cursor-pointer" />
              </div>
            </div>

            <!-- timeline-content -->
            <div class=" grid grid-cols-12 gap-2">
              <div class="col-span-12 md:col-span-4 input-wrapper w-full">
                <label for="">{{ $t('text') }}</label>
                <input type="text" class="input " :placeholder="$t('add your title')" v-model="item.text"
                  @input="UpdateData">
              </div>
              <div class="col-span-12 md:col-span-4 input-wrapper w-full">

                <UpdatedCustomInputSelect :controller="fetchOriganizatioEmployeeController"
                  :params="fetchOrganizationEmployeeParams" v-model="item.employee" placeholder="Select Employee"
                  class="mt-4 mr-2 input" :label="$t('Employee')" @update:model-value="UpdateData"
                  :hascontent="isSelectHasContent[index]">
                  <template #reloadHeader>
                    <div class="flex gap-2 items-center">
                      <button :class="isSelectHasContent[index] ? 'active' : ''" class="emp-name"
                        @click.prevent="isSelectHasContent[index] = true; item.employee.title = ''">{{
                          $t('employee_name')
                        }}</button>
                      <button :class="isSelectHasContent[index] ? '' : 'active'" class="emp-select"
                        @click.prevent="isSelectHasContent[index] = false; item.employee.title = ''">{{ $t('select')
                        }}</button>
                    </div>
                  </template>
                  <template #content>
                    <input type="text" v-model="item.employee.title" class="input" placeholder="Select Employee">
                  </template>
                </UpdatedCustomInputSelect>

              </div>
              <div class="col-span-12 md:col-span-4 input-wrapper w-full">
                <CustomSelectInput :modelValue="item.infectionTypeId" class="input" :controller="indexInjuryController"
                  :params="indexInjuryParams" :label="$t('injury Type')" id="injury"
                  :placeholder="$t('select your injury')" @update:modelValue="UpdateInjury($event, index)" />
              </div>
              <div class="col-span-12 md:col-span-12 input-wrapper w-full">
                <label for="">{{ $t('upload image') }}</label>
                <MultiImagesInput :initialImages="item.images" @update:images="setImages($event, index)"
                  :index="index + 2000" />
              </div>
              <div class="col-span-12 md:col-span-12 input-wrapper w-full is-stopped is-stopped-white"
                @click="item.isWorkStopped = !item.isWorkStopped; UpdateData()">
                <label class="w-full" for="is_sstoped">{{ $t('is_work_stopped') }}</label>
                <Checkbox binary disabled :modelValue="item.isWorkStopped" @change="UpdateData" inputId="is_sstoped"
                  :name="`is_sstoped`" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
