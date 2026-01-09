<script lang="ts" setup>
import HeaderPage from '@/features/Organization/Project/Presentation/components/Details/DetailsHeader/HeaderPage.vue'
import { computed, ref, watch } from 'vue'
import WitnessesTimeLine from './WitnessesTimeLine.vue'
import people from '@/assets/images/people.png'

const emit = defineEmits(['update:data'])

const isAnotherMeeting = ref(0)
const updateData = () => {
  emit('update:data', {
    isAnotherMeeting: isAnotherMeeting.value,
    AllWitnessesData: AllWitnessesData.value,

  })
}

const AllWitnessesData = ref()
const UpdateWitnessesData = (data: any) => {
  AllWitnessesData.value = data
  updateData()
}

watch(() => isAnotherMeeting.value, (newVal) => {
  if (newVal == 1) {
    updateData()
  } else {
    emit('update:data', {
      isAnotherMeeting: isAnotherMeeting.value,
    })
    AllWitnessesData.value = []
  }
})
</script>
<template>
  <div class="another-meeting">
    <div class="another-meeting-header">
      <HeaderPage :title="`Are there witnesses?`" :subtitle="`Were there any witnesses present at this incident?`"
        :img="people" class="title-header" />
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
      <WitnessesTimeLine @update:data="UpdateWitnessesData" />
    </div>
  </div>
</template>
