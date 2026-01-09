<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import { ref, watch } from 'vue'
import CustomSelectInput from '@/shared/FormInputs/CustomSelectInput.vue'
import TitleInterface from '@/base/Data/Models/title_interface'
import RIP from '@/assets/images/RIP.png'
import MultiImagesInput from '@/shared/FormInputs/MultiImagesInput.vue'
import { filesToBase64 } from '@/base/Presentation/utils/file_to_base_64'
import IndexOrganizatoinEmployeeController from '@/features/Organization/OrganizationEmployee/Presentation/controllers/indexOrganizatoinEmployeeController'
import IndexOrganizatoinEmployeeParams from '@/features/Organization/OrganizationEmployee/Core/params/indexOrganizatoinEmployeeParams'
import people from '@/assets/images/people.png'

const emit = defineEmits(['update:data'])

const isAnotherMeeting = ref(0)
const updateData = () => {
  emit('update:data', {
    isAnotherMeeting: isAnotherMeeting.value,
    SelectedEmployee: SelectedEmployee.value?.id,
    text: text.value,
    img: image.value,
  })
}

const text = ref<string>('')
const SelectedEmployee = ref<TitleInterface>()
const indexOrganizatoinEmployeeController = IndexOrganizatoinEmployeeController.getInstance()
const indexEmployeeParams = new IndexOrganizatoinEmployeeParams('', 1, 10, 1)

const setEmployee = (data: TitleInterface) => {
  SelectedEmployee.value = data
  updateData()
}
const image = ref([])

const setImages = async (data: string[]) => {
  image.value = typeof data === 'string' ? data : await filesToBase64(data)
  updateData()
}

watch(() => isAnotherMeeting.value, (newVal) => {
  if (newVal == 1) {
    updateData()
  } else {
    emit('update:data', {
      isAnotherMeeting: isAnotherMeeting.value,
    })
    image.value = []
    text.value = ''
    SelectedEmployee.value = undefined
  }
})
</script>
<template>
  <div class="another-meeting">
    <div class="another-meeting-header">
      <HeaderPage :title="`is there any fatalities`" :subtitle="`Add any fatalities from the accident.`" :img="RIP"
        class="title-header" />
      <div class="meeting-status">
        <button class="meeting-status-yes" @click.prevent="isAnotherMeeting = 1"
          :class="isAnotherMeeting == 1 ? 'active' : ''">
          Yes
        </button>
        <button class="meeting-status-on" @click.prevent="isAnotherMeeting = 0"
          :class="isAnotherMeeting == 0 ? 'active' : ''">
          No
        </button>
      </div>
    </div>

    <div class="another-meeting-contect" v-if="isAnotherMeeting == 1">
      <div class="col-span-6 md:col-span-6 input-wrapper w-full">
        <CustomSelectInput :controller="indexOrganizatoinEmployeeController" :params="indexEmployeeParams"
          v-model="SelectedEmployee" placeholder="Select Employee" class="mt-4 mr-2 input" label="Employee"
          @update:model-value="setEmployee" />
      </div>
      <div class="col-span-6 md:col-span-6 input-wrapper w-full">
        <label for="text">Text</label>
        <input type="text" id="text" v-model="text" class="input" placeholder="add your title" @input="updateData" />
      </div>
      <div class="col-span-6 md:col-span-6 input-wrapper w-full">
        <div class="col-span-6 md:col-span-6 input-wrapper w-full">
          <label for="">upload image</label>
          <MultiImagesInput :initialImages="image" @update:images="setImages" :index="2" />
        </div>
      </div>
    </div>
  </div>
</template>
