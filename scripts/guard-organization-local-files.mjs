import fs from 'node:fs'
import ts from 'typescript'
import { parse as parseSfc } from '@vue/compiler-sfc'
import { parse as parseTemplate } from '@vue/compiler-dom'

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`])
const isFunction = node => ts.isArrowFunction(node) || ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isMethodDeclaration(node)
const owner = node => { let parent = node.parent; while (parent && !isFunction(parent)) parent = parent.parent; return parent }
const functionName = (node, ast) => node.name?.getText(ast) ?? (ts.isVariableDeclaration(node.parent) ? node.parent.name.getText(ast) : node.parent.name?.getText(ast))
const ledger = []
for (const file of walk('src/features/Organization').filter(file => file.endsWith('.vue'))) {
  let source = fs.readFileSync(file, 'utf8')
  const { descriptor } = parseSfc(source, { filename: file })
  const script = descriptor.scriptSetup ?? descriptor.script
  if (!script) continue
  const ast = ts.createSourceFile(file, script.content, ts.ScriptTarget.Latest, true)
  const protectedFunctions = new Map(), functions = [], edits = []
  function collect(node) {
    if (isFunction(node) && node.body) functions.push(node)
    if (ts.isCallExpression(node) && /^(?:XLSX\.writeFile|saveAs|window\.print)$/.test(node.expression.getText(ast))) {
      const fn = owner(node)
      if (fn?.body) {
        const operation = node.expression.getText(ast) === 'window.print' ? 'print' : 'export'
        if (!protectedFunctions.has(fn)) protectedFunctions.set(fn, new Set())
        protectedFunctions.get(fn).add(operation)
      }
    }
    ts.forEachChild(node, collect)
  }
  collect(ast)
  if (!protectedFunctions.size) continue
  const names = new Map()
  for (const [fn, operations] of protectedFunctions) {
    const name = functionName(fn, ast)
    if (name && name !== 'action') names.set(name, operations)
    const checks = [...operations].map(op => `!canOrganizationCapability('${op}')`).join(' || ')
    const body = fn.body
    if (body.getText(ast).includes('canOrganizationCapability(')) continue
    if (ts.isBlock(body)) {
      const offset = script.loc.start.offset + body.getStart(ast) + 1
      edits.push({ start: offset, end: offset, text: `\n  if (${checks}) return\n` })
    } else {
      edits.push({ start: script.loc.start.offset + body.getStart(ast), end: script.loc.start.offset + body.end, text: `{ if (${checks}) return; return ${body.getText(ast)} }` })
    }
  }
  // Resolve local callers so a toolbar action calling saveWorkbook is also hidden.
  for (let changed = true; changed;) {
    changed = false
    for (const fn of functions) {
      const name = functionName(fn, ast)
      if (!name || name === 'action' || names.has(name)) continue
      const operations = new Set()
      function calls(node) {
        if (node !== fn && isFunction(node)) return
        if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) for (const op of names.get(node.expression.text) ?? []) operations.add(op)
        ts.forEachChild(node, calls)
      }
      calls(fn)
      if (operations.size) { names.set(name, operations); changed = true }
    }
  }
  let menuActions = 0
  function actions(node) {
    if (ts.isPropertyAssignment(node) && node.name.getText(ast) === 'action' && ts.isObjectLiteralExpression(node.parent)) {
      const object = node.parent
      const operations = new Set()
      if (ts.isIdentifier(node.initializer)) for (const op of names.get(node.initializer.text) ?? []) operations.add(op)
      if (isFunction(node.initializer)) {
        for (const op of protectedFunctions.get(node.initializer) ?? []) operations.add(op)
        function calls(child) {
          if (ts.isCallExpression(child) && ts.isIdentifier(child.expression)) for (const op of names.get(child.expression.text) ?? []) operations.add(op)
          ts.forEachChild(child, calls)
        }
        calls(node.initializer)
      }
      if (operations.size === 1 && !object.properties.some(property => property.name?.getText(ast) === 'capability')) {
        const offset = script.loc.start.offset + node.getStart(ast)
        edits.push({ start: offset, end: offset, text: `capability: '${[...operations][0]}' as const,\n    ` })
        menuActions++
      }
    }
    ts.forEachChild(node, actions)
  }
  actions(ast)
  let controls = 0
  if (descriptor.template) {
    const template = descriptor.template, tree = parseTemplate(template.content)
    function visit(node) {
      if (node.type === 1 && ['button', 'a', 'router-link'].includes(node.tag)) {
        const operations = new Set()
        for (const prop of node.props) if (prop.type === 7 && prop.name === 'on' && prop.exp) {
          const handler = prop.exp.content.match(/^([\w$]+)(?:\(|$)/)?.[1]
          for (const op of names.get(handler) ?? []) operations.add(op)
        }
        if (operations.size) {
          const expression = [...operations].map(op => `canOrganizationCapability('${op}')`).join(' && ')
          const condition = node.props.find(prop => prop.type === 7 && prop.name === 'if')
          const branch = node.props.some(prop => prop.type === 7 && ['else', 'else-if'].includes(prop.name))
          if (condition?.exp && !condition.exp.content.includes('canOrganizationCapability(')) edits.push({ start: template.loc.start.offset + condition.exp.loc.start.offset, end: template.loc.start.offset + condition.exp.loc.end.offset, text: `(${condition.exp.content}) && ${expression}` })
          else if (!condition && !branch) { const offset = template.loc.start.offset + node.loc.start.offset + node.tag.length + 1; edits.push({ start: offset, end: offset, text: ` v-if="${expression}"` }) }
          controls++
        }
      }
      for (const child of node.children ?? []) visit(child)
    }
    visit(tree)
  }
  if (!source.includes("import { canOrganizationCapability }")) edits.push({ start: script.loc.start.offset, end: script.loc.start.offset, text: "\nimport { canOrganizationCapability } from '@/features/permission/Presentation/Helpers/organization_actions'\n" })
  for (const edit of edits.sort((a, b) => b.start - a.start)) source = source.slice(0, edit.start) + edit.text + source.slice(edit.end)
  if (parseSfc(source, { filename: file }).errors.length) throw new Error(`Invalid component after local file guard: ${file}`)
  fs.writeFileSync(file, source)
  ledger.push({ file, executionBoundaries: protectedFunctions.size, menuActions, controls, operations: [...new Set([...protectedFunctions.values()].flatMap(operations => [...operations]))], status: 'Local file execution guarded; independent backend capability registration pending; other component actions remain under review' })
}
fs.writeFileSync('docs/permission-audit/local-file-boundaries.json', JSON.stringify(ledger, null, 2) + '\n')
console.log(JSON.stringify({ files: ledger.length, executionBoundaries: ledger.reduce((sum, file) => sum + file.executionBoundaries, 0), menuActions: ledger.reduce((sum, file) => sum + file.menuActions, 0), controls: ledger.reduce((sum, file) => sum + file.controls, 0) }))
