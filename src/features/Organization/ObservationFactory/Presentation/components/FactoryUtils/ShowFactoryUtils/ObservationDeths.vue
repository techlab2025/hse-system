<script lang="ts" setup>
import type InjuryDetailsModel from '@/features/Organization/ObservationFactory/Data/models/InjuryModel'
import RIP from '@/assets/images/RIP.png'
import { ref, watch } from 'vue'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue';

const props = defineProps<{
  data: InjuryDetailsModel[]
}>()
// imges
const emit = defineEmits(['update:data', 'update:images'])
const Img = ref()
const textArea = ref('')
const SelectedValues = ref<number[]>([])

const UpdateData = () => {
  emit('update:data', {
    itemid: props.data.media?.length,
    selected: SelectedValues.value,
    img: Img.value,
    notes: textArea.value, // Updated key to match the data structure
  })
}

// Watch for text changes
watch(textArea, () => {
  UpdateData()
})
const UpdateImg = (data: string) => {
  Img.value = data
  UpdateData()
}
</script>
<template>
  <div class="injury-header-container" v-if="props.data?.length > 0">
    <div class="injury-header">
      <div class="injury-header-info">
        <img :src="RIP" alt="RIP" />
        <p>{{ $t('fatalities from the accident') }}</p>
      </div>
      <div class="death-header-employees flex gap-3" v-for="death in props.data">
        <img src="https://cyber.comolho.com/static/img/avatar.png" alt="" width="40" height="30" />
        <div class="flex flex-col items-start">
          <span class="employee-name">{{
            death?.organization_employee?.name || death?.employee_name
          }}</span>
          <span class="employee-hierarchy">{{
            death?.organization_employee?.hierarchy?.[0].title
          }}</span>
        </div>
      </div>
    </div>
    <div class="death-container w-full justify-between" v-for="death in props.data">
      <p class="death-note">{{ death?.note }}</p>
      <img :src="death?.media[0]?.url" alt="" />
      <div class="" v-if="death?.media && death?.media.length > 0">
        <UploadMultiImage
          @update:images="UpdateImg"
          class="image-upload"
          :initialImages="death?.media?.map((el) => el.url) || []"
        />
      </div>
    </div>
  </div>
</template>
