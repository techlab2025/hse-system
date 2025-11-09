<script setup lang="ts">
import MemberDeleteIcon from '@/shared/icons/MemberDeleteIcon.vue';

const emit = defineEmits(['update:data'])
interface TeamMemberInterface {
  img: string,
  name: string,
  poistion: string
}
const props = defineProps<{
  member: TeamMemberInterface
}>()
const UpdateData = () => {
  emit('update:data')
}
</script>
<template>
  <div class="member-card">
    <MemberDeleteIcon class="card-delete" @click="UpdateData" />
    <img class="member-img" :src="member.img" :alt="member.name">
    <div class="member-data">
      <p class="name">{{ member.name }}</p>
      <p class="position">{{ member.poistion }}</p>
    </div>
  </div>
</template>
