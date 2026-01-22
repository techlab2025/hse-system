<script lang="ts" setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import MemberDeleteIcon from '@/shared/icons/MemberDeleteIcon.vue';
const visible = ref(false)
const emits = defineEmits(['delete'])
</script>

<template>
  <MemberDeleteIcon class="card-delete" @click.prevent="visible = true" />
  <Dialog v-model:visible="visible" :modal="true" class="delete-dialog">
    <template #container>
      <img src="@/assets/images/delete-bin-full.png" alt="delete" />
      <h4 class="dialog-title">Are you sure</h4>
      <p class="dialog-message">Now you will delete</p>
      <div class="flex w-full btns">
        <button class="btn btn-primary justify-center mb-sm" @click.prevent="emits('delete')">Delete</button>
        <button class="btn btn-secondary" @click.prevent="visible = false">Cancel</button>
      </div>
    </template>
  </Dialog>
</template>

<style scoped></style>
