import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  chartStyles,
  defaultDashboard,
  normalizeDashboard,
  resolveChartColors,
} from '../../src/features/SystemIdentity/dashboard'

test('legacy identities receive independent dashboard defaults', () => {
  const a = normalizeDashboard(undefined)
  const b = defaultDashboard()
  a.panels[0]!.visible = false
  a.charts.equipment.type = 'pie'
  assert.equal(b.panels[0]!.visible, true)
  assert.equal(b.charts.equipment.type, 'default')
})
test('invalid saved settings are repaired, duplicates removed and new panels appended', () => {
  const value = normalizeDashboard({
    panels: [
      { id: 'equipment', visible: false, width: 'full' },
      { id: 'equipment' },
      null,
      { id: 'unknown' },
    ],
    charts: {
      safety: { type: 'scatter', palette: 'unknown', height: Infinity },
      equipment: { type: 'pie', palette: 'brand', height: 900, legend: false, grid: false },
    },
  })
  assert.deepEqual(value.panels[0], { id: 'equipment', visible: false, width: 'full' })
  assert.equal(value.panels.length, defaultDashboard().panels.length)
  assert.equal(new Set(value.panels.map((panel) => panel.id)).size, value.panels.length)
  assert.deepEqual(value.charts.safety, defaultDashboard().charts.safety)
  assert.deepEqual(value.charts.equipment, {
    type: 'pie',
    palette: 'brand',
    customColors: [],
    height: 600,
    legend: false,
    grid: false,
  })
})

test('every chart style can be saved and restored without falling back to the original style', () => {
  for (const type of chartStyles) {
    const settings = defaultDashboard()
    settings.charts.safety.type = type
    settings.charts.equipment.type = type
    const restored = normalizeDashboard(JSON.parse(JSON.stringify(settings)))
    assert.equal(restored.charts.safety.type, type)
    assert.equal(restored.charts.equipment.type, type)
  }
})

test('custom chart colors retain positions, reject invalid colors and remain independent between charts', () => {
  const source = defaultDashboard()
  source.charts.safety.palette = 'custom'
  source.charts.safety.customColors = ['#112233', 'invalid', '#AABBCC']
  const result = normalizeDashboard(JSON.parse(JSON.stringify(source)))
  assert.deepEqual(result.charts.safety.customColors, ['#112233', '#14b8a6', '#AABBCC'])
  assert.deepEqual(resolveChartColors(result.charts.safety), ['#112233', '#14b8a6', '#AABBCC'])
  assert.deepEqual(result.charts.equipment.customColors, [])
  result.charts.safety.customColors.push('#000000')
  assert.equal(source.charts.safety.customColors.length, 3)
  assert.equal(
    normalizeDashboard({ charts: { safety: { customColors: Array(20).fill('#112233') } } }).charts
      .safety.customColors.length,
    12,
  )
  assert.equal(resolveChartColors({ ...result.charts.safety, customColors: [] }).length, 6)
})
