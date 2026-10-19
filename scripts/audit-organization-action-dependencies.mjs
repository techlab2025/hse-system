import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { parse } from '@vue/compiler-sfc'

const matrix = JSON.parse(fs.readFileSync('docs/permission-audit/policy-matrix.json', 'utf8'))
const walk = dir => fs.readdirSync(dir, {withFileTypes: true}).flatMap(entry => entry.isDirectory() ? walk(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`])
const resolve = (from, name) => {
 const base = name.startsWith('@/') ? path.resolve('src', name.slice(2)) : name.startsWith('.') ? path.resolve(path.dirname(from), name) : null
 if (!base) return null
 return [base, `${base}.ts`, `${base}.vue`, `${base}/index.ts`].find(file => fs.existsSync(file) && fs.statSync(file).isFile())
}
const cache = new Map()
function endpointsFor(file, seen = new Set()) {
 if (cache.has(file)) return cache.get(file)
 if (seen.has(file)) return []
 seen.add(file)
 const source = fs.readFileSync(file, 'utf8'), getters = [...source.matchAll(/ApiNames\.instance\.(\w+)/g)].map(match => match[1])
 const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true)
 const endpoints = getters.map(getter => matrix.getterEndpoints[getter]).filter(Boolean)
 for (const statement of ast.statements) if (ts.isImportDeclaration(statement) && ts.isStringLiteral(statement.moduleSpecifier)) {
  const dependency = resolve(file, statement.moduleSpecifier.text)
  if (dependency && /\/(?:Domain|Data\/(?:apiServices|api_services))\//.test(dependency)) endpoints.push(...endpointsFor(dependency, new Set(seen)))
 }
 const result = [...new Set(endpoints)]
 cache.set(file, result)
 return result
}
const isFunction = node => ts.isArrowFunction(node) || ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isMethodDeclaration(node)
const owner = node => {let parent = node.parent; while(parent && !isFunction(parent)) parent = parent.parent; return parent}
const fnName = (node, ast) => node.name?.getText(ast) ?? (ts.isVariableDeclaration(node.parent) ? node.parent.name.getText(ast) : null)
const within = (node, ancestor) => {for(let parent=node;parent;parent=parent.parent)if(parent===ancestor)return true;return false}
const lexicalScope = node => {for(let parent=node.parent;parent;parent=parent.parent)if(ts.isBlock(parent)||ts.isSourceFile(parent))return parent;return node.getSourceFile()}
const results=[]
for (const file of walk('src/features/Organization').filter(file => file.endsWith('.vue'))) {
 const source = fs.readFileSync(file,'utf8'), descriptor = parse(source,{filename:file}).descriptor, script = descriptor.scriptSetup ?? descriptor.script
 if(!script) {results.push({file,functions:[],callbacks:[],status:'No component script; inspect template/children'});continue}
 const ast=ts.createSourceFile(file,script.content,ts.ScriptTarget.Latest,true)
 const imports=new Map(),bindings=[],functions=[],direct=new Map(),calls=new Map(),callbackNodes=[]
 for(const statement of ast.statements)if(ts.isImportDeclaration(statement)&&ts.isStringLiteral(statement.moduleSpecifier)){
  const imported=resolve(file,statement.moduleSpecifier.text), name=statement.importClause?.name?.text
  if(imported&&name&&/controllers?\//i.test(imported))imports.set(name,endpointsFor(imported))
 }
 function controllerFor(expression, at) {
  if(ts.isCallExpression(expression)&&ts.isPropertyAccessExpression(expression.expression)&&expression.expression.name.text==='getInstance'&&ts.isIdentifier(expression.expression.expression))return imports.get(expression.expression.expression.text)
  if(ts.isIdentifier(expression)){
   const candidates=bindings.filter(binding=>binding.name===expression.text&&binding.start<=at.getStart(ast)&&within(at,binding.scope)).sort((a,b)=>b.start-a.start)
   return candidates[0]?.endpoints
  }
 }
 function collect(node){
  if(ts.isVariableDeclaration(node)&&ts.isIdentifier(node.name)&&node.initializer){
   const endpoints=controllerFor(node.initializer,node)
   if(endpoints)bindings.push({name:node.name.text,endpoints,start:node.getStart(ast),scope:lexicalScope(node)})
  }
  if(isFunction(node)&&node.body){functions.push(node);direct.set(node,new Set());calls.set(node,new Set())}
  if(ts.isCallExpression(node)){
   const fn=owner(node)
   if(fn&&direct.has(fn)){
    if(ts.isPropertyAccessExpression(node.expression)){
     const endpoints=controllerFor(node.expression.expression,node)
     for(const endpoint of endpoints??[])direct.get(fn).add(endpoint)
    }else if(ts.isIdentifier(node.expression))calls.get(fn).add(node.expression.text)
   }
  }
  if(ts.isPropertyAssignment(node)&&node.name.getText(ast)==='action')callbackNodes.push(node)
  ts.forEachChild(node,collect)
 }
 collect(ast)
 const named=new Map(functions.map(fn=>[fnName(fn,ast),fn]).filter(([name])=>name))
 function allFor(fn,seen=new Set()){
  if(seen.has(fn))return[];seen.add(fn)
  const all=[...direct.get(fn)??[]]
  for(const name of calls.get(fn)??[])if(named.has(name))all.push(...allFor(named.get(name),new Set(seen)))
  return [...new Set(all)]
 }
 const fnRecords=functions.filter(fn=>fnName(fn,ast)).map(fn=>({name:fnName(fn,ast),start:script.loc.start.offset+fn.getStart(ast),bodyStart:script.loc.start.offset+fn.body.getStart(ast),bodyEnd:script.loc.start.offset+fn.body.end,block:ts.isBlock(fn.body),returnType:fn.type?.getText(ast)??null,endpoints:allFor(fn),directEndpoints:[...direct.get(fn)??[]]}))
 const callbacks=callbackNodes.map(node=>{
  const fn=isFunction(node.initializer)?node.initializer:ts.isIdentifier(node.initializer)?named.get(node.initializer.text):null
  const endpoints=fn?allFor(fn):[]
  const mutations=endpoints.filter(endpoint=>/^(?:create|update|delete|close|toggle|assign|remove)_/.test(endpoint))
  const permission=node.parent.properties.find(property=>ts.isPropertyAssignment(property)&&property.name.getText(ast)==='permission')
  return {action:node.initializer.getText(ast),start:script.loc.start.offset+node.getStart(ast),permissionStart:permission?script.loc.start.offset+permission.initializer.getStart(ast):null,permissionEnd:permission?script.loc.start.offset+permission.initializer.end:null,currentPermission:permission?.initializer.getText(ast)??null,capability:node.parent.properties.find(property=>property.name?.getText(ast)==='capability')?.initializer?.getText(ast)??null,endpoints,mutations,policies:mutations.map(endpoint=>({endpoint,policy:matrix.endpoints[endpoint]})),status:mutations.length===1&&matrix.endpoints[mutations[0]]?.anyOf?.length?'Single mutation endpoint traced through imported controller/use case/repository/API; eligible for explicit operation gate':'Individual semantic review required'}
 })
 results.push({file,functions:fnRecords,callbacks,status:'Dependency analysis; not a claim that every action is semantically reviewed'})
}
fs.writeFileSync('docs/permission-audit/action-dependencies.json',JSON.stringify(results,null,2)+'\n')
const callbacks=results.flatMap(file=>file.callbacks.map(action=>({file:file.file,...action})))
console.log(JSON.stringify({components:results.length,callbacks:callbacks.length,tracedSingleMutation:callbacks.filter(action=>action.status.startsWith('Single')).length,unresolved:callbacks.filter(action=>!action.status.startsWith('Single')).length}))
