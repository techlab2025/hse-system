<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Galleria from 'primevue/galleria'
import { computed, ref, watch } from 'vue'

const props = defineProps<{ images: string[] }>()

const visible = ref(false)
const activeIndex = ref(0)

const responsiveOptions = [
  {
    breakpoint: '1300px',
    numVisible: 5,
  },
  {
    breakpoint: '900px',
    numVisible: 4,
  },
  {
    breakpoint: '575px',
    numVisible: 3,
  },
]

const activeImage = computed(() => props.images[activeIndex.value] ?? props.images[0] ?? '')
const formattedIndex = computed(() => String(activeIndex.value + 1).padStart(2, '0'))
const formattedTotal = computed(() => String(props.images.length).padStart(2, '0'))

watch(
  () => props.images.length,
  (length) => {
    if (!length || activeIndex.value >= length) activeIndex.value = 0
  },
)

watch(visible, (isVisible) => {
  if (isVisible) activeIndex.value = 0
})
</script>

<template>
  <div class="multi-images-dialog">
    <button
      type="button"
      class="multi-images-dialog__trigger"
      :aria-label="$t('open_photo_gallery')"
      @click="visible = true"
    >
      <slot />
    </button>

    <Dialog
      v-model:visible="visible"
      modal
      maximizable
      dismissable-mask
      :draggable="false"
      class="media-gallery-dialog"
      :breakpoints="{ '960px': '94vw', '640px': '100vw' }"
    >
      <template #header>
        <div class="gallery-dialog-header">
          <span class="gallery-dialog-header__icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 7h3l1.3-2h7.4L17 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Zm8 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
              />
            </svg>
          </span>

          <div class="gallery-dialog-header__copy">
            <span class="gallery-dialog-header__eyebrow">{{ $t('photo_gallery') }}</span>
            <h2>{{ $t('all_photos') }}</h2>
            <p>{{ $t('browse_evidence_photos') }}</p>
          </div>

          <span class="gallery-dialog-header__count">
            {{ images.length }}
            <small>{{ $t('photos') }}</small>
          </span>
        </div>
      </template>

      <div class="gallery-dialog-content">
        <div class="gallery-dialog-toolbar">
          <div class="gallery-dialog-toolbar__position" aria-live="polite">
            <span>{{ formattedIndex }}</span>
            <i></i>
            <small>{{ formattedTotal }}</small>
          </div>

          <a
            v-if="activeImage"
            :href="activeImage"
            target="_blank"
            rel="noopener noreferrer"
            class="gallery-dialog-toolbar__original"
          >
            <span>{{ $t('view_original') }}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14 5h5v5M19 5l-7 7M19 14v5H5V5h5" />
            </svg>
          </a>
        </div>

        <Galleria
          v-model:active-index="activeIndex"
          :value="images"
          :responsive-options="responsiveOptions"
          :num-visible="5"
          :circular="images.length > 1"
          :show-item-navigators="images.length > 1"
          :show-item-navigators-on-hover="false"
          :show-thumbnails="images.length > 1"
          :show-indicators="false"
          container-style="max-width: 100%"
          class="modern-galleria"
        >
          <template #item="slotProps">
            <div class="gallery-stage">
              <span class="gallery-stage__glow gallery-stage__glow--one"></span>
              <span class="gallery-stage__glow gallery-stage__glow--two"></span>
              <img
                :src="slotProps.item"
                :alt="`${$t('photo')} ${activeIndex + 1}`"
                class="gallery-stage__image"
              />
            </div>
          </template>

          <template #thumbnail="slotProps">
            <div class="gallery-thumbnail">
              <img :src="slotProps.item" :alt="$t('photo')" />
            </div>
          </template>
        </Galleria>

        <div v-if="!images.length" class="gallery-empty">
          <span class="gallery-empty__icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 11 5-5 4 4 2-2 5 5M16 9h.01"
              />
            </svg>
          </span>
          <h3>{{ $t('no_photos') }}</h3>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.multi-images-dialog {
  display: contents;
}

.multi-images-dialog__trigger {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  color: inherit;
  background: transparent;
  text-align: inherit;
  cursor: pointer;
}

:global(.media-gallery-dialog) {
  width: min(1040px, calc(100vw - 32px)) !important;
  max-height: 92vh;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 26px !important;
  background: #0b1120;
  box-shadow: 0 35px 100px rgb(2 6 23 / 45%);
}

:global(.media-gallery-dialog.p-dialog-maximized) {
  width: 100vw !important;
  max-height: 100vh;
  border-radius: 0 !important;
}

:global(.media-gallery-dialog .p-dialog-header) {
  padding: 17px 20px;
  border-bottom: 1px solid
    color-mix(in srgb, var(--brand-primary-500, #386cfe) 10%, var(--surface-2, #e5e7eb));
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--brand-primary-50, #eff6ff) 82%, #fff),
    #fff
  );
}

:global(.media-gallery-dialog .p-dialog-title) {
  width: 100%;
  min-width: 0;
}

.gallery-dialog-header {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: center;
  gap: 12px;
}

.gallery-dialog-header__icon {
  display: grid;
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  place-items: center;
  border-radius: 15px;
  color: #fff;
  background: linear-gradient(135deg, #7c3aed, var(--brand-primary-500, #386cfe));
  box-shadow: 0 10px 25px rgb(109 40 217 / 22%);
}

.gallery-dialog-header__icon svg {
  width: 23px;
  height: 23px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.gallery-dialog-header__copy {
  min-width: 0;
  flex: 1;
}

.gallery-dialog-header__eyebrow {
  display: block;
  margin-bottom: 2px;
  color: #7c3aed;
  font-size: 0.63rem;
  font-weight: 850;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.gallery-dialog-header__copy h2 {
  margin: 0;
  color: var(--text-strong, #172033);
  font-size: 1rem;
  font-weight: 850;
  line-height: 1.25;
}

.gallery-dialog-header__copy p {
  margin: 3px 0 0;
  overflow: hidden;
  color: var(--text-muted, #667085);
  font-size: 0.72rem;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gallery-dialog-header__count {
  display: inline-flex;
  min-width: 56px;
  height: 42px;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(124 58 237 / 12%);
  border-radius: 13px;
  color: #6d28d9;
  background: rgb(124 58 237 / 7%);
  font-size: 0.86rem;
  font-weight: 850;
  line-height: 1;
}

.gallery-dialog-header__count small {
  margin-top: 3px;
  font-size: 0.56rem;
  font-weight: 750;
  text-transform: uppercase;
}

:global(.media-gallery-dialog .p-dialog-header-actions) {
  gap: 5px;
}

:global(.media-gallery-dialog .p-dialog-header-action) {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  color: var(--text-muted, #667085);
  background: var(--surface-2, #f2f4f7);
}

:global(.media-gallery-dialog .p-dialog-content) {
  padding: 0 !important;
  overflow: auto;
  background: #0b1120;
}

.gallery-dialog-content {
  position: relative;
  min-height: 480px;
  padding: 14px;
  background:
    radial-gradient(circle at 10% 10%, rgb(56 108 254 / 14%), transparent 28%),
    radial-gradient(circle at 92% 80%, rgb(124 58 237 / 13%), transparent 28%), #0b1120;
}

.gallery-dialog-toolbar {
  position: absolute;
  z-index: 5;
  top: 26px;
  inset-inline: 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;
}

.gallery-dialog-toolbar__position,
.gallery-dialog-toolbar__original {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  gap: 8px;
  padding: 0 11px;
  border: 1px solid rgb(255 255 255 / 12%);
  border-radius: 12px;
  color: #fff;
  background: rgb(15 23 42 / 64%);
  box-shadow: 0 8px 24px rgb(2 6 23 / 18%);
  backdrop-filter: blur(10px);
  pointer-events: auto;
}

.gallery-dialog-toolbar__position span {
  font-size: 0.82rem;
  font-weight: 850;
}

.gallery-dialog-toolbar__position i {
  width: 22px;
  height: 1px;
  background: rgb(255 255 255 / 35%);
}

.gallery-dialog-toolbar__position small {
  color: rgb(255 255 255 / 60%);
  font-size: 0.7rem;
  font-weight: 750;
}

.gallery-dialog-toolbar__original {
  text-decoration: none;
  font-size: 0.7rem;
  font-weight: 800;
  transition:
    border-color 180ms ease,
    background 180ms ease,
    transform 180ms ease;
}

.gallery-dialog-toolbar__original:hover {
  border-color: rgb(255 255 255 / 28%);
  background: rgb(30 41 59 / 82%);
  transform: translateY(-1px);
}

.gallery-dialog-toolbar__original svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

:deep(.modern-galleria.p-galleria) {
  border: 0;
  border-radius: 18px;
  background: transparent;
}

:deep(.modern-galleria .p-galleria-content) {
  border-radius: 18px;
  background: transparent;
}

:deep(.modern-galleria .p-galleria-item-wrapper),
:deep(.modern-galleria .p-galleria-item-container) {
  border-radius: 18px;
  background: transparent;
}

.gallery-stage {
  position: relative;
  display: grid;
  width: 100%;
  height: min(64vh, 620px);
  min-height: 430px;
  overflow: hidden;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: 18px;
  background:
    linear-gradient(
      45deg,
      rgb(255 255 255 / 2%) 25%,
      transparent 25%,
      transparent 75%,
      rgb(255 255 255 / 2%) 75%
    ),
    linear-gradient(
      45deg,
      rgb(255 255 255 / 2%) 25%,
      transparent 25%,
      transparent 75%,
      rgb(255 255 255 / 2%) 75%
    ),
    #080d18;
  background-position:
    0 0,
    14px 14px;
  background-size: 28px 28px;
}

.gallery-stage__image {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  padding: 34px;
  object-fit: contain;
  filter: drop-shadow(0 22px 38px rgb(0 0 0 / 34%));
}

.gallery-stage__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  pointer-events: none;
}

.gallery-stage__glow--one {
  top: 8%;
  left: 10%;
  width: 180px;
  height: 180px;
  background: rgb(56 108 254 / 16%);
}

.gallery-stage__glow--two {
  right: 8%;
  bottom: 8%;
  width: 190px;
  height: 190px;
  background: rgb(124 58 237 / 14%);
}

:deep(.modern-galleria .p-galleria-item-nav) {
  width: 46px;
  height: 46px;
  margin: 0 16px;
  border: 1px solid rgb(255 255 255 / 14%);
  border-radius: 15px;
  color: #fff;
  background: rgb(15 23 42 / 68%);
  box-shadow: 0 10px 28px rgb(2 6 23 / 25%);
  backdrop-filter: blur(10px);
}

:deep(.modern-galleria .p-galleria-thumbnail-wrapper) {
  padding-top: 11px;
  background: transparent;
}

:deep(.modern-galleria .p-galleria-thumbnails-content) {
  padding: 7px 44px;
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: 15px;
  background: rgb(255 255 255 / 4%);
}

:deep(.modern-galleria .p-galleria-thumbnail-item) {
  padding: 3px;
  opacity: 0.45;
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

:deep(.modern-galleria .p-galleria-thumbnail-item-current) {
  opacity: 1;
  transform: translateY(-2px);
}

.gallery-thumbnail {
  width: 74px;
  height: 55px;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 11px;
  background: #111827;
}

:deep(.p-galleria-thumbnail-item-current) .gallery-thumbnail {
  border-color: #8b5cf6;
  box-shadow: 0 5px 14px rgb(124 58 237 / 25%);
}

.gallery-thumbnail img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-empty {
  display: flex;
  min-height: 430px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px dashed rgb(255 255 255 / 12%);
  border-radius: 18px;
  color: rgb(255 255 255 / 68%);
}

.gallery-empty__icon {
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  border-radius: 17px;
  color: #a78bfa;
  background: rgb(124 58 237 / 12%);
}

.gallery-empty__icon svg {
  width: 27px;
  height: 27px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.gallery-empty h3 {
  margin: 0;
  color: #fff;
  font-size: 0.92rem;
  font-weight: 800;
}

@media (max-width: 640px) {
  :global(.media-gallery-dialog) {
    width: 100vw !important;
    height: 100dvh;
    max-height: 100dvh;
    border-radius: 0 !important;
  }

  :global(.media-gallery-dialog .p-dialog-header) {
    padding: 13px 14px;
  }

  .gallery-dialog-header__copy p,
  .gallery-dialog-header__count {
    display: none;
  }

  .gallery-dialog-content {
    min-height: 0;
    padding: 8px;
  }

  .gallery-dialog-toolbar {
    top: 18px;
    inset-inline: 18px;
  }

  .gallery-dialog-toolbar__original span {
    display: none;
  }

  .gallery-stage {
    height: calc(100dvh - 190px);
    min-height: 360px;
    border-radius: 14px;
  }

  .gallery-stage__image {
    padding: 18px;
  }

  :deep(.modern-galleria .p-galleria-item-nav) {
    width: 40px;
    height: 40px;
    margin: 0 8px;
    border-radius: 13px;
  }

  :deep(.modern-galleria .p-galleria-thumbnails-content) {
    padding-inline: 34px;
  }

  .gallery-thumbnail {
    width: 62px;
    height: 48px;
  }
}
</style>
