<script setup lang="ts">
import MemberDeleteIcon from '@/shared/icons/MemberDeleteIcon.vue';

  interface TeamMemberInterface {
    img: string,
    name: string,
    poistion: string
  }
const props = defineProps<{
  member: TeamMemberInterface
}>()
</script>
<template>
  <div class="member-card">
    <MemberDeleteIcon class="card-delete" />
    <img class="member-img" :src="member.img" :alt="member.name">
    <div class="member-data">
      <p class="name">{{ member.name }}</p>
      <p class="position">{{ member.poistion }}</p>
    </div>
  </div>
</template>
