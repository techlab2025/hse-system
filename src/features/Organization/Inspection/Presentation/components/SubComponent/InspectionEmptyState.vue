<script setup lang="ts">
defineProps<{ filtered?: boolean; results?: boolean }>()
</script>

<template>
  <section class="inspection-empty" role="status">
    <div class="empty-art" aria-hidden="true">
      <span class="art-orbit"></span>
      <svg class="clipboard" viewBox="0 0 80 96" fill="none">
        <rect x="12" y="14" width="56" height="72" rx="12" />
        <rect class="clip" x="27" y="8" width="26" height="14" rx="6" />
        <path class="check" d="m24 42 4 4 8-9" />
        <path d="M43 42h12M24 59h31M24 70h20" />
      </svg>
      <span class="art-spark">✦</span>
      <span class="art-badge">✓</span>
    </div>
    <span class="empty-eyebrow">{{ $t('Inspection workspace') }}</span>
    <h2>
      {{
        $t(
          filtered
            ? 'No matching inspections'
            : results
              ? 'Your results start here'
              : 'Ready for your first inspection?',
        )
      }}
    </h2>
    <p>
      {{
        $t(
          filtered
            ? 'No inspections match the current filters. Try another zone, date, or inspection type.'
            : results
              ? 'Completed inspection results will appear here, giving you a clear view of your workplace checks.'
              : 'Turn workplace checks into a safer day. Create an inspection and keep every detail in one place.',
        )
      }}
    </p>
    <div v-if="$slots.actions" class="empty-actions"><slot name="actions" /></div>
    <span class="empty-footnote">{{ $t('Every check is a step toward a safer workplace') }}</span>
  </section>
</template>

<style scoped>
.inspection-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: clamp(32px, 6vw, 64px) 24px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, var(--main-border));
  border-radius: 24px;
  background:
    radial-gradient(
      ellipse at 50% 0%,
      color-mix(in srgb, var(--PrimaryColor) 9%, transparent),
      transparent 65%
    ),
    var(--BgWhite);
}
.empty-art {
  position: relative;
  display: grid;
  place-items: center;
  width: 144px;
  height: 144px;
  margin-bottom: 24px;
  color: var(--PrimaryColor);
}
.art-orbit {
  position: absolute;
  inset: 0;
  border: 1px dashed color-mix(in srgb, var(--PrimaryColor) 25%, transparent);
  border-radius: 50%;
  background: color-mix(in srgb, var(--PrimaryColor) 5%, transparent);
}
.clipboard {
  position: relative;
  width: 80px;
  height: 96px;
  transform: rotate(-8deg);
  stroke: currentColor;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 8px 10px color-mix(in srgb, var(--PrimaryColor) 15%, transparent));
}
.clipboard rect {
  fill: var(--BgWhite);
}
.clipboard .clip {
  fill: color-mix(in srgb, var(--PrimaryColor) 16%, var(--BgWhite));
}
.art-spark {
  position: absolute;
  top: 8px;
  right: 10px;
  font-size: 24px;
}
.art-badge {
  position: absolute;
  bottom: 10px;
  right: 6px;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 4px solid var(--BgWhite);
  border-radius: 50%;
  background: var(--PrimaryColor);
  color: white;
  font-weight: 800;
}
.empty-eyebrow {
  color: var(--PrimaryColor);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
h2 {
  margin: 10px 0 12px;
  color: var(--header-page-color);
  font-size: clamp(21px, 3vw, 28px);
  font-weight: 800;
  line-height: 1.3;
}
p {
  max-width: 460px;
  margin: 0;
  color: var(--GrayText-1);
  font-size: 14px;
  line-height: 1.8;
}
.empty-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}
.empty-footnote {
  margin-top: 28px;
  color: var(--GrayText-1);
  font-size: 11px;
}
</style>
