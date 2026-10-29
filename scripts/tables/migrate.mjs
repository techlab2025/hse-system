import fs from 'node:fs'
import path from 'node:path'
import { parse } from '@vue/compiler-sfc'
import { parse as parseTemplate } from '@vue/compiler-dom'

const backup = '/tmp/hse-table-rollout-baseline'
const manifest = []
const files = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory()
        ? files(path.join(dir, e.name))
        : e.name.endsWith('.vue')
          ? [path.join(dir, e.name)]
          : [],
    )
const staticClass = (node) => node.props?.find((p) => p.type === 6 && p.name === 'class')
const editsForClass = (node, value, edits) => {
  const attr = staticClass(node)
  if (attr?.value)
    edits.push({
      start: attr.value.loc.end.offset - 1,
      end: attr.value.loc.end.offset - 1,
      text: ' ' + value,
    })
  else
    edits.push({
      start: node.loc.start.offset + node.tag.length + 1,
      end: node.loc.start.offset + node.tag.length + 1,
      text: ` class="${value}"`,
    })
}
for (const file of files('src')) {
  const original = fs.readFileSync(file, 'utf8')
  if (!original.includes('<table')) continue
  const { descriptor } = parse(original)
  if (!descriptor.template) continue
  const content = descriptor.template.content
  let ast
  try {
    ast = parseTemplate(content)
  } catch (error) {
    throw new Error(`${file}: ${error.message}`)
  }
  const tables = [],
    edits = [],
    markedParents = new Set()
  function walk(n, parent) {
    if (n.type === 1 && n.tag === 'table') tables.push({ node: n, parent })
    for (const c of n.children || []) walk(c, n)
  }
  walk(ast, null)
  if (!tables.length) continue
  for (const { node, parent } of tables) {
    if (!staticClass(node)?.value?.content.split(/\s+/).includes('hse-data-table'))
      editsForClass(node, 'hse-data-table', edits)
    if (!node.props.some((p) => p.type === 7 && p.name === 'table-identity'))
      edits.push({
        start: node.loc.start.offset + 6,
        end: node.loc.start.offset + 6,
        text: ' v-table-identity',
      })
    const cls = staticClass(parent)?.value?.content || ''
    if (
      parent?.type === 1 &&
      parent.tag === 'div' &&
      /(?:table-responsive|table-container|table-wrap|table-scroll|matrix-scroll|overflow-x|command-table)/.test(
        cls,
      )
    ) {
      if (!markedParents.has(parent) && !cls.split(/\s+/).includes('hse-table-scroll')) {
        editsForClass(parent, 'hse-table-scroll', edits)
        markedParents.add(parent)
      }
    } else {
      const condition = node.props.find(
        (p) => p.type === 7 && ['if', 'else-if', 'else'].includes(p.name),
      )
      if (condition)
        edits.push({ start: condition.loc.start.offset, end: condition.loc.end.offset, text: '' })
      edits.push({
        start: node.loc.start.offset,
        end: node.loc.start.offset,
        text: `<div class="hse-table-scroll"${condition ? ' ' + condition.loc.source : ''}>`,
      })
      edits.push({ start: node.loc.end.offset, end: node.loc.end.offset, text: '</div>' })
    }
  }
  // Standard listing pages gain the approved continuous register surface.
  // Composed pages with their own header retain that header and get table styling only.
  const register =
    path.basename(file).startsWith('Index') &&
    !file.includes('_templateFeature') &&
    !/<(?:h1|header)\b|<(?:\w*PageHeader|RegisterPage)\b/.test(content) &&
    !file.endsWith('/Induction/IndexInduction.vue') &&
    !!descriptor.scriptSetup
  if (register) {
    edits.push({ start: 0, end: 0, text: '\n<RegisterPage>\n' })
    edits.push({ start: content.length, end: content.length, text: '\n</RegisterPage>\n' })
  }
  let next = content
  for (const e of edits.sort((a, b) => b.start - a.start))
    next = next.slice(0, e.start) + e.text + next.slice(e.end)
  let output =
    original.slice(0, descriptor.template.loc.start.offset) +
    next +
    original.slice(descriptor.template.loc.end.offset)
  if (register) {
    const at = descriptor.scriptSetup.loc.start.offset
    output =
      output.slice(0, at) +
      "\nimport RegisterPage from '@/shared/Tables/RegisterPage.vue'\n" +
      output.slice(at)
  }
  const dest = path.join(backup, file)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  if (!fs.existsSync(dest)) fs.writeFileSync(dest, original)
  fs.writeFileSync(file, output)
  manifest.push({
    file,
    tables: tables.length,
    register,
    originalScript: descriptor.scriptSetup?.content || descriptor.script?.content || '',
  })
}
fs.writeFileSync('/tmp/hse-table-migration-manifest.json', JSON.stringify(manifest, null, 2))
console.log(
  JSON.stringify(
    {
      files: manifest.length,
      tables: manifest.reduce((a, m) => a + m.tables, 0),
      registers: manifest.filter((m) => m.register).length,
      backup,
    },
    null,
    2,
  ),
)
