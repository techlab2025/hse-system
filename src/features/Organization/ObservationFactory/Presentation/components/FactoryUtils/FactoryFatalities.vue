<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import { ref, watch } from 'vue'
import RIP from '@/assets/images/RIP.png'
import DethsTimeLine from './DethsTimeLine.vue'




const emit = defineEmits(['update:data'])
const isAnotherMeeting = ref(0)
const updateData = () => {
  emit('update:data', {
    isAnotherMeeting: isAnotherMeeting.value,
    DethsData: DethsData.value,
  })
}

const DethsData = ref()
const UpdateDethsData = (data: any) => {
  DethsData.value = data
  console.log(DethsData.value, "DethsData.value");
  updateData()
}

watch(() => isAnotherMeeting.value, (newVal) => {
  if (newVal == 1) {
    updateData()
  } else {
    emit('update:data', {
      isAnotherMeeting: isAnotherMeeting.value,
    })
    DethsData.value = []
  }
})

</script>
<template>
  <div class="another-meeting">
    <div class="another-meeting-header">
      <HeaderPage :title="`fatality repoting`" :subtitle="`Add any fatalities from the accident.`" :img="RIP"
        class="title-header" />
      <div class="meeting-status">
        <button class="meeting-status-yes" @click.prevent="isAnotherMeeting = 1"
          :class="isAnotherMeeting == 1 ? 'active' : ''">
          {{ $t('Yes') }}
        </button>
        <button class="meeting-status-on" @click.prevent="isAnotherMeeting = 0"
          :class="isAnotherMeeting == 0 ? 'active' : ''">
          {{ $t('No') }}
        </button>
      </div>
    </div>

    <div class="another-meeting-contect" v-if="isAnotherMeeting == 1">
      <DethsTimeLine @update:data="UpdateDethsData" />
    </div>
  </div>
</template>
