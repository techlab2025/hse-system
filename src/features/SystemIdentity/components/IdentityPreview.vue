<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { buildSidebarGroups } from '../sidebarLayout'
import { useSystemIdentity, type SystemIdentity } from '@/composables/useSystemIdentity'
import { fontStack } from '../typography'
import { headerFields, headerActionFields } from '../appearance'
const props = defineProps<{ identity: SystemIdentity }>()
const { t } = useI18n()
const { defaultIdentity } = useSystemIdentity()
const preview = computed(() => (props.identity.isActive ? props.identity : defaultIdentity.value))
const colors = computed(() => preview.value.appearance.colors)
const groups = computed(() => buildSidebarGroups(preview.value.appearance, t))
</script>
<template>
  <section class="identity-editor">
    <h2>{{ $t('Layout preview') }}</h2>
    <p>
      {{
        $t('Draft changes stay here until you save. Disabled identities use the system defaults.')
      }}
    </p>
    <div
      class="identity-shell-preview"
      :style="{
        background: colors.systemBackground || 'var(--hse-project-bg)',
        fontFamily:
          fontStack(preview.appearance.typography.fontFamily) || 'var(--hse-control-font)',
      }"
    >
      <aside
        :style="{
          background: colors.sidebarBackground || '#0b294c',
          color: colors.sidebarText || '#c7d7eb',
        }"
      >
        ☰<span
          v-for="(group, index) in groups"
          :key="group.key"
          :class="{ 'identity-preview-nav-active': index === 0 }"
          :style="
            index === 0
              ? {
                  background: colors.sidebarActiveBackground || '#256df4',
                  color: colors.sidebarActiveText || '#ffffff',
                }
              : undefined
          "
          >{{ group.label }}</span
        >
      </aside>
      <div class="identity-preview-main">
        <header
          :style="{
            background: colors.headerBackground || 'var(--hse-project-surface)',
            color: colors.headerText || 'var(--hse-project-ink)',
          }"
        >
          <span v-for="field in preview.appearance.headerOrder" :key="field">
            <template v-if="field === 'brand'"
              ><img v-if="preview.logo" :src="preview.logo" alt="" />{{ preview.name }}</template
            >
            <span v-else-if="field === 'actions'" class="identity-preview-controls">
              <span v-for="action in preview.appearance.headerActionOrder" :key="action">{{
                headerActionFields.find((item) => item.key === action)?.label
              }}</span>
            </span>
            <template v-else>{{ headerFields.find((item) => item.key === field)?.label }}</template>
          </span>
        </header>
        <div class="identity-preview-body">
          <div
            class="identity-preview-breadcrumb"
            :style="{ textAlign: preview.appearance.breadcrumbPosition }"
          >
            <span
              :style="{
                background: colors.breadcrumbBackground || 'var(--hse-project-surface)',
                color: colors.breadcrumbText || 'var(--hse-project-blue)',
              }"
              >{{ $t('Home / Projects') }}</span
            >
          </div>
          <div
            class="identity-preview-section"
            :style="{
              background: colors.sectionBackground || 'var(--hse-project-surface)',
              color:
                colors.sectionText ||
                preview.appearance.typography.fontColor ||
                'var(--hse-project-ink)',
              fontSize: preview.appearance.typography.fontSize
                ? `${preview.appearance.typography.fontSize}px`
                : undefined,
            }"
          >
            <h3
              :style="{
                color: preview.appearance.typography.headingColor || 'inherit',
                fontSize: preview.appearance.typography.headingSize
                  ? `${Math.max(14, preview.appearance.typography.headingSize * 0.65)}px`
                  : undefined,
              }"
            >
              {{ preview.name }}
            </h3>
            <p>{{ $t('Your workspace appearance') }}</p>
            <span
              class="identity-preview-tag"
              :style="{
                background: colors.tagBackground || '#e8f0ff',
                color: colors.tagText || '#256df4',
              }"
              >{{ $t('Sample tag') }}</span
            >
            <div
              class="identity-preview-input"
              :style="{
                background: colors.inputBackground || 'var(--hse-project-input-bg)',
                color: colors.inputText || 'var(--hse-project-ink)',
                borderColor: colors.inputBorder || 'var(--hse-project-line)',
              }"
            >
              {{ $t('Sample field') }}
            </div>
            <div class="identity-preview-actions">
              <span
                :style="{
                  background: colors.primaryButtonBackground || '#256df4',
                  color: colors.primaryButtonText || '#ffffff',
                }"
                >{{ $t('Primary action') }}</span
              >
              <span
                :style="{
                  background: colors.secondaryButtonBackground || 'var(--hse-project-surface)',
                  color: colors.secondaryButtonText || 'var(--hse-project-ink)',
                }"
                >{{ $t('Secondary action') }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
