<script lang="ts" setup>
import type InjuryDetailsModel from '@/features/Organization/ObservationFactory/Data/models/InjuryModel'
import RIP from '@/assets/images/RIP.png'
import { ref, watch } from 'vue'
import UploadMultiImage from '@/shared/HelpersComponents/UploadMultiImage.vue'
import wordSlice from '@/base/Presentation/utils/word_slice'

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
        <div class="text">
          <p>{{ $t('fatalities from the accident') }}</p>
          <h6>{{ props.data?.length }} {{ $t('deaths') }}</h6>
        </div>
      </div>
    </div>
    <div class="death-header-employees flex gap-3">
      <!-- <img src="https://cyber.comolho.com/static/img/avatar.png" alt="" width="40" height="30" /> -->
      <div class="death_name_note">
        <div class="death_all_card" v-for="death in props.data" :key="death.id">
          <div class="death_user">
            <span class="employee-name">{{
              death?.organization_employee?.name || death?.employee_name
            }}</span>
          </div>
          <div class="flex flex-col items-start">
            <span class="employee-hierarchy">{{
              // death?.organization_employee?.hierarchy?.[0].title
              wordSlice(death?.note, 120)
            }}</span>
          </div>
          <div class="death-container w-full justify-between">
            <div class="" v-if="death?.media && death?.media.length > 0">
              <UploadMultiImage
                @update:images="UpdateImg"
                class="image-upload"
                :initialImages="death?.media?.map((el) => el.url) || []"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
