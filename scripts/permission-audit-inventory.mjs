import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { parse } from '@vue/compiler-sfc'

const root = process.cwd()
const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
  entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)],
)
const relative = (file) => path.relative(root, file).split(path.sep).join('/')
const sourceFiles = walk(path.join(root, 'src/features/Organization'))
const enumPath = path.join(root, 'src/features/users/Admin/Core/Enum/permission_enum.ts')
const enumSource = ts.createSourceFile(enumPath, fs.readFileSync(enumPath, 'utf8'), ts.ScriptTarget.Latest, true)
const permissions = []
enumSource.forEachChild((node) => {
  if (ts.isEnumDeclaration(node)) for (const member of node.members) {
    if (member.initializer && ts.isStringLiteral(member.initializer)) permissions.push({ name: member.name.getText(enumSource), code: member.initializer.text })
  }
})
const files = sourceFiles.map((file) => {
  const source = fs.readFileSync(file, 'utf8')
  const filename = relative(file)
  const actions = []
  if (file.endsWith('.vue')) {
    const { descriptor, errors } = parse(source, { filename })
    for (const error of errors) actions.push({ kind: 'parse-error', expression: String(error) })
    const template = descriptor.template
    for (const match of (template?.content ?? '').matchAll(/(?:@|v-on:)([\w:-]+)(?:\.[\w.]+)?\s*=\s*"([^"]*)"/g)) {
      actions.push({ kind: match[1], expression: match[2], line: source.slice(0, (template?.loc.start.offset ?? 0) + match.index).split('\n').length })
    }
  }
  return {
    file: filename,
    feature: filename.split('/').length > 4 ? filename.split('/')[3] : '(root files)',
    category: file.endsWith('.vue') ? /Form|Add|Edit|Create/.test(path.basename(file)) ? 'form' : /Dialog|Modal/.test(path.basename(file)) ? 'dialog' : /Index|List|Table/.test(path.basename(file)) ? 'list/table' : 'presentation' : /apiServices/.test(file) ? 'API service' : /controllers/.test(file) ? 'controller' : 'business/data',
    permissions: [...new Set([...source.matchAll(/PermissionsEnum\??\.([A-Za-z_\d]+)/g)].map((match) => match[1]))],
    apiNames: [...new Set([...source.matchAll(/ApiNames\.instance\.([A-Za-z_\d]+)/g)].map((match) => match[1]))],
    directNetwork: [...source.matchAll(/\b(?:axios|fetch|fetcher|networkService)\s*(?:\.(?:get|post|put|delete|patch))?\s*\(/g)].map((match) => ({ line: source.slice(0, match.index).split('\n').length, expression: match[0] })),
    actions,
    navigation: [...source.matchAll(/(?:router\.(?:push|replace)|window\.open|(?:window\.)?location\.(?:href|assign))\s*\(?/g)].map((match) => ({ line: source.slice(0, match.index).split('\n').length, expression: match[0] })),
    review: 'inventoried; semantic action review pending',
  }
})
const routes = []
for (const file of walk(path.join(root, 'src/router/routes')).filter((file) => file.endsWith('.ts'))) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true)
  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const properties = Object.fromEntries(node.properties.filter(ts.isPropertyAssignment).map((property) => [property.name.getText(source).replaceAll(/['"]/g, ''), property.initializer]))
      if (properties.path && ts.isStringLiteral(properties.path)) {
        routes.push({ file: relative(file), path: properties.path.text, name: properties.name && ts.isStringLiteral(properties.name) ? properties.name.text : null, component: properties.component?.getText(source), meta: properties.meta?.getText(source) })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
}
const featureNames = fs.readdirSync('src/features/Organization', { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name)
const features = featureNames.sort().map((feature) => {
  const members = files.filter((file) => file.feature === feature)
  return { feature, files: members.length, components: members.filter((file) => file.file.endsWith('.vue')).length, actions: members.reduce((total, file) => total + file.actions.length, 0), apiServices: members.filter((file) => file.category === 'API service').length, permissionNames: [...new Set(members.flatMap((file) => file.permissions))].sort(), review: 'inventory complete; enforcement review pending' }
})
const duplicates = permissions.filter((permission, index) => permissions.findIndex((item) => item.code === permission.code) !== index)
const output = { generatedAt: new Date().toISOString(), branch: 'permissions', scope: 'src/features/Organization/', features, files, routes, permissions, duplicateCodes: duplicates }
fs.mkdirSync('docs/permission-audit', { recursive: true })
fs.writeFileSync('docs/permission-audit/inventory.json', JSON.stringify(output, null, 2) + '\n')
console.log(JSON.stringify({ files: files.length, features: features.length, components: features.reduce((total, feature) => total + feature.components, 0), templateActions: features.reduce((total, feature) => total + feature.actions, 0), routeDefinitions: routes.length, permissions: permissions.length, duplicateCodes: duplicates }))
