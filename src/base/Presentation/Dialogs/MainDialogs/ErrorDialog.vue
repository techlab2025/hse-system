<script lang="ts" setup>

const close = () => {
  document.querySelector(".dialog-error")?.close();
};

</script>

<template>
  <dialog class="dialog-error" @click.self="close">
    <div class="dialog-container">
      <img alt="" class="dialog-icon" src="" />
      <h4 class="dialog-title"></h4>
      <p class="dialog-message"></p>
    </div>
  </dialog>
</template>

<style scoped></style>
