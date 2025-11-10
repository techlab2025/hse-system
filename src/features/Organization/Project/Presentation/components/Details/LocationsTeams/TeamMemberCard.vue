<script setup lang="ts">
import type TitleInterface from '@/base/Data/Models/title_interface';
import type ProjectLocationEmployeeModel from '@/features/Organization/Project/Data/models/CustomLocation/ProjectLocationEmployeeModel';
import MemberDeleteIcon from '@/shared/icons/MemberDeleteIcon.vue';
import logoImg from "@/assets/images/Location.png"

const emit = defineEmits(['update:data'])

const props = defineProps<{
  member: ProjectLocationEmployeeModel
}>()
const UpdateData = () => {
  emit('update:data')
}
</script>
<template>
  <div class="member-card">
    <MemberDeleteIcon class="card-delete" @click="UpdateData" />
    <img class="member-img" :src="member?.image || logoImg" :alt="member.name">
    <div class="member-data">
      <p class="name">{{ member?.name }}</p>
      <!-- <p class="position">{{ member. }}</p> -->
    </div>
  </div>
</template>
