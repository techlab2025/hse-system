<script lang="ts">
// false = localStorage only; true = fetch/save the organization identity through the API.
export const USE_SYSTEM_IDENTITY_API = false
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { translate as localizeUi } from '@/localization/i18n'
import { translateMessage } from '@/localization/messages'
import IdentityTypographyEditor from '@/features/SystemIdentity/components/IdentityTypographyEditor.vue'
import IdentityColorEditor from '@/features/SystemIdentity/components/IdentityColorEditor.vue'
import IdentitySidebarEditor from '@/features/SystemIdentity/components/IdentitySidebarEditor.vue'
import IdentityLayoutEditor from '@/features/SystemIdentity/components/IdentityLayoutEditor.vue'
import IdentityDashboardEditor from '@/features/SystemIdentity/components/IdentityDashboardEditor.vue'
import IdentityPreview from '@/features/SystemIdentity/components/IdentityPreview.vue'
import { normalizeAppearance } from '@/features/SystemIdentity/appearance'
import '@/features/SystemIdentity/identity-editor.css'
import FieldHelpIcon from '@/shared/FormInputs/FieldHelpIcon.vue'
import { useSystemIdentity, type SystemIdentity } from '@/composables/useSystemIdentity'

const {
  identity,
  defaultIdentity,
  loadOrganizationIdentity,
  saveIdentity,
  resetIdentity,
  identityLoadError,
  identityCacheWarning,
} = useSystemIdentity()
const activeTab = ref('brand')
const tabs = [
  { id: 'brand', label: 'Brand identity' },
  { id: 'colors', label: 'Interface colors' },
  { id: 'fonts', label: 'Fonts and typography' },
  { id: 'layout', label: 'Header and layout' },
  { id: 'sidebar', label: 'Sidebar navigation' },
  { id: 'charts', label: 'Home charts and layout' },
  { id: 'preview', label: 'System preview' },
]
const navigateTab = (event: KeyboardEvent, index: number) => {
  const next =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? tabs.length - 1
        : (index + (event.key === 'ArrowUp' ? -1 : 1) + tabs.length) % tabs.length
  activeTab.value = tabs[next]!.id
  ;(event.currentTarget as HTMLElement).parentElement
    ?.querySelectorAll<HTMLButtonElement>('button')
    [next]?.focus()
}
const isInitializing = ref(true)
const copySavedIdentity = () => {
  form.value = {
    ...identity.value,
    extractedColors: [...identity.value.extractedColors],
    appearance: normalizeAppearance(identity.value.appearance),
  }
}

const form = ref<SystemIdentity>({
  ...defaultIdentity.value,
  appearance: normalizeAppearance(defaultIdentity.value.appearance),
  extractedColors: [...defaultIdentity.value.extractedColors],
})
const fileInput = ref<HTMLInputElement | null>(null)
const isExtracting = ref(false)
const isSaving = ref(false)
const message = ref('')

const rgbToHex = (red: number, green: number, blue: number) =>
  `#${[red, green, blue].map((value) => value.toString(16).padStart(2, '0')).join('')}`

const extractColors = (image: HTMLImageElement) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return []

  const size = 120
  canvas.width = size
  canvas.height = size
  context.drawImage(image, 0, 0, size, size)
  const pixels = context.getImageData(0, 0, size, size).data
  const buckets = new Map<string, { count: number; red: number; green: number; blue: number }>()

  for (let index = 0; index < pixels.length; index += 20) {
    if (pixels[index + 3] < 180) continue
    const red = pixels[index]
    const green = pixels[index + 1]
    const blue = pixels[index + 2]
    if (red > 245 && green > 245 && blue > 245) continue
    const key = `${Math.round(red / 40)}-${Math.round(green / 40)}-${Math.round(blue / 40)}`
    const bucket = buckets.get(key) ?? { count: 0, red: 0, green: 0, blue: 0 }
    bucket.count += 1
    bucket.red += red
    bucket.green += green
    bucket.blue += blue
    buckets.set(key, bucket)
  }

  return [...buckets.values()]
    .sort((first, second) => second.count - first.count)
    .slice(0, 6)
    .map((bucket) =>
      rgbToHex(
        Math.round(bucket.red / bucket.count),
        Math.round(bucket.green / bucket.count),
        Math.round(bucket.blue / bucket.count),
      ),
    )
}

const uploadLogo = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 3.5 * 1024 * 1024) {
    message.value = localizeUi('Logo must be smaller than 3.5 MB.')
    return
  }

  isExtracting.value = true
  const reader = new FileReader()
  reader.onload = () => {
    const source = String(reader.result)
    const image = new Image()
    image.onload = () => {
      form.value.logo = source
      form.value.extractedColors = extractColors(image)
      isExtracting.value = false
    }
    image.onerror = () => {
      message.value = localizeUi('The selected image could not be processed.')
      isExtracting.value = false
    }
    image.src = source
  }
  reader.readAsDataURL(file)
}

const applyDetectedColors = () => {
  const [primary, secondary, accent] = form.value.extractedColors
  if (primary) form.value.primaryColor = primary
  if (secondary) form.value.secondaryColor = secondary
  if (accent) form.value.accentColor = accent
}

const restoreDefaults = () => {
  form.value = {
    ...defaultIdentity.value,
    appearance: normalizeAppearance(defaultIdentity.value.appearance),
    extractedColors: [...defaultIdentity.value.extractedColors],
  }
}

const save = async () => {
  if (isSaving.value || isInitializing.value) return
  if (!form.value.name.trim()) {
    message.value = localizeUi('Identity name is required.')
    return
  }
  isSaving.value = true
  message.value = ''
  try {
    await saveIdentity({ ...form.value, name: form.value.name.trim() })
    copySavedIdentity()
    message.value = localizeUi('System identity has been saved and applied.')
  } catch (error) {
    message.value = `${translateMessage(error instanceof Error ? error.message : 'Could not save the organization identity.')} ${localizeUi('Your draft is still here.')}`
  } finally {
    isSaving.value = false
  }
}

const reset = async () => {
  if (isSaving.value || isInitializing.value) return
  isSaving.value = true
  message.value = ''
  try {
    await resetIdentity()
    copySavedIdentity()
    message.value = localizeUi('Default system identity has been restored.')
  } catch (error) {
    message.value =
      error instanceof Error ? error.message : 'Could not reset the organization identity.'
  } finally {
    isSaving.value = false
  }
}

let loadGeneration = 0
const load = async (retry = false) => {
  const request = ++loadGeneration
  isInitializing.value = true
  try {
    await loadOrganizationIdentity(retry)
    if (request === loadGeneration) copySavedIdentity()
  } finally {
    if (request === loadGeneration) isInitializing.value = false
  }
}
onMounted(() => void load())
</script>

<template>
  <main class="identity-page hse-identity">
    <header class="identity-hero">
      <div>
        <span class="eyebrow">{{ $t('emailSettings.back') }}</span>
        <h1>{{ $t('system_identity') }}</h1>
        <p>
          {{
            $t(
              'Customize your logo, interface colors, typography, header, and sidebar layout across HSE.Cloud.Ai.',
            )
          }}
        </p>
      </div>
      <div class="active-badge" :class="{ inactive: !form.isActive }">
        <span></span>{{ form.isActive ? $t('Active identity') : $t('Identity disabled') }}
      </div>
    </header>

    <p v-if="message" class="identity-message" role="status">{{ translateMessage(message) }}</p>

    <p v-if="identityLoadError" class="identity-message" role="alert">
      {{
        $t(
          'Could not load the organization identity. The available browser cache or HSE defaults are shown.',
        )
      }}
      {{ identityLoadError }}
      <button
        type="button"
        class="button ghost"
        :disabled="isInitializing || isSaving"
        @click="load(true)"
      >
        {{ $t('Retry loading') }}
      </button>
    </p>
    <p v-if="identityCacheWarning" class="identity-message" role="status">
      {{ identityCacheWarning }}
    </p>
    <p v-if="isInitializing" class="identity-message" role="status">
      {{ $t('Loading organization identity…') }}
    </p>
    <fieldset v-else class="identity-controls" :disabled="isSaving">
      <div class="identity-workspace">
        <nav
          class="identity-tabs"
          role="tablist"
          aria-orientation="vertical"
          :aria-label="$t('System customization')"
        >
          <button
            v-for="(tab, index) in tabs"
            :id="`identity-tab-${tab.id}`"
            :key="tab.id"
            type="button"
            role="tab"
            :aria-selected="activeTab === tab.id"
            :aria-controls="`identity-panel-${tab.id}`"
            :tabindex="activeTab === tab.id ? 0 : -1"
            @click="activeTab = tab.id"
            @keydown.down.prevent="navigateTab($event, index)"
            @keydown.up.prevent="navigateTab($event, index)"
            @keydown.home.prevent="navigateTab($event, index)"
            @keydown.end.prevent="navigateTab($event, index)"
          >
            {{ $t(tab.label) }}
          </button>
        </nav>
        <div class="identity-tab-content">
          <div
            v-show="activeTab === 'brand'"
            id="identity-panel-brand"
            role="tabpanel"
            aria-labelledby="identity-tab-brand"
          >
            <section class="identity-shell">
              <header class="section-header">
                <div>
                  <span class="eyebrow">{{ $t('Brand controls') }}</span>
                  <h2>{{ $t('Identity details') }}</h2>
                  <p>{{ $t('Manage the logo, active palette, and live system preview.') }}</p>
                </div>
                <button type="button" class="button ghost danger" @click="reset">
                  {{ $t('Reset identity') }}
                </button>
              </header>

              <div class="identity-grid">
                <section class="identity-card logo-card">
                  <div class="field-group">
                    <div class="field-label">
                      <label for="identity-name">{{ $t('Identity name') }}</label>
                      <FieldHelpIcon
                        :text="$t('A recognizable name for this organization identity profile.')"
                      />
                    </div>
                    <input
                      dir="auto"
                      id="identity-name"
                      v-model="form.name"
                      type="text"
                      placeholder="HSE.Cloud.Ai"
                    />
                  </div>

                  <div class="field-label">
                    <span>{{ $t('Organization logo') }}</span>
                    <FieldHelpIcon
                      :text="
                        $t(
                          'Upload a logo to use in the application header and automatically extract a matching palette.',
                        )
                      "
                    />
                  </div>
                  <button type="button" class="logo-dropzone" @click="fileInput?.click()">
                    <img v-if="form.logo" :src="form.logo" :alt="$t('Organization logo preview')" />
                    <span v-else class="logo-placeholder"
                      ><b>+</b> {{ $t('Upload organization logo') }}</span
                    >
                    <small>{{
                      isExtracting
                        ? $t('Extracting colors…')
                        : $t('PNG, JPG, SVG or WebP · max 3.5 MB')
                    }}</small>
                  </button>
                  <input
                    ref="fileInput"
                    class="sr-only"
                    type="file"
                    accept="image/*"
                    @change="uploadLogo"
                  />

                  <label class="toggle-row" for="identity-active">
                    <input id="identity-active" v-model="form.isActive" type="checkbox" />
                    <span class="toggle"></span>
                    <span
                      ><b>{{ $t('Active identity') }}</b
                      ><small>{{ $t('Apply this identity throughout the system.') }}</small></span
                    >
                    <FieldHelpIcon
                      :text="
                        $t(
                          'Disable this option to temporarily use the default HSE identity without deleting your saved choices.',
                        )
                      "
                    />
                  </label>
                </section>

                <section class="identity-card palette-card">
                  <div class="card-heading">
                    <div>
                      <span class="eyebrow">{{ $t('Color system') }}</span>
                      <h3>{{ $t('Current palette') }}</h3>
                    </div>
                    <div class="palette-dots">
                      <i :style="{ background: form.primaryColor }"></i
                      ><i :style="{ background: form.secondaryColor }"></i
                      ><i :style="{ background: form.accentColor }"></i>
                    </div>
                  </div>

                  <div
                    v-for="field in [
                      {
                        key: 'primaryColor',
                        label: 'Primary color',
                        help: 'Used for primary buttons, links, active navigation, and key highlights.',
                      },
                      {
                        key: 'secondaryColor',
                        label: 'Secondary color',
                        help: 'Used for strong headings, supporting surfaces, and contrasting brand elements.',
                      },
                      {
                        key: 'accentColor',
                        label: 'Accent color',
                        help: 'Used for emphasis, alerts, badges, and complementary visual details.',
                      },
                    ]"
                    :key="field.key"
                    class="color-row"
                  >
                    <div class="field-label">
                      <label :for="`identity-${field.key}`">{{
                        translateMessage(field.label)
                      }}</label
                      ><FieldHelpIcon :text="field.help" />
                    </div>
                    <div class="color-control">
                      <input
                        :id="`identity-${field.key}`"
                        v-model="form[field.key as keyof SystemIdentity]"
                        type="color"
                      /><strong>{{ form[field.key as keyof SystemIdentity] }}</strong>
                    </div>
                  </div>

                  <div class="extracted-block">
                    <div class="field-label">
                      <span>{{ $t('Colors extracted from logo') }}</span
                      ><FieldHelpIcon
                        :text="
                          $t(
                            'These dominant colors were detected from the uploaded logo. Select one to use it as the primary color.',
                          )
                        "
                      />
                    </div>
                    <div v-if="form.extractedColors.length" class="swatches">
                      <button
                        v-for="color in form.extractedColors"
                        :key="color"
                        type="button"
                        :style="{ background: color }"
                        :title="$t('Use {color}', { color })"
                        @click="form.primaryColor = color"
                      >
                        <span>{{ color }}</span>
                      </button>
                    </div>
                    <p v-else>{{ $t('Upload a logo to generate a suggested color palette.') }}</p>
                  </div>

                  <div class="button-row">
                    <button
                      type="button"
                      class="button"
                      :disabled="form.extractedColors.length < 3"
                      @click="applyDetectedColors"
                    >
                      {{ $t('Apply detected colors') }}
                    </button>
                    <button type="button" class="button ghost" @click="restoreDefaults">
                      {{ $t('Use HSE defaults') }}
                    </button>
                  </div>
                </section>
              </div>
            </section>
          </div>
          <div
            v-show="activeTab === 'colors'"
            id="identity-panel-colors"
            role="tabpanel"
            aria-labelledby="identity-tab-colors"
          >
            <IdentityColorEditor v-model="form.appearance" />
          </div>
          <div
            v-show="activeTab === 'fonts'"
            id="identity-panel-fonts"
            role="tabpanel"
            aria-labelledby="identity-tab-fonts"
          >
            <IdentityTypographyEditor v-model="form.appearance.typography" />
          </div>
          <div
            v-show="activeTab === 'layout'"
            id="identity-panel-layout"
            role="tabpanel"
            aria-labelledby="identity-tab-layout"
          >
            <IdentityLayoutEditor v-model="form.appearance" />
          </div>
          <div
            v-show="activeTab === 'sidebar'"
            id="identity-panel-sidebar"
            role="tabpanel"
            aria-labelledby="identity-tab-sidebar"
          >
            <section class="identity-shell">
              <header class="section-header">
                <div>
                  <h2>{{ $t('Sidebar navigation') }}</h2>
                  <p>
                    {{
                      $t(
                        'Rename sidebar tabs and items, change their order, or move items between groups. Click Save and apply identity to apply your choice.',
                      )
                    }}
                  </p>
                </div>
              </header>
              <label class="toggle-row" for="identity-sidebar-expanded">
                <input
                  id="identity-sidebar-expanded"
                  v-model="form.appearance.sidebarMode"
                  type="checkbox"
                  role="switch"
                  true-value="expanded"
                  false-value="compact"
                />
                <span class="toggle" aria-hidden="true"></span>
                <span>
                  <b>{{ $t('Always-open sidebar') }}</b>
                  <small>{{
                    $t(
                      'Show all group titles and available routes together. Turn off to use the compact sidebar.',
                    )
                  }}</small>
                </span>
              </label>
            </section>
            <IdentitySidebarEditor v-model="form.appearance" />
          </div>
          <div
            v-if="activeTab === 'charts'"
            id="identity-panel-charts"
            role="tabpanel"
            aria-labelledby="identity-tab-charts"
          >
            <IdentityDashboardEditor
              v-model="form.appearance.dashboard"
              :brand-colors="[form.primaryColor, form.accentColor, form.secondaryColor]"
            />
          </div>
          <div
            v-if="activeTab === 'preview'"
            id="identity-panel-preview"
            role="tabpanel"
            aria-labelledby="identity-tab-preview"
          >
            <IdentityPreview :identity="form" />
          </div>
        </div>
      </div>

      <button class="save-button" type="button" :disabled="isSaving" @click="save">
        {{ isSaving ? $t('Saving identity…') : $t('Save and apply identity') }}
      </button>
    </fieldset>
  </main>
</template>

<style scoped>
.identity-workspace {
  display: grid;
  grid-template-columns: 225px minmax(0, 1fr);
  gap: 1.25rem;
  align-items: start;
}
.identity-tabs {
  position: sticky;
  top: 1rem;
  display: grid;
  gap: 0.4rem;
  padding: 0.6rem;
  border: 1px solid var(--main-border);
  border-radius: 16px;
  background: var(--surface-1);
}
.identity-tabs button {
  text-align: start;
  border: 0;
  border-radius: 10px;
  padding: 0.9rem;
  background: transparent;
  color: var(--text-soft);
  cursor: pointer;
  font: inherit;
}
.identity-tabs button[aria-selected='true'] {
  background: color-mix(in srgb, var(--PrimaryColor) 12%, var(--surface-1));
  color: var(--PrimaryColor);
  font-weight: 700;
}
.identity-tab-content {
  min-width: 0;
}
.identity-tab-content > [role='tabpanel'] {
  display: grid;
  gap: 1.25rem;
}
@media (max-width: 850px) {
  .identity-workspace {
    grid-template-columns: 1fr;
  }
  .identity-tabs {
    position: static;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.identity-controls {
  display: contents;
}
.identity-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: clamp(1rem, 2vw, 1.75rem);
  color: var(--text-strong);
}
.identity-hero,
.section-header,
.card-heading,
.field-label,
.toggle-row,
.color-control,
.button-row {
  display: flex;
  align-items: center;
}
.identity-hero,
.identity-shell {
  border: 1px solid var(--main-border);
  border-radius: 22px;
  background: var(--surface-1);
  box-shadow: 0 16px 38px color-mix(in srgb, var(--text-strong) 8%, transparent);
}
.identity-hero {
  justify-content: space-between;
  gap: 1rem;
  padding: clamp(1.25rem, 3vw, 2rem);
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--PrimaryColor) 13%, transparent),
      transparent 38%
    ),
    var(--surface-1);
}
h1,
h2,
h3,
p {
  margin: 0;
}
h1 {
  margin: 0.3rem 0;
  font-size: clamp(1.8rem, 3vw, 2.5rem);
}
h2 {
  margin-top: 0.25rem;
  font-size: 1.45rem;
}
h3 {
  margin-top: 0.2rem;
  font-size: 1.05rem;
}
p {
  color: var(--text-soft);
}
.eyebrow {
  color: var(--PrimaryColor);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.active-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  padding: 0.55rem 0.8rem;
  border: 1px solid color-mix(in srgb, var(--green) 35%, var(--main-border));
  border-radius: 999px;
  background: color-mix(in srgb, var(--green) 10%, var(--surface-1));
  color: var(--green);
  font-weight: 800;
}
.active-badge span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 5px color-mix(in srgb, currentColor 12%, transparent);
}
.active-badge.inactive {
  color: var(--text-muted);
}
.identity-message {
  padding: 0.85rem 1rem;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 24%, var(--main-border));
  border-radius: 12px;
  background: color-mix(in srgb, var(--PrimaryColor) 7%, var(--surface-1));
  color: var(--PrimaryColor);
  font-weight: 700;
}
.identity-shell {
  padding: clamp(1rem, 2.2vw, 1.5rem);
}
.section-header {
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.identity-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
.identity-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.15rem;
  border: 1px solid var(--main-border);
  border-radius: 18px;
  background: linear-gradient(145deg, var(--surface-1), var(--surface-2));
}
.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.field-label {
  gap: 0.45rem;
  width: fit-content;
  font-weight: 800;
}
input[type='text'] {
  width: 100%;
  min-height: 46px;
  padding: 0.75rem 1rem;
  border: 1px solid var(--main-border);
  border-radius: 12px;
  background: var(--surface-1);
  color: var(--text-strong);
  outline: none;
}
input[type='text']:focus {
  border-color: var(--PrimaryColor);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--PrimaryColor) 15%, transparent);
}
.logo-dropzone {
  display: grid;
  place-items: center;
  gap: 0.55rem;
  min-height: 190px;
  padding: 1rem;
  border: 1.5px dashed color-mix(in srgb, var(--PrimaryColor) 45%, var(--main-border));
  border-radius: 16px;
  background: color-mix(in srgb, var(--PrimaryColor) 5%, var(--surface-1));
  color: var(--PrimaryColor);
  cursor: pointer;
}
.logo-dropzone img {
  max-width: 85%;
  max-height: 125px;
  object-fit: contain;
}
.logo-dropzone small {
  color: var(--text-muted);
}
.logo-placeholder {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 800;
}
.logo-placeholder b {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--PrimaryColor);
  color: var(--text-on-brand);
  font-size: 1.4rem;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
}
.toggle-row {
  gap: 0.65rem;
  cursor: pointer;
}
.toggle-row > input {
  position: absolute;
  opacity: 0;
}
.toggle {
  flex-shrink: 0;
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 999px;
  background: var(--surface-3);
  transition: 0.2s;
}
#identity-sidebar-expanded + .toggle {
  pointer-events: none;
}
.toggle-row input:focus-visible + .toggle {
  outline: 3px solid var(--PrimaryColor);
  outline-offset: 3px;
}
.toggle::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--surface-1);
  box-shadow: 0 2px 5px color-mix(in srgb, var(--text-strong) 20%, transparent);
  transition: 0.2s;
}
.toggle-row input:checked + .toggle {
  background: var(--PrimaryColor);
}
.toggle-row input:checked + .toggle::after {
  transform: translateX(20px);
}
.toggle-row > span:nth-of-type(2) {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.toggle-row small {
  color: var(--text-muted);
}
.card-heading {
  justify-content: space-between;
}
.palette-dots {
  display: flex;
}
.palette-dots i {
  width: 25px;
  height: 25px;
  margin-inline-start: -5px;
  border: 3px solid var(--surface-1);
  border-radius: 50%;
}
.color-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem;
  border: 1px solid var(--main-border);
  border-radius: 13px;
  background: var(--surface-1);
}
.color-control {
  gap: 0.65rem;
}
.color-control input {
  width: 46px;
  height: 36px;
  padding: 2px;
  border: 1px solid var(--main-border);
  border-radius: 9px;
  background: var(--surface-1);
}
.color-control strong {
  min-width: 70px;
  color: var(--text-soft);
  font-family: monospace;
}
.extracted-block {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding-top: 0.25rem;
}
.extracted-block p {
  font-size: 0.86rem;
}
.swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}
.swatches button {
  position: relative;
  width: 42px;
  height: 42px;
  border: 3px solid var(--surface-1);
  border-radius: 12px;
  box-shadow: 0 0 0 1px var(--main-border);
  cursor: pointer;
  transition: transform 0.18s;
}
.swatches button:hover {
  transform: translateY(-3px);
}
.swatches span {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.button-row {
  flex-wrap: wrap;
  gap: 0.65rem;
}
.button,
.save-button {
  min-height: 43px;
  padding: 0.7rem 1rem;
  border: 1px solid var(--PrimaryColor);
  border-radius: 11px;
  background: var(--PrimaryColor);
  color: var(--text-on-brand);
  font-weight: 800;
  cursor: pointer;
}
.button.ghost {
  background: var(--surface-1);
  color: var(--PrimaryColor);
}
.button.danger {
  border-color: color-mix(in srgb, var(--Red) 35%, var(--main-border));
  color: var(--Red);
}
.button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
.save-button {
  width: 100%;
  min-height: 50px;
  font-size: 1rem;
  box-shadow: 0 10px 20px color-mix(in srgb, var(--PrimaryColor) 24%, transparent);
}
.save-button:disabled {
  opacity: 0.65;
}
@media (max-width: 900px) {
  .identity-grid {
    grid-template-columns: 1fr;
  }
  .identity-hero,
  .section-header {
    align-items: flex-start;
    flex-direction: column;
  }
  .active-badge {
    align-self: flex-start;
  }
}
@media (max-width: 520px) {
  .identity-page {
    padding: 0.75rem;
  }
  .color-row {
    align-items: flex-start;
    flex-direction: column;
  }
  .button-row .button {
    width: 100%;
  }
}
</style>
