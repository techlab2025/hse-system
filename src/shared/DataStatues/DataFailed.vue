<script setup lang="ts">
import { computed } from 'vue'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
import EmptyData from '@/assets/images/EmptyData.png'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    link?: string
    addText?: string
    withbtn?: boolean
  }>(),
  {
    title: '',
    description: '',
    link: '',
    addText: 'Home',
    withbtn: true
  },
)

const { user } = useUserStore()

const actionLink = computed(
  () => props.link || (user?.type === OrganizationTypeEnum.ADMIN ? '/admin' : '/organization'),
)
</script>

<template>
  <section class="data-state-card" role="status" aria-live="polite">
    <span class="state-orb state-orb-one" aria-hidden="true"></span>
    <span class="state-orb state-orb-two" aria-hidden="true"></span>

    <div class="data-state-content">
      <div class="data-state-copy">
        <div class="state-badge">
          <span class="state-badge-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 8v4m0 4h.01M10.3 4.9 3.7 16.3A1.8 1.8 0 0 0 5.26 19h13.48a1.8 1.8 0 0 0 1.56-2.7L13.7 4.9a1.96 1.96 0 0 0-3.4 0Z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          {{ $t('Nothing to display yet') }}
        </div>

        <h2>{{ title || $t('No data available') }}</h2>
        <p>
          {{
            description ||
            $t('There are no records to show right now. You can return or create a new record.')
          }}
        </p>

        <router-link v-if="withbtn " :to="actionLink" class="state-action">
          <span>{{ $t(addText) }}</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="m9 18 6-6-6-6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </router-link>
      </div>

      <div class="data-state-visual" aria-hidden="true">
        <div class="visual-ring visual-ring-outer"></div>
        <div class="visual-ring visual-ring-inner"></div>
        <div class="visual-image-shell">
          <img :src="EmptyData" alt="" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.data-state-card {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 360px;
  margin-block: 20px;
  padding: clamp(24px, 4vw, 48px);
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 16%, var(--main-border));
  border-radius: 24px;
  background:
    linear-gradient(
      135deg,
      color-mix(in srgb, var(--PrimaryColor) 8%, transparent),
      transparent 48%
    ),
    var(--surface-1);
  box-shadow: 0 22px 55px color-mix(in srgb, var(--text-strong) 9%, transparent);
}

.state-orb {
  position: absolute;
  z-index: -1;
  border-radius: 50%;
  filter: blur(2px);
  pointer-events: none;
}

.state-orb-one {
  top: -110px;
  inset-inline-end: -80px;
  width: 300px;
  height: 300px;
  background: color-mix(in srgb, var(--PrimaryColor) 12%, transparent);
}

.state-orb-two {
  bottom: -130px;
  inset-inline-start: 28%;
  width: 260px;
  height: 260px;
  background: color-mix(in srgb, var(--status-success) 8%, transparent);
}

.data-state-content {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(260px, 0.85fr);
  align-items: center;
  gap: clamp(28px, 5vw, 70px);
  width: 100%;
}

.data-state-copy {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  min-width: 0;
}

.state-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  padding: 7px 11px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 18%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--PrimaryColor) 8%, transparent);
  color: var(--PrimaryColor);
  font-size: 0.75rem;
  font-weight: 900;
}

.state-badge-icon {
  display: inline-flex;
}

.state-badge-icon svg {
  width: 17px;
  height: 17px;
}

.data-state-copy h2 {
  max-width: 650px;
  margin: 0;
  color: var(--header-page-color);
  font-size: clamp(1.65rem, 3vw, 2.6rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.15;
}

.data-state-copy p {
  max-width: 620px;
  margin: 14px 0 24px;
  color: var(--GrayText-1);
  font-size: 0.94rem;
  font-weight: 600;
  line-height: 1.75;
}

.state-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 46px;
  padding: 10px 16px;
  border-radius: 13px;
  background: linear-gradient(
    135deg,
    var(--PrimaryColor),
    color-mix(in srgb, var(--PrimaryColor) 78%, var(--status-success))
  );
  color: white;
  font-size: 0.84rem;
  font-weight: 900;
  text-decoration: none;
  box-shadow: 0 10px 24px color-mix(in srgb, var(--PrimaryColor) 24%, transparent);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.state-action svg {
  width: 17px;
  height: 17px;
  transition: transform 0.18s ease;
}

.state-action:hover {
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 15px 30px color-mix(in srgb, var(--PrimaryColor) 30%, transparent);
}

.state-action:hover svg {
  transform: translateX(3px);
}

[dir='rtl'] .state-action svg {
  transform: rotate(180deg);
}

[dir='rtl'] .state-action:hover svg {
  transform: rotate(180deg) translateX(3px);
}

.data-state-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 270px;
}

.visual-ring {
  position: absolute;
  border: 1px dashed color-mix(in srgb, var(--PrimaryColor) 22%, transparent);
  border-radius: 50%;
}

.visual-ring-outer {
  width: 270px;
  height: 270px;
  animation: state-rotate 24s linear infinite;
}

.visual-ring-inner {
  width: 215px;
  height: 215px;
  border-style: solid;
  opacity: 0.6;
}

.visual-image-shell {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 220px;
  height: 220px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 14%, var(--main-border));
  border-radius: 50%;
  background: color-mix(in srgb, var(--surface-1) 90%, transparent);
  box-shadow: 0 22px 45px color-mix(in srgb, var(--text-strong) 12%, transparent);
}

.visual-image-shell img {
  width: 88%;
  height: 88%;
  object-fit: contain;
  filter: drop-shadow(0 14px 22px color-mix(in srgb, var(--text-strong) 13%, transparent));
}

@keyframes state-rotate {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 760px) {
  .data-state-card {
    min-height: auto;
    padding: 24px 18px;
  }

  .data-state-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .data-state-copy {
    align-items: center;
  }

  .data-state-visual {
    order: -1;
    min-height: 210px;
  }

  .visual-ring-outer {
    width: 210px;
    height: 210px;
  }

  .visual-ring-inner,
  .visual-image-shell {
    width: 170px;
    height: 170px;
  }

  .state-action {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .visual-ring-outer {
    animation: none;
  }
}
</style>
