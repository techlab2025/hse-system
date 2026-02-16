<script setup lang="ts">

const checked = defineModel<boolean>('checked', { default: false });

const props = defineProps<{
  title: string,
  index: number
}>();
</script>

<template>
  <div class="switch-container">
    <input type="checkbox" v-model="checked" :id="`switch-${index}`" class="hidden-input" />

    <label :for="`switch-${index}`" class="switch-label">
      <div class="switch-track">
        <div class="switch-thumb">
          <svg v-if="!checked" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <svg v-else class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>

      <span class="label-text">{{ $t(title) }}</span>
    </label>
  </div>
</template>

<style scoped>
/** * MINIMIZE SIZE HERE:
 * Adjust the scale from 0.8 to 0.6 or 1.0 to change the overall size.
 */
.switch-container {
  --switch-scale: 0.8;
  --track-width: calc(44px * var(--switch-scale));
  --track-height: calc(24px * var(--switch-scale));
  --thumb-size: calc(18px * var(--switch-scale));
  --padding: calc(3px * var(--switch-scale));

  display: inline-flex;
  align-items: center;
}

.hidden-input {
  display: none;
}

.switch-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
}

.switch-track {
  width: var(--track-width);
  height: var(--track-height);
  background-color: #e2e8f0;
  /* Off color */
  border-radius: 999px;
  position: relative;
  transition: background-color 0.2s ease;
}

.hidden-input:checked+.switch-label .switch-track {
  background-color: #3b82f6;
  /* On color (Blue) */
}

.switch-thumb {
  width: var(--thumb-size);
  height: var(--thumb-size);
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: var(--padding);
  left: var(--padding);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.hidden-input:checked+.switch-label .switch-thumb {
  /* Move thumb to the end minus its own width and padding */
  transform: translateX(calc(var(--track-width) - var(--thumb-size) - (var(--padding) * 2)));
}

.icon {
  width: 70%;
  height: 70%;
  color: #64748b;
  /* Icon color when off */
}

.hidden-input:checked+.switch-label .icon {
  color: #3b82f6;
  /* Icon color when on */
}

.label-text {
  font-size: calc(14px * var(--switch-scale) + 2px);
  user-select: none;
}
</style>
