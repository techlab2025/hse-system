import { test } from 'node:test'
import assert from 'node:assert/strict'
import { defaultAppearance, normalizeAppearance } from '../appearance.ts'
import { fontStack, googleFontUrl } from '../typography.ts'

test('old identities without appearance keep current styling and layout', () => {
  assert.deepEqual(normalizeAppearance(undefined), defaultAppearance())
  assert.deepEqual(normalizeAppearance(null), defaultAppearance())
})
test('stored colors accept only supported six digit hex values', () => {
  assert.deepEqual(
    normalizeAppearance({
      colors: {
        headerBackground: '#123abc',
        headerText: 'red',
        sidebarText: 'url(bad)',
        unknown: '#ffffff',
      },
    }).colors,
    { headerBackground: '#123abc' },
  )
})
test('invalid or incomplete orders never remove or duplicate header controls', () => {
  assert.deepEqual(
    normalizeAppearance({ headerOrder: ['profile', 'profile', 'missing'] }).headerOrder,
    ['actions', 'brand', 'project'],
  )
  assert.equal(normalizeAppearance({ breadcrumbPosition: 'missing' }).breadcrumbPosition, 'left')
})
test('drafts do not mutate defaults or saved configurations', () => {
  const saved = normalizeAppearance({ colors: { headerText: '#123456' } })
  const draft = normalizeAppearance(saved)
  draft.colors.headerText = '#654321'
  draft.headerOrder.reverse()
  assert.equal(saved.colors.headerText, '#123456')
  assert.equal(saved.headerOrder[0], 'brand')
  assert.deepEqual(defaultAppearance().colors, {})
})

test('flat saved header layouts migrate to one group with preserved internal order', () => {
  const migrated = normalizeAppearance({
    headerOrder: ['profile', 'brand', 'notifications', 'project', 'language'],
  })
  assert.deepEqual(migrated.headerOrder, ['actions', 'brand', 'project'])
  assert.deepEqual(migrated.headerActionOrder, ['profile', 'notifications', 'language'])
})
test('nested controls order is normalized independently of the container order', () => {
  const result = normalizeAppearance({
    headerOrder: ['project', 'actions', 'brand'],
    headerActionOrder: ['notifications', 'notifications', 'unknown', 'profile'],
  })
  assert.deepEqual(result.headerOrder, ['project', 'actions', 'brand'])
  assert.deepEqual(result.headerActionOrder, ['notifications', 'profile', 'language'])
})

test('section colors persist independently and default to no override', () => {
  const saved = normalizeAppearance({
    colors: { sectionBackground: '#123456', sectionText: '#fefefe' },
  })
  assert.deepEqual(normalizeAppearance(JSON.parse(JSON.stringify(saved))).colors, {
    sectionBackground: '#123456',
    sectionText: '#fefefe',
  })
  assert.equal(defaultAppearance().colors.sectionBackground, undefined)
  assert.equal(defaultAppearance().colors.sectionText, undefined)
})

test('sidebar orders migrate partial layouts and keep every available destination', () => {
  const defaults = defaultAppearance()
  const result = normalizeAppearance({
    sidebarOrder: ['reports', 'reports', 'unknown'],
    sidebarItemOrder: {
      operations: ['Inspection', 'Inspection', 'missing', 'Projects'],
      'operations/equipment': ['Machines', 'Tools'],
      unknown: ['fake-route'],
    },
  })
  assert.equal(result.sidebarOrder[0], 'reports')
  assert.deepEqual(new Set(result.sidebarOrder), new Set(defaults.sidebarOrder))
  assert.deepEqual(result.sidebarItemOrder.operations.slice(0, 2), ['Inspection', 'Projects'])
  assert.deepEqual(
    new Set(result.sidebarItemOrder.operations),
    new Set(defaults.sidebarItemOrder.operations),
  )
  assert.deepEqual(result.sidebarItemOrder['operations/equipment'], [
    'Machines',
    'Tools',
    'Devices',
  ])
  assert.equal(result.sidebarItemOrder.unknown, undefined)
})

test('saved sidebar drafts are independent and survive serialization', () => {
  const saved = defaultAppearance()
  const draft = normalizeAppearance(saved)
  draft.sidebarOrder.reverse()
  draft.sidebarItemOrder.operations.reverse()
  assert.equal(saved.sidebarOrder[0], 'overview')
  assert.equal(saved.sidebarItemOrder.operations[0], 'Projects')
  assert.deepEqual(normalizeAppearance(JSON.parse(JSON.stringify(draft))), draft)
})

test('tag, active navigation, and input overrides persist without changing old identities', () => {
  const colors = {
    tagBackground: '#123456',
    tagText: '#ffffff',
    sidebarActiveBackground: '#234567',
    sidebarActiveText: '#fefefe',
    inputBackground: '#345678',
    inputText: '#efefef',
    inputBorder: '#456789',
  }
  assert.deepEqual(normalizeAppearance({ colors }).colors, colors)
  assert.deepEqual(normalizeAppearance({}).colors, {})
})

test('old identities keep default typography and typography drafts stay independent', () => {
  const saved = normalizeAppearance({})
  const draft = normalizeAppearance(saved)
  draft.typography.fontFamily = 'Cairo'
  draft.typography.fontSize = 18
  draft.typography.fontColor = '#123456'
  assert.equal(saved.typography.fontFamily, '')
  assert.equal(saved.typography.fontSize, null)
  assert.equal(saved.typography.fontColor, '')
  assert.deepEqual(normalizeAppearance(JSON.parse(JSON.stringify(draft))), draft)
})

test('typography accepts Google family names and validates sizes and colors', () => {
  assert.deepEqual(
    normalizeAppearance({
      typography: {
        fontFamily: '  Noto   Sans Arabic  ',
        fontSize: 17.6,
        headingSize: 90,
        fontColor: '#112233',
        headingColor: 'red',
      },
    }).typography,
    {
      fontFamily: 'Noto Sans Arabic',
      fontSize: 18,
      headingSize: 48,
      fontColor: '#112233',
      headingColor: '',
    },
  )
  const invalid = normalizeAppearance({
    typography: {
      fontFamily: 'url(https://example.com)',
      fontSize: '18px',
      headingSize: NaN,
      fontColor: 'var(--color)',
      headingColor: '#fff',
    },
  }).typography
  assert.deepEqual(invalid, defaultAppearance().typography)
  assert.equal(
    normalizeAppearance({ typography: { fontSize: -10, headingSize: 0 } }).typography.fontSize,
    12,
  )
})

test('Google font requests support curated weights and custom families with one available weight', () => {
  assert.equal(
    googleFontUrl('Cairo'),
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap',
  )
  assert.equal(
    googleFontUrl('Bebas Neue'),
    'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
  )
  assert.equal(googleFontUrl('url(bad)'), '')
  assert.equal(fontStack('bad"font'), '')
})
