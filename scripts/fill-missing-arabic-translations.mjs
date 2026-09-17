import { readFile, writeFile } from 'node:fs/promises'

const englishPath = new URL('../src/locales/en.json', import.meta.url)
const arabicPath = new URL('../src/locales/ar.json', import.meta.url)
const english = JSON.parse(await readFile(englishPath, 'utf8'))
const arabic = JSON.parse(await readFile(arabicPath, 'utf8'))

const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value)

function collectMissing(source, target, prefix = [], result = []) {
  Object.entries(source).forEach(([key, value]) => {
    const path = [...prefix, key]
    if (isObject(value)) {
      collectMissing(value, isObject(target?.[key]) ? target[key] : {}, path, result)
    } else if (typeof value === 'string' && typeof target?.[key] !== 'string') {
      result.push({ path, value })
    }
  })
  return result
}

function assignPath(target, path, value) {
  let current = target
  path.slice(0, -1).forEach((key) => {
    if (!isObject(current[key])) current[key] = {}
    current = current[key]
  })
  current[path.at(-1)] = value
}

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

const missing = collectMissing(english, arabic)
const concurrency = 8
let cursor = 0

async function worker() {
  while (cursor < missing.length) {
    const item = missing[cursor++]
    const translated = await translate(item.value)
    assignPath(arabic, item.path, translated)
    process.stdout.write(`\rTranslated ${cursor}/${missing.length}`)
  }
}

await Promise.all(Array.from({ length: concurrency }, worker))
await writeFile(arabicPath, `${JSON.stringify(arabic, null, 2)}\n`)
process.stdout.write(`\nAdded ${missing.length} Arabic translations.\n`)
