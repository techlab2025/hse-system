import test from 'node:test'
import assert from 'node:assert/strict'
import { baseCompile } from '@intlify/message-compiler'
import en from '../src/locales/en.json'
import ar from '../src/locales/ar.json'
import { setLocale, i18n } from '../src/localization/i18n'
import { primeVueLocale } from '../src/localization/primeVueLocale'
import TitleInterface from '../src/base/Data/Models/title_interface'
import { ObjectiveTargetTypeOptions } from '../src/features/Organization/objectives/Core/enums/objectivesEnums'
import { formatJoinDate } from '../src/base/Presentation/utils/date_format'

const flatten = (o: Record<string, unknown>, prefix = '', result: Record<string, string> = {}) => {
  for (const [key, value] of Object.entries(o)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') result[path] = value
    else if (value && typeof value === 'object')
      flatten(value as Record<string, unknown>, path, result)
  }
  return result
}

test('both catalogs have the same nonempty keys and interpolation variables', () => {
  const english = flatten(en),
    arabic = flatten(ar)
  assert.deepEqual(Object.keys(english).sort(), Object.keys(arabic).sort())
  const args = (v: string) => [...v.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort()
  for (const key of Object.keys(english)) {
    assert.ok(english[key].trim(), `Empty English: ${key}`)
    assert.ok(arabic[key].trim(), `Empty Arabic: ${key}`)
    assert.deepEqual(args(english[key]), args(arabic[key]), `Interpolation mismatch: ${key}`)
  }
})

test('every message compiles with the installed vue-i18n message compiler', () => {
  const errors: string[] = []
  for (const [locale, catalog] of Object.entries({ en, ar }))
    for (const [key, value] of Object.entries(flatten(catalog))) {
      baseCompile(value, { onError: (error) => errors.push(`${locale}:${key}: ${error.message}`) })
    }
  assert.deepEqual(errors, [])
})

test('PrimeVue Arabic covers every installed English locale and accessibility key', () => {
  const english = primeVueLocale('en'),
    arabic = primeVueLocale('ar')
  assert.deepEqual(Object.keys(arabic).sort(), Object.keys(english).sort())
  assert.deepEqual(Object.keys(arabic.aria).sort(), Object.keys(english.aria).sort())
  assert.equal(arabic.monthNames.length, 12)
  assert.equal(arabic.dayNames.length, 7)
  assert.equal(arabic.dateFormat, english.dateFormat)
})

test('developer enum labels are reactive and ordinary record values are preserved', () => {
  const record = new TitleInterface({ id: 99, title: 'Open' })
  const number = ObjectiveTargetTypeOptions.find((option) => option.id === 2)!
  setLocale('en')
  assert.equal(number.title, 'Number')
  setLocale('ar')
  assert.equal(number.title, 'عدد')
  assert.equal(number.id, 2)
  assert.equal(record.title, 'Open')
  setLocale('en')
  assert.equal(number.title, 'Number')
})

test('display locale changes do not change API date serialization', () => {
  const date = new Date(2026, 9, 27)
  setLocale('en')
  const value = formatJoinDate(date)
  setLocale('ar')
  assert.equal(formatJoinDate(date), value)
  assert.equal(i18n.global.locale.value, 'ar')
  setLocale('en')
})

test('backend-provided bilingual titles react without translating user overrides', () => {
  const record = new TitleInterface({
    id: 42,
    title: 'Fallback',
    localizedTitles: [
      { locale: 'en', title: 'Workshop' },
      { locale: 'ar', title: 'الورشة' },
    ],
  })
  setLocale('en')
  assert.equal(record.title, 'Workshop')
  setLocale('ar')
  assert.equal(record.title, 'الورشة')
  record.title = 'My custom workshop'
  setLocale('en')
  assert.equal(record.title, 'My custom workshop')
  setLocale('ar')
  assert.equal(record.title, 'My custom workshop')
  setLocale('en')
})

test('record adapters localize only supplied translations and preserve edits and identifiers', async () => {
  const { localizedRecord } = await import('../src/localization/records')
  const payload = {
    title: 'Open',
    titles: [
      { locale: 'en', title: 'Open' },
      { locale: 'ar', title: 'مفتوح' },
    ],
  }
  const record = localizedRecord({ id: 77, title: 'Open', code: 'EN-77' }, payload)
  const ordinary = localizedRecord({ title: 'Open' }, { title: 'Open' })
  setLocale('en')
  assert.equal(record.title, 'Open')
  setLocale('ar')
  assert.equal(record.title, 'مفتوح')
  assert.equal(ordinary.title, 'Open')
  assert.equal(record.code, 'EN-77')
  record.title = 'Personal title'
  setLocale('en')
  assert.equal(record.title, 'Personal title')
  setLocale('ar')
  assert.equal(record.title, 'Personal title')
  setLocale('en')
})

test('delete action confirmation is independent of the current display language', async () => {
  const { isDeleteAction } = await import('../src/shared/HelpersComponents/actionItems')
  const englishAction = { text: en.delete }
  const arabicAction = { text: ar.delete }
  for (const locale of ['en', 'ar']) {
    setLocale(locale)
    assert.ok(isDeleteAction(englishAction))
    assert.ok(isDeleteAction(arabicAction))
    assert.ok(isDeleteAction({ text: 'Custom deletion label', isDelete: true }))
    assert.equal(isDeleteAction({ text: en.delete, isDelete: false }), false)
  }
  setLocale('en')
})

test('interpolated system feedback can change language while preserving its values', async () => {
  const { translate } = await import('../src/localization/i18n')
  const { translateMessage } = await import('../src/localization/messages')
  const { localizedApiMessage } = await import('../src/localization/apiMessages')
  setLocale('en')
  const warning = translate('validation.eventTimeRequired', { row: 3 })
  setLocale('ar')
  assert.equal(translateMessage(warning), 'الحدث 3: يجب تحديد الوقت.')
  assert.equal(
    localizedApiMessage({ code: 'FORBIDDEN', message: 'Forbidden' }),
    i18n.global.t('network.forbidden'),
  )
  assert.equal(
    localizedApiMessage({ message: 'Unrecognized business explanation' }),
    'Unrecognized business explanation',
  )
  setLocale('en')
})

test('standard backend errors localize while technical failures receive a readable fallback', async () => {
  const { localizedApiMessage } = await import('../src/localization/apiMessages')
  const { ErrorModel, ErrorType } = await import(
    '../src/base/core/networkStructure/Resources/errors/errorModel'
  )
  setLocale('en')
  const error = new ErrorModel(i18n.global.t('network.forbidden'), ErrorType.serviceSide)
  setLocale('ar')
  assert.equal(error.title, i18n.global.t('network.forbidden'))
  assert.equal(
    localizedApiMessage({ message: 'Unauthenticated.' }),
    i18n.global.t('network.unauthorized'),
  )
  assert.equal(
    localizedApiMessage({ message: 'SQLSTATE[42000]: query failed' }),
    i18n.global.t('network.server'),
  )
  assert.equal(
    localizedApiMessage({ message: 'An unfamiliar business constraint' }),
    'An unfamiliar business constraint',
  )
  setLocale('en')
})

test('legacy navigation aliases resolve to catalog keys in both languages', async () => {
  const { navigationLabelKeys, translateNavigationLabel } = await import(
    '../src/localization/navigation'
  )
  for (const locale of ['en', 'ar']) {
    setLocale(locale)
    for (const [label, key] of Object.entries(navigationLabelKeys)) {
      assert.ok(i18n.global.te(key), `${locale}: ${label} -> ${key}`)
      assert.equal(translateNavigationLabel(label), i18n.global.t(key))
    }
  }
  assert.equal(translateNavigationLabel('Show incident'), 'تفاصيل الحادث')
  setLocale('en')
})

test('default form-validation messages use bilingual catalog keys', async () => {
  const configuration = await import('../src/shared/config/formValidation')
  const keys = new Set<string>()
  const visit = (value: unknown) => {
    if (!value || typeof value !== 'object') return
    for (const [key, child] of Object.entries(value)) {
      if (key === 'message' && typeof child === 'string' && child) keys.add(child)
      else visit(child)
    }
  }
  visit(configuration.formValidation)
  visit(configuration.requestValidation)
  for (const locale of ['en', 'ar']) {
    setLocale(locale)
    for (const key of keys) assert.ok(i18n.global.te(key), `${locale}: ${key}`)
  }
  setLocale('en')
})

test('audit status filtering uses stable values while labels follow the locale', async () => {
  const {
    auditPlanStatusCode,
    auditPlanStatusLabel,
    ncrStatusLabel,
    ncrCategoryLabel,
    isMajorNcrCategory,
  } = await import('../src/features/Organization/InternalAudit/Presentation/utils/labels')
  const option = new TitleInterface({ id: 2, title: 'planned', translationKey: 'Planned' })
  for (const locale of ['en', 'ar']) {
    setLocale(locale)
    assert.equal(auditPlanStatusCode('planned'), auditPlanStatusCode(option.id))
    assert.equal(isMajorNcrCategory(2), true)
    assert.equal(isMajorNcrCategory('minor_nc'), false)
    assert.notEqual(auditPlanStatusLabel('reported'), 'reported')
  }
  assert.equal(ncrStatusLabel(3), 'قيد التنفيذ')
  assert.equal(ncrCategoryLabel(2), 'عدم مطابقة جسيمة')
  assert.equal(ncrStatusLabel('a_custom_status'), 'a custom status')
  setLocale('en')
})

test('generated location and website breadcrumbs resolve in both languages', async () => {
  const { translateNavigationLabel } = await import('../src/localization/navigation')
  const { websiteRoutes } = await import('../src/router/routes/admin/website')
  const { locationRoutes } = await import('../src/router/routes/shared/location')
  for (const route of [...websiteRoutes, ...locationRoutes]) {
    const label = route.meta?.breadcrumb
    if (typeof label !== 'string') continue
    setLocale('en')
    const english = translateNavigationLabel(label)
    setLocale('ar')
    const arabic = translateNavigationLabel(label)
    assert.match(arabic, /[\u0600-\u06ff]/u, `Untranslated generated breadcrumb: ${label}`)
    assert.notEqual(arabic, english)
  }
  setLocale('ar')
  assert.equal(translateNavigationLabel('  Add  Country '), i18n.global.t('Add Country'))
  setLocale('en')
})
