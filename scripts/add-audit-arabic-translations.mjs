import { readFile, writeFile } from 'node:fs/promises'

const englishPath = new URL('../src/locales/en.json', import.meta.url)
const arabicPath = new URL('../src/locales/ar.json', import.meta.url)
const auditPath = new URL('../i18n-ui-audit-results.json', import.meta.url)
const english = JSON.parse(await readFile(englishPath, 'utf8'))
const arabic = JSON.parse(await readFile(arabicPath, 'utf8'))
const findings = JSON.parse(await readFile(auditPath, 'utf8'))

const existingEnglish = new Set()
function collectValues(value) {
  if (typeof value === 'string') existingEnglish.add(value.trim())
  else if (value && typeof value === 'object') Object.values(value).forEach(collectValues)
}
collectValues(english)

const excluded = new Set(['HSE.Cloud.Ai', 'HSE.Cloud.Ai logo', 'TechLab', 'mohab2'])
const candidates = [...new Set(findings.map(({ text }) => text.trim()))].filter(
  (text) =>
    /[A-Za-z]{2,}/.test(text) &&
    !existingEnglish.has(text) &&
    !excluded.has(text) &&
    !text.includes('@') &&
    !/^show \d+ to \d+ of \d+$/i.test(text) &&
    !/^[A-Za-z]{1,3}$/.test(text) &&
    !/(.)\1{4}/i.test(text),
)

async function translate(value) {
  const url = new URL('https://translate.googleapis.com/translate_a/single')
  url.searchParams.set('client', 'gtx')
  url.searchParams.set('sl', 'en')
  url.searchParams.set('tl', 'ar')
  url.searchParams.set('dt', 't')
  url.searchParams.set('q', value)
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Translation failed (${response.status}) for: ${value}`)
  const data = await response.json()
  return data[0].map((part) => part[0]).join('')
}

let cursor = 0
const concurrency = 8
async function worker() {
  while (cursor < candidates.length) {
    const source = candidates[cursor++]
    const translated = await translate(source)
    if (/[؀-ۿ]/.test(translated)) {
      english[source] = source
      arabic[source] = translated
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, worker))
await Promise.all([
  writeFile(englishPath, `${JSON.stringify(english, null, 2)}\n`),
  writeFile(arabicPath, `${JSON.stringify(arabic, null, 2)}\n`),
])
console.log(`Processed ${candidates.length} audited strings.`)
