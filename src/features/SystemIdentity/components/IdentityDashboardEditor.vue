<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import {
  chartDefinitions,
  chartStyles,
  dashboardPanels,
  defaultDashboard,
  resolveChartColors,
  type ChartId,
  type DashboardSettings,
  type PanelId,
} from '../dashboard'
import DashboardCustomChart from '@/features/Home/presentation/Components/Dashboard/DashboardCustomChart.vue'
const props = defineProps<{ brandColors?: string[] }>()
const model = defineModel<DashboardSettings>({ required: true })
const selected = ref<ChartId>('safety')
const dragging = ref<PanelId | null>(null)
const settings = computed(() => model.value.charts[selected.value])
const labels: Record<string, string> = {
  default: 'Original style',
  bar: 'Vertical bars',
  horizontalBar: 'Horizontal bars',
  stackedBar: 'Stacked bars',
  line: 'Line',
  area: 'Area',
  pie: 'Pie',
  doughnut: 'Doughnut',
  polarArea: 'Polar area',
  radar: 'Radar',
  roundedBar: 'Rounded bars',
  horizontalStackedBar: 'Horizontal stacked bars',
  straightLine: 'Straight line',
  steppedLine: 'Stepped line',
  dashedLine: 'Dashed line',
  points: 'Points',
  stackedArea: 'Stacked area',
  radarOutline: 'Outline radar',
  semiDoughnut: 'Semicircle doughnut',
  mixed: 'Bars and lines',
}
const previewRows = computed(() =>
  ['North', 'South', 'East', 'West'].map((label, index) => ({
    id: label,
    label: t(label),
    segments:
      selected.value === 'safety' || selected.value === 'equipmentLocations'
        ? [
            {
              key: 'first',
              label: selected.value === 'safety' ? t('command.incidents') : t('Series A'),
              value: [12, 7, 9, 5][index]!,
              tone: 'blue',
            },
            {
              key: 'second',
              label: selected.value === 'safety' ? t('command.observations') : t('Series B'),
              value: [5, 9, 3, 8][index]!,
              tone: 'teal',
            },
          ]
        : [{ key: 'count', label: t('Records'), value: [12, 7, 9, 5][index]!, tone: 'blue' }],
  })),
)
const editableColors = computed(() => resolveChartColors(settings.value, props.brandColors))
function changeColor(index: number, event: Event) {
  const colors = [...editableColors.value]
  colors[index] = (event.target as HTMLInputElement).value
  settings.value.customColors = colors
}
function addColor() {
  if (editableColors.value.length < 12)
    settings.value.customColors = [...editableColors.value, '#64748b']
}
function removeColor() {
  if (editableColors.value.length > 1)
    settings.value.customColors = editableColors.value.slice(0, -1)
}
function move(id: PanelId, target: number) {
  const panels = [...model.value.panels]
  const from = panels.findIndex((panel) => panel.id === id)
  if (from < 0 || target < 0 || target >= panels.length) return
  panels.splice(target, 0, panels.splice(from, 1)[0]!)
  model.value = { ...model.value, panels }
}
function startDrag(event: DragEvent, id: PanelId) {
  dragging.value = id
  event.dataTransfer?.setData('text/plain', id)
}
function drop(index: number) {
  if (dragging.value) move(dragging.value, index)
  dragging.value = null
}
</script>
<template>
  <section class="identity-editor dashboard-editor">
    <header class="section-header">
      <div>
        <h2>{{ $t('Home charts and layout') }}</h2>
        <p>
          {{
            $t(
              'Choose chart styles and arrange the Home dashboard. Save and apply identity to publish your changes.',
            )
          }}
        </p>
      </div>
      <button class="button ghost" type="button" @click="model = defaultDashboard()">
        {{ $t('Reset dashboard') }}
      </button>
    </header>
    <h3>{{ $t('Dashboard positions') }}</h3>
    <p>
      {{
        $t(
          'Drag cards to reorder them, or use the move buttons. Hidden panels remain available here.',
        )
      }}
    </p>
    <ol class="layout-cards">
      <li
        v-for="(panel, index) in model.panels"
        :key="panel.id"
        :class="{ dragging: dragging === panel.id }"
        @dragover.prevent
        @drop.prevent="drop(index)"
      >
        <button
          type="button"
          draggable="true"
          class="drag-handle"
          :aria-label="$t('Drag to reorder')"
          @dragstart="startDrag($event, panel.id)"
          @dragend="dragging = null"
        >
          ⠿
        </button>
        <label class="panel-visible"
          ><input v-model="panel.visible" type="checkbox" />{{
            $t(dashboardPanels.find((item) => item.id === panel.id)!.label)
          }}</label
        >
        <label
          >{{ $t('Width')
          }}<select v-model="panel.width" :aria-label="$t('Width')">
            <option value="default">{{ $t('Original width') }}</option>
            <option value="half">{{ $t('Half width') }}</option>
            <option value="full">{{ $t('Full width') }}</option>
          </select></label
        >
        <button
          class="button ghost"
          type="button"
          :disabled="index === 0"
          :aria-label="`${$t('Move up')}: ${$t(dashboardPanels.find((item) => item.id === panel.id)!.label)}`"
          @click="move(panel.id, index - 1)"
        >
          ↑
        </button>
        <button
          class="button ghost"
          type="button"
          :disabled="index === model.panels.length - 1"
          :aria-label="`${$t('Move down')}: ${$t(dashboardPanels.find((item) => item.id === panel.id)!.label)}`"
          @click="move(panel.id, index + 1)"
        >
          ↓
        </button>
      </li>
    </ol>
    <div class="chart-editor-grid">
      <div class="chart-controls">
        <h3>{{ $t('Chart appearance') }}</h3>
        <label
          >{{ $t('Chart')
          }}<select v-model="selected" :aria-label="$t('Chart')">
            <option v-for="chart in chartDefinitions" :key="chart.id" :value="chart.id">
              {{ $t(chart.label) }}
            </option>
          </select></label
        >
        <label
          >{{ $t('Chart style')
          }}<select v-model="settings.type" :aria-label="$t('Chart style')">
            <option v-for="type in chartStyles" :key="type" :value="type">
              {{ $t(labels[type]!) }}
            </option>
          </select></label
        >
        <label
          >{{ $t('Chart palette')
          }}<select v-model="settings.palette" :aria-label="$t('Chart palette')">
            <option value="safety">{{ $t('Safety colors') }}</option>
            <option value="brand">{{ $t('Brand colors') }}</option>
            <option value="ocean">{{ $t('Ocean') }}</option>
            <option value="custom">{{ $t('Custom chart colors') }}</option>
          </select></label
        >
        <fieldset v-if="settings.palette === 'custom'" class="chart-color-editor">
          <legend>{{ $t('Custom chart colors') }}</legend>
          <p>
            {{
              $t(
                'Colors apply to series in grouped charts and categories in single-series or circular charts. Extra categories repeat these colors.',
              )
            }}
          </p>
          <div class="chart-color-grid">
            <label v-for="(color, index) in editableColors" :key="index" class="chart-color-field">
              <span>{{
                selected === 'safety' && index < 2
                  ? $t(index === 0 ? 'command.incidents' : 'command.observations')
                  : $t('Chart color {number}', { number: index + 1 })
              }}</span>
              <input
                type="color"
                :value="color"
                :aria-label="$t('Chart color {number}', { number: index + 1 })"
                @input="changeColor(index, $event)"
              />
              <small dir="ltr">{{ color }}</small>
            </label>
          </div>
          <div class="chart-color-actions">
            <button type="button" :disabled="editableColors.length >= 12" @click="addColor">
              {{ $t('Add chart color') }}
            </button>
            <button type="button" :disabled="editableColors.length <= 1" @click="removeColor">
              {{ $t('Remove last color') }}
            </button>
            <button type="button" @click="settings.customColors = []">
              {{ $t('Reset chart colors') }}
            </button>
          </div>
        </fieldset>
        <label
          >{{ $t('Chart height') }} ({{ settings.height }} px)<input
            v-model.number="settings.height"
            type="range"
            min="200"
            max="600"
            step="20"
        /></label>
        <label class="check-control"
          ><input v-model="settings.legend" type="checkbox" />{{ $t('Show legend') }}</label
        >
        <label class="check-control"
          ><input v-model="settings.grid" type="checkbox" />{{ $t('Show grid') }}</label
        >
      </div>
      <div class="chart-preview">
        <h3>{{ $t('Chart preview') }}</h3>
        <p>{{ $t('Sample data for preview only. Home uses your actual dashboard data.') }}</p>
        <DashboardCustomChart
          :rows="previewRows"
          :label="$t('Chart preview')"
          :settings="settings"
          :brand-colors="brandColors"
          :default-type="
            selected === 'equipment' ? 'doughnut' : selected === 'safety' ? 'bar' : 'horizontalBar'
          "
        />
      </div>
    </div>
    <p class="chart-credit">
      {{ $t('Charts powered by PrimeVue and Chart.js.') }}
      <a href="https://primevue.org/chart/" target="_blank" rel="noopener noreferrer">PrimeVue</a> ·
      <a href="https://www.chartjs.org/docs/latest/" target="_blank" rel="noopener noreferrer"
        >Chart.js</a
      >
    </p>
  </section>
</template>
<style scoped>
.dashboard-editor {
  padding: clamp(1rem, 2vw, 1.6rem);
  display: grid;
  gap: 1rem;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
}
h2,
h3,
p {
  margin: 0;
}
p {
  color: var(--text-soft);
}
.layout-cards {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.65rem;
}
.layout-cards li {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
  padding: 0.75rem;
  border: 1px solid var(--main-border);
  border-radius: 12px;
  background: var(--surface-1);
}
.layout-cards li.dragging {
  opacity: 0.5;
}
.panel-visible {
  flex: 1;
  min-width: 180px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.drag-handle {
  cursor: grab;
  background: transparent;
  border: 0;
  padding: 0.5rem;
  font-size: 1.6rem;
  color: var(--text-soft);
}
.chart-editor-grid {
  display: grid;
  grid-template-columns: minmax(200px, 1fr) minmax(0, 2fr);
  gap: 1.5rem;
  margin-top: 1rem;
}
.chart-controls {
  display: grid;
  align-content: start;
  gap: 1rem;
}
.chart-controls label {
  display: grid;
  gap: 0.45rem;
}
.chart-controls .check-control {
  display: flex;
  gap: 0.6rem;
  align-items: center;
}
select {
  display: block;
  width: 100%;
  padding: 0.55rem;
  border: 1px solid var(--main-border);
  border-radius: 8px;
  color: var(--text-strong);
  background: var(--surface-1);
}
.chart-color-editor {
  min-width: 0;
  border: 1px solid var(--main-border);
  border-radius: 10px;
  padding: 0.75rem;
  display: grid;
  gap: 0.75rem;
}
.chart-color-editor p {
  font-size: 0.8rem;
}
.chart-color-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}
.chart-color-field {
  min-width: 0;
  font-size: 0.8rem;
}
.chart-color-field input {
  width: 100%;
  height: 38px;
  cursor: pointer;
  border: 1px solid var(--main-border);
  border-radius: 6px;
  background: var(--surface-1);
}
.chart-color-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.chart-preview {
  min-width: 0;
  padding: 1rem;
  border: 1px solid var(--main-border);
  border-radius: 16px;
}
.chart-credit {
  font-size: 0.8rem;
}
a {
  color: var(--PrimaryColor);
}
@media (max-width: 850px) {
  .chart-editor-grid {
    grid-template-columns: 1fr;
  }
}
</style>
