<script lang="ts" setup>
const close = () => {
  document.querySelector('.dialog-error')?.close()
}
</script>

<template>
  <dialog class="dialog-error" style="width: 50%" @click.self="close">
    <div class="dialog-container">
      <img alt="" class="dialog-icon" src="" />
      <h4 class="dialog-title"></h4>
      <p class="dialog-message"></p>
      <button class="btn btn-secondary" @click="close">{{ $t('Close') }}</button>
    </div>
  </dialog>
</template>

<style scoped>
.btn-secondary {
  width: 50%;
  margin-block: 15px;
}
.dialog-message {
  width: 90%;
}
</style>
