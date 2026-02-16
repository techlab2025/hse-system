<script lang="ts" setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
const visible = ref(false)
const emits = defineEmits(['delete:data'])
const Delete = () => {
  emits('delete:data')
  visible.value = false
}
</script>

<template>
  <!-- <MemberDeleteIcon class="card-delete" @click.prevent="visible = true" /> -->
  <button class="btn btn-delete" @click.prevent="visible = true"> {{ $t('delete') }} </button>

  <Dialog v-model:visible="visible" :modal="true" class="delete-dialog">
    <template #container>
      <img src="@/assets/images/delete-bin-full.png" alt="delete" />
      <h4 class="dialog-title">{{ $t('Are you sure') }}</h4>
      <p class="dialog-message">{{ $t('Now you will delete') }}</p>
      <div class="flex w-full btns">
        <button class="btn btn-primary justify-center mb-sm" @click.prevent="Delete">{{ $t('Delete') }}</button>
        <button class="btn btn-secondary" @click.prevent="visible = false">{{ $t('Cancel') }}</button>
      </div>
    </template>
  </Dialog>
</template>

<style scoped></style>
