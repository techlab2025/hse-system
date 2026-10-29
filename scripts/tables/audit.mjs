import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { parse, compileTemplate } from '@vue/compiler-sfc'
import { parse as parseTemplate } from '@vue/compiler-dom'
import ts from 'typescript'

const baselineRoot = process.env.HSE_TABLE_BASELINE || '/tmp/hse-table-rollout-baseline'

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
const inventory = []
const js = (source) =>
  ts.transpileModule(
    source.replace(/import RegisterPage from ['"]@\/shared\/Tables\/RegisterPage.vue['"];?/g, ''),
    {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        removeComments: true,
        verbatimModuleSyntax: true,
      },
    },
  ).outputText
let checkedScripts = 0
for (const file of files('src')) {
  const source = fs.readFileSync(file, 'utf8')
  if (!source.includes('<table')) continue
  const { descriptor } = parse(source)
  if (!descriptor.template) continue
  const ast = parseTemplate(descriptor.template.content)
  const tables = []
  function walk(n) {
    if (n.type === 1 && n.tag === 'table') tables.push(n)
    for (const c of n.children || []) walk(c)
  }
  walk(ast)
  if (!tables.length) continue
  for (const table of tables) {
    assert(
      table.props.some((p) => p.type === 7 && p.name === 'table-identity'),
      `${file}: missing directive`,
    )
    assert(
      table.props.some(
        (p) =>
          p.type === 6 &&
          p.name === 'class' &&
          p.value?.content.split(/\s+/).includes('hse-data-table'),
      ),
      `${file}: missing style hook`,
    )
  }
  const backup = path.join(baselineRoot, file)
  let oldErrors = []
  if (fs.existsSync(backup)) {
    const previous = parse(fs.readFileSync(backup, 'utf8')).descriptor
    assert.equal(
      js(descriptor.scriptSetup?.content || descriptor.script?.content || ''),
      js(previous.scriptSetup?.content || previous.script?.content || ''),
      `${file}: changed feature logic`,
    )
    checkedScripts++
    oldErrors = compileTemplate({
      source: previous.template.content,
      filename: file,
      id: 'audit',
      compilerOptions: { expressionPlugins: ['typescript'] },
    }).errors.map(String)
  }
  const errors = compileTemplate({
    source: descriptor.template.content,
    filename: file,
    id: 'audit',
    compilerOptions: { expressionPlugins: ['typescript'] },
  }).errors.map(String)
  assert.deepEqual(errors, oldErrors, `${file}: new template compilation errors`)
  inventory.push({
    file,
    tables: tables.length,
    register: descriptor.template.content.includes('<RegisterPage>'),
  })
}
const result = {
  files: inventory.length,
  tables: inventory.reduce((a, x) => a + x.tables, 0),
  registers: inventory.filter((x) => x.register).length,
  featureScriptsVerifiedUnchanged: checkedScripts,
  inventory,
}
fs.mkdirSync('docs/ui-redesign/tables-rollout', { recursive: true })
fs.writeFileSync(
  'docs/ui-redesign/tables-rollout/inventory.json',
  JSON.stringify(result, null, 2) + '\n',
)
console.log(JSON.stringify({ ...result, inventory: undefined }, null, 2))
