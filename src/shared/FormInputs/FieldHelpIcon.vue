<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <span
    class="field-help"
    tabindex="0"
    role="img"
    :aria-label="text"
    :data-tooltip="text"
    @click.prevent.stop
  >
    !
  </span>
</template>

<style scoped>
.field-help {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 18px;
  width: 18px;
  height: 18px;
  border: 1.5px solid currentColor;
  border-radius: 50%;
  color: var(--PrimaryColor, #2563eb);
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  outline: none;
  margin-bottom: 5px;
}

.field-help::after {
  content: attr(data-tooltip);
  position: absolute;
  z-index: 99999999999;
  inset-inline-start: 50%;
  bottom: calc(100% + 9px);
  width: max-content;
  max-width: min(280px, 75vw);
  padding: 8px 10px;
  border-radius: 8px;
  background: #172033;
  color: #fff;
  box-shadow: 0 8px 24px rgb(15 23 42 / 20%);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.45;
  text-align: start;
  white-space: normal;
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, 4px);
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.field-help:hover::after,
.field-help:focus-visible::after {
  opacity: 1;
  transform: translate(-50%, 0);
}

[dir='rtl'] .field-help::after {
  transform: translate(50%, 4px);
}

[dir='rtl'] .field-help:hover::after,
[dir='rtl'] .field-help:focus-visible::after {
  transform: translate(50%, 0);
}
</style>
