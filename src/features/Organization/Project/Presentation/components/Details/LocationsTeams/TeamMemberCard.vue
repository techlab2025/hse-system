<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface';
import type ProjectLocationEmployeeModel from '@/features/Organization/Project/Data/models/CustomLocation/ProjectLocationEmployeeModel';
import MemberDeleteIcon from '@/shared/icons/MemberDeleteIcon.vue';
import person from "@/assets/images/person.png"
import { setDefaultImage } from '@/base/Presentation/utils/set_default_image';

const emit = defineEmits(['update:data'])

const props = defineProps<{
  member: ProjectLocationEmployeeModel
}>()
const UpdateData = () => {
  emit('update:data')
}
</script>
<template>
  <!-- {{ member }} -->
  <div class="member-card">
    <MemberDeleteIcon class="card-delete" @click="UpdateData" />
    <img class="member-img" :src="member?.image || person" @error="setDefaultImage" :alt="member.name">
    <div class="member-data">
      <p class="name">{{ member?.name }}</p>
      <!-- <p class="position">{{ member. }}</p> -->
    </div>
  </div>
</template>
