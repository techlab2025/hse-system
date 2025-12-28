<script setup lang=ts>
import Dialog from 'primevue/dialog';
import { ref } from "vue";
const visible = ref(false);

const props = defineProps<{
  img: string
}>()

</script>

<template>
  <div class="card flex justify-center">
    <button class="underline certificat-btn" @click="visible = true">Certification</button>
    <Dialog v-model:visible="visible" modal :dismissable-mask="true" :header="`Certificate Image `"
      :style="{ width: '40rem' }">
      <img class="img" :src="img" alt="img">
    </Dialog>
  </div>
</template>
