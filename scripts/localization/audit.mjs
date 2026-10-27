import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { parse as parseSfc } from '@vue/compiler-sfc'
import { parse as baseParse, NodeTypes } from '@vue/compiler-dom'
const root = process.cwd()

const isUiName = (name = '') =>
  !/^option[-_]?label$/i.test(name) &&
  /(?:title|label|subtitle|description|placeholder|message|text|hint|caption|tooltip|header)$/i.test(
    name,
  ) &&
  !/^(?:has|is|show|with|enable|use)[A-Z_-]/.test(name)
const files = []
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(file)
    else if (/\.(vue|ts|js|scss|css)$/.test(file)) files.push(file)
  }
}
walk('src')
const locales = Object.fromEntries(
  ['en', 'ar'].map((l) => [l, JSON.parse(fs.readFileSync(`src/locales/${l}.json`, 'utf8'))]),
)
function flatten(o, prefix = '', result = {}) {
  for (const [key, v] of Object.entries(o)) {
    const name = prefix ? `${prefix}.${key}` : key
    if (v && typeof v === 'object') flatten(v, name, result)
    else result[name] = v
  }
  return result
}
const flat = Object.fromEntries(Object.entries(locales).map(([l, d]) => [l, flatten(d)]))
const byValue = new Map()
for (const [key, value] of Object.entries(flat.en))
  if (typeof value === 'string' && !byValue.has(value.trim())) byValue.set(value.trim(), key)
const findings = [],
  references = [],
  styles = [],
  routes = [],
  navigationReferences = [],
  inventory = []
const visible = new Set([
  'text',
  'message',
  'label',
  'title',
  'placeholder',
  'alt',
  'aria-label',
  'header',
  'help-text',
  'helpText',
  'emptyMessage',
  'emptyFilterMessage',
  'chooseLabel',
  'uploadLabel',
  'cancelLabel',
  'description',
  'subtitle',
  'eyebrow',
  'caption',
  'note',
  'help',
  'summary',
  'detail',
  'titleContent',
  'messageContent',
])
const skipTags = new Set(['script', 'style', 'code', 'pre'])
const candidate = (s) =>
  /[A-Za-z\u0600-\u06ff]{2}/u.test(s) &&
  !/^(?:https?:|data:|uil:|pi |[/.#])/.test(s) &&
  !/^[-\w]+(?:\.\w+)+$/.test(s)
function add(file, kind, text, offset, source) {
  text = text.replace(/\s+/g, ' ').trim()
  if (!candidate(text)) return
  findings.push({
    file,
    line: source.slice(0, offset).split('\n').length,
    kind,
    text,
    key: byValue.get(text) ?? null,
    offset,
  })
}
function scanScript(content, file, source, offset = 0) {
  const ast = ts.createSourceFile(file + '.ts', content, ts.ScriptTarget.Latest, true)
  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      /^(?:\$t|t|featureTranslation|translate|localizeUi|i18n\.global\.t)$/.test(
        node.expression.getText(ast),
      )
    ) {
      const collect = (arg) => {
        if (!arg) return
        if (ts.isStringLiteralLike(arg))
          references.push({
            file,
            line: source.slice(0, offset + arg.getStart(ast)).split('\n').length,
            key: arg.text,
          })
        else if (ts.isConditionalExpression(arg)) {
          collect(arg.whenTrue)
          collect(arg.whenFalse)
        } else if (ts.isParenthesizedExpression(arg) || ts.isAsExpression(arg))
          collect(arg.expression)
        else if (ts.isElementAccessExpression(arg) && ts.isArrayLiteralExpression(arg.expression))
          arg.expression.elements.forEach(collect)
      }
      collect(node.arguments[0])
    }
    if (
      ts.isPropertyAssignment(node) &&
      node.name.getText(ast) === 'breadcrumb' &&
      ts.isStringLiteralLike(node.initializer)
    )
      navigationReferences.push({
        file,
        key: node.initializer.text,
        line: source.slice(0, offset + node.initializer.getStart(ast)).split('\n').length,
      })
    if (
      ts.isPropertyAssignment(node) &&
      node.name.getText(ast) === 'translationKey' &&
      ts.isStringLiteralLike(node.initializer)
    )
      references.push({
        file,
        line: source.slice(0, offset + node.initializer.getStart(ast)).split('\n').length,
        key: node.initializer.text,
      })
    if (
      ts.isPropertyAssignment(node) &&
      !(
        node.name.getText(ast) === 'title' &&
        node.parent.properties?.some((p) => p.name?.getText(ast) === 'translationKey')
      ) &&
      visible.has(node.name.getText(ast).replace(/^['"]|['"]$/g, '')) &&
      ts.isStringLiteralLike(node.initializer)
    )
      add(
        file,
        'script-property',
        node.initializer.text,
        offset + node.initializer.getStart(ast),
        source,
      )
    if (
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      /(?:error|message|feedback|notice|warning|success)\w*\.value$/i.test(
        node.left.getText(ast),
      ) &&
      ts.isStringLiteralLike(node.right)
    )
      add(file, 'feedback-assignment', node.right.text, offset + node.right.getStart(ast), source)
    if (
      ts.isNewExpression(node) &&
      /^(Error|OpenWarningDilaog|OpenWarningDialog)$/.test(node.expression.getText(ast)) &&
      node.arguments?.[0] &&
      ts.isStringLiteralLike(node.arguments[0])
    )
      add(
        file,
        'exception-message',
        node.arguments[0].text,
        offset + node.arguments[0].getStart(ast),
        source,
      )
    if (
      ts.isCallExpression(node) &&
      /^(?:window\.)?(alert|confirm|prompt)$/.test(node.expression.getText(ast)) &&
      node.arguments[0] &&
      ts.isStringLiteralLike(node.arguments[0])
    )
      add(
        file,
        'native-message',
        node.arguments[0].text,
        offset + node.arguments[0].getStart(ast),
        source,
      )
    ts.forEachChild(node, visit)
  }
  visit(ast)
}
// Inspect only output branches; comparisons, lookup keys, router IDs and call arguments
// are not automatically treated as rendered text. This remains a candidate inventory.
function scanOutput(text, file, source, offset) {
  const prefix = 'const value = ('
  const ast = ts.createSourceFile('output.ts', prefix + text + ')', ts.ScriptTarget.Latest, true)
  const root = ast.statements[0]?.declarationList?.declarations[0]?.initializer
  function visit(node) {
    if (!node) return
    if (ts.isStringLiteralLike(node))
      add(
        file,
        'dynamic-output-literal',
        node.text,
        offset + node.getStart(ast) - prefix.length,
        source,
      )
    else if (ts.isTemplateExpression(node)) {
      const parts = [node.head.text, ...node.templateSpans.map((s) => s.literal.text)].join('…')
      add(
        file,
        'dynamic-output-template',
        parts,
        offset + node.getStart(ast) - prefix.length,
        source,
      )
    } else if (ts.isElementAccessExpression(node) && ts.isArrayLiteralExpression(node.expression)) {
      node.expression.elements.forEach(visit)
    } else if (ts.isConditionalExpression(node)) {
      visit(node.whenTrue)
      visit(node.whenFalse)
    } else if (
      ts.isBinaryExpression(node) &&
      [
        ts.SyntaxKind.BarBarToken,
        ts.SyntaxKind.QuestionQuestionToken,
        ts.SyntaxKind.PlusToken,
      ].includes(node.operatorToken.kind)
    ) {
      visit(node.left)
      visit(node.right)
    } else if (ts.isParenthesizedExpression(node) || ts.isAsExpression(node)) visit(node.expression)
  }
  visit(root)
}
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8')
  const before = findings.length
  if (file.endsWith('.vue')) {
    const { descriptor } = parseSfc(source, { filename: file })
    for (const block of [descriptor.script, descriptor.scriptSetup])
      if (block) scanScript(block.content, file, source, block.loc.start.offset)
    if (descriptor.template)
      try {
        const base = descriptor.template.loc.start.offset
        const ast = baseParse(descriptor.template.content, { onError: () => {} })
        function visit(node, parent) {
          if (node.type === NodeTypes.ELEMENT && skipTags.has(node.tag)) return
          if (node.type === NodeTypes.TEXT)
            add(file, 'template-text', node.content, base + node.loc.start.offset, source)
          if (node.type === NodeTypes.INTERPOLATION) {
            scanScript(node.content.content, file, source, base + node.content.loc.start.offset)
            scanOutput(node.content.content, file, source, base + node.content.loc.start.offset)
          }
          if (node.type === NodeTypes.ELEMENT)
            for (const prop of node.props) {
              if (
                prop.type === NodeTypes.ATTRIBUTE &&
                (visible.has(prop.name) || isUiName(prop.name)) &&
                prop.value
              )
                add(
                  file,
                  'template-attribute',
                  prop.value.content,
                  base + prop.loc.start.offset,
                  source,
                )
              if (prop.type === NodeTypes.DIRECTIVE && prop.exp) {
                scanScript(prop.exp.content, file, source, base + prop.exp.loc.start.offset)
                if (
                  prop.name === 'bind' &&
                  (visible.has(prop.arg?.content) || isUiName(prop.arg?.content))
                )
                  scanOutput(prop.exp.content, file, source, base + prop.exp.loc.start.offset)
              }
            }
          for (const child of node.children ?? []) visit(child, node)
        }
        visit(ast)
      } catch (e) {
        findings.push({ file, kind: 'parse-error', text: e.message })
      }
  } else if (/\.[tj]s$/.test(file)) scanScript(source, file, source)
  if (/\.(scss|css|vue)$/.test(file))
    for (const match of source.matchAll(
      /(?<![-$\w])\b(margin-left|margin-right|padding-left|padding-right|border-left|border-right|left|right|text-align|direction)\s*:\s*([^;{}\n]+)/g,
    )) {
      if (file.endsWith('.vue') && match.index < source.indexOf('<style')) continue
      if (match[1] === 'text-align' && !/^(left|right)\b/.test(match[2])) continue
      styles.push({
        file,
        line: source.slice(0, match.index).split('\n').length,
        property: match[1],
        value: match[2].trim(),
      })
    }
  if (file.startsWith('src/router/'))
    for (const m of source.matchAll(/\bpath:\s*['"]([^'"]+)['"]/g))
      routes.push({ file, path: m[1] })
  inventory.push({ file, bytes: Buffer.byteLength(source), findings: findings.length - before })
}
const placeholders = (s) =>
  [...s.matchAll(/\{([\w]+)\}/g)]
    .map((m) => m[1])
    .sort()
    .join(',')
const report = {
  generatedAt: new Date().toISOString(),
  scope:
    'All Vue, TypeScript, JavaScript, CSS and SCSS under src; static candidates require semantic review.',
  summary: {
    files: files.length,
    vue: files.filter((f) => f.endsWith('.vue')).length,
    typescript: files.filter((f) => f.endsWith('.ts')).length,
    routes: routes.length,
    hardcodedCandidates: findings.length,
    reusableTranslations: findings.filter((f) => f.key).length,
    physicalStyleDeclarations: styles.length,
  },
  catalog: {
    missingArabic: Object.keys(flat.en).filter((k) => !(k in flat.ar)),
    missingEnglish: Object.keys(flat.ar).filter((k) => !(k in flat.en)),
    empty: Object.entries(flat).flatMap(([locale, values]) =>
      Object.entries(values)
        .filter(([, v]) => typeof v === 'string' && !v.trim())
        .map(([key]) => ({ locale, key })),
    ),
    wrongScriptEnglish: Object.entries(flat.en)
      .filter(([, v]) => /[\u0600-\u06ff]/.test(v))
      .map(([key, value]) => ({ key, value })),
    placeholderMismatch: Object.keys(flat.en)
      .filter(
        (k) =>
          typeof flat.en[k] === 'string' &&
          typeof flat.ar[k] === 'string' &&
          placeholders(flat.en[k]) !== placeholders(flat.ar[k]),
      )
      .map((key) => ({ key, en: flat.en[key], ar: flat.ar[key] })),
  },
  inventory,
  routes,
  references,
  findings,
  styles,
}
report.catalog.missingReferencedKeys = [...new Set(references.map((r) => r.key))].filter(
  (k) => !(k in flat.en) || !(k in flat.ar),
)
const navigationAliases = {}
const navigationAst = ts.createSourceFile(
  'navigation.ts',
  fs.readFileSync('src/localization/navigation.ts', 'utf8'),
  ts.ScriptTarget.Latest,
  true,
)
function readNavigation(node) {
  if (
    ts.isVariableDeclaration(node) &&
    node.name.getText(navigationAst) === 'navigationLabelKeys' &&
    ts.isObjectLiteralExpression(node.initializer)
  )
    for (const property of node.initializer.properties)
      if (
        ts.isPropertyAssignment(property) &&
        (ts.isStringLiteralLike(property.name) || ts.isIdentifier(property.name)) &&
        ts.isStringLiteralLike(property.initializer)
      )
        navigationAliases[property.name.text] = property.initializer.text
  ts.forEachChild(node, readNavigation)
}
readNavigation(navigationAst)
report.navigationReferences = navigationReferences
report.catalog.missingNavigationKeys = [
  ...new Set(
    navigationReferences.map(
      (item) =>
        navigationAliases[item.key] ??
        navigationAliases[item.key.replace(/\s+/g, ' ').trim()] ??
        item.key.replace(/\s+/g, ' ').trim(),
    ),
  ),
].filter((key) => !(key in flat.en) || !(key in flat.ar))
const output =
  process.argv.slice(2).find((arg) => !arg.startsWith('--')) ??
  'docs/localization/source-audit.json'
fs.mkdirSync(path.dirname(output), { recursive: true })
fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n')
console.log(
  JSON.stringify(
    {
      ...report.summary,
      catalog: Object.fromEntries(Object.entries(report.catalog).map(([k, v]) => [k, v.length])),
      output,
    },
    null,
    2,
  ),
)

if (process.argv.includes('--check') && Object.values(report.catalog).some((items) => items.length))
  process.exitCode = 1
