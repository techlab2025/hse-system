<template>
  <div class="system-dialog-empty" role="status">
    <div class="system-dialog-empty__illustration" aria-hidden="true">
      <span class="system-dialog-empty__orbit"></span>
      <svg viewBox="0 0 48 48" fill="none">
        <rect x="10" y="9" width="28" height="32" rx="6" />
        <path d="M18 9V7a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2M18 20h12M18 27h8M18 34h5" />
        <circle cx="36" cy="35" r="8" />
        <path d="m33 35 2 2 4-4" />
      </svg>
    </div>
    <p>{{ $t('No Data Found') }}</p>
  </div>
</template>

<style scoped>
.system-dialog-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-height: 260px;
  padding: 32px 20px;
  text-align: center;
}

.system-dialog-empty__illustration {
  position: relative;
  display: grid;
  place-items: center;
  width: 100px;
  height: 100px;
  border: 1px solid color-mix(in srgb, var(--brand-primary-500) 15%, transparent);
  border-radius: 28px;
  background: color-mix(in srgb, var(--brand-primary-500) 6%, var(--surface-1));
  color: var(--brand-primary-500);
  transform: rotate(-5deg);
}

.system-dialog-empty__illustration svg {
  width: 54px;
  height: 54px;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  transform: rotate(5deg);
}

.system-dialog-empty__illustration circle {
  fill: var(--surface-1);
}

.system-dialog-empty__orbit {
  position: absolute;
  inset: -10px;
  border: 1px dashed color-mix(in srgb, var(--brand-primary-500) 20%, transparent);
  border-radius: 36px;
}

.system-dialog-empty p {
  margin: 0;
  color: var(--text-soft);
  font-size: 0.95rem;
  font-weight: 600;
}
</style>
