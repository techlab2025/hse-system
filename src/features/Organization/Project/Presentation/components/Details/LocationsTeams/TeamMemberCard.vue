<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface';
import type ProjectLocationEmployeeModel from '@/features/Organization/Project/Data/models/CustomLocation/ProjectLocationEmployeeModel';
import MemberDeleteIcon from '@/shared/icons/MemberDeleteIcon.vue';
import person from "@/assets/images/person.png"
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image';
import wordSlice from '@/base/Presentation/utils/word_slice';

const emit = defineEmits(['update:data'])

const props = defineProps<{
  member: ProjectLocationEmployeeModel
}>()
const UpdateData = (id: number) => {
  emit('update:data', id)
}


</script>
<template>
  <!-- {{ member }} -->
  <div class="member-card">
    <MemberDeleteIcon class="card-delete" @click="UpdateData(member?.employeeId)" />
    <img class="member-img" :src="member?.image || person" @error="setDefaultImage" :alt="member.name">
    <div class="member-data">
      <p class="name">{{ wordSlice(member?.name, 18) }}</p>
      <!-- <p class="position">{{ member. }}</p> -->
    </div>
  </div>
</template>
