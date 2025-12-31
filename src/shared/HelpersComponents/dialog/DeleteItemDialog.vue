<script setup lang="ts">
import DeleteTemplateIcon from '@/shared/icons/DeleteTemplateIcon.vue';
import Dialog from 'primevue/dialog';
import { ref } from "vue";
import Warning from "@/assets/images/warning.png";

const emit = defineEmits(['update:data'])
const visible = ref(false);

const UpdateData = () => {
  emit('update:data')
  visible.value = false
}
</script>

<template>
  <button class="delete-btn" @click.prevent="visible = true">
    <DeleteTemplateIcon />
  </button>
  <Dialog v-model:visible="visible" modal :dismissable-mask="true" :show-header="false" :style="{ width: '25rem' }">
    <div class="delete-content" style="">
      <img :src="Warning" alt="warning">
      <h2>Are You Sure You Want To Delete ?</h2>
    </div>

    <div class="btn-container w-full">
      <button class="btn btn-primary " style="width: 50%; " @click.prevent="UpdateData">Yes</button>
      <button class="btn btn-secondary " style="width: 50%; " @click.prevent="visible = false">No</button>
    </div>
  </Dialog>
</template>

<style scoped>
.delete-content {

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;

  img {
    width: 200px;
    height: 200px;
  }
}
</style>
