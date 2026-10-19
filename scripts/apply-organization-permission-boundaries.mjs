import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'
import { parse } from '@vue/compiler-sfc'

const matrix=JSON.parse(fs.readFileSync('docs/permission-audit/policy-matrix.json','utf8'))
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)])
const resolve=(from,name)=>{
 const base=name.startsWith('@/')?path.resolve('src',name.slice(2)):name.startsWith('.')?path.resolve(path.dirname(from),name):null
 if(!base)return null
 return [base,base+'.ts',base+'.vue',path.join(base,'index.ts')].find(file=>fs.existsSync(file)&&fs.statSync(file).isFile())
}
function controllerOperations(file,seen=new Set()){
 if(seen.has(file))return[];seen.add(file)
 const source=fs.readFileSync(file,'utf8')
 const operations=[...source.matchAll(/ApiNames\.instance\.(\w+)/g)].map(match=>match[1])
 const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true)
 for(const node of ast.statements)if(ts.isImportDeclaration(node)&&ts.isStringLiteral(node.moduleSpecifier)){
 const dependency=resolve(file,node.moduleSpecifier.text)
 if(dependency&&/\/(Domain|Data\/apiServices|Data\/api_services)\//.test(dependency))operations.push(...controllerOperations(dependency,seen))
 }
 return operations
}
const results=[]
for(const file of walk('src/features/Organization').filter(file=>file.endsWith('.vue'))){
 const source=fs.readFileSync(file,'utf8')
 if(!/^(Add|Edit|Create|Update)[A-Z]/.test(path.basename(file))){results.push({file,status:'not a standalone mutation form; individual review required'});continue}
 if(source.includes('organizationApiPolicies[')||/canOrganizationApi\('(create|update)_observation'\)/.test(source)){results.push({file,status:'boundary already present'});continue}
 const {descriptor}=parse(source,{filename:file})
 const script=descriptor.scriptSetup??descriptor.script
 if(!script||!descriptor.template){results.push({file,status:'no setup/template to migrate'});continue}
 const ast=ts.createSourceFile(file,script.content,ts.ScriptTarget.Latest,true)
 const getters=[]
 for(const node of ast.statements)if(ts.isImportDeclaration(node)&&ts.isStringLiteral(node.moduleSpecifier)){
 const dependency=resolve(file,node.moduleSpecifier.text)
 if(dependency&&/controllers?\//i.test(dependency)&&!/\/(?:index|fetch|show)/i.test(dependency))getters.push(...controllerOperations(dependency))
 }
 const endpoints=[...new Set(getters.map(getter=>matrix.getterEndpoints[getter]).filter(endpoint=>matrix.endpoints[endpoint]))]
 if(!endpoints.length){results.push({file,status:'no directly imported mutating API controller; individual review required'});continue}
 const policies=new Set(endpoints.map(endpoint=>JSON.stringify(matrix.endpoints[endpoint])))
 if(policies.size!==1){results.push({file,status:'multiple distinct operations require individual guards',endpoints});continue}
 const endpoint=endpoints[0]
 const dynamic=/^(create|update)_observation$/.test(endpoint)
 const expression=dynamic?`canOrganizationApi('${endpoint}')`:`canPolicy(organizationApiPolicies['${endpoint}'])`
 const insertions=[
 {offset:descriptor.template.loc.end.offset,text:'\n  </template>\n'},
 {offset:descriptor.template.loc.start.offset,text:`\n  <template v-if="${expression}">\n`},
 {offset:script.loc.start.offset,text:dynamic?"\nimport { canOrganizationApi } from '@/features/permission/Presentation/Helpers/organization_authorization'\n":"\nimport { canPolicy } from '@/features/permission/Presentation/Helpers/organization_authorization'\nimport { organizationApiPolicies } from '@/features/permission/Core/organizationPolicies'\n"},
 ].sort((a,b)=>b.offset-a.offset)
 let updated=source
 for(const insertion of insertions)updated=updated.slice(0,insertion.offset)+insertion.text+updated.slice(insertion.offset)
 const parsed=parse(updated,{filename:file})
 if(parsed.errors.length)throw new Error(file+': '+parsed.errors.join(', '))
 fs.writeFileSync(file,updated)
 results.push({file,status:'standalone mutation form guarded by its actual API policy',endpoints})
}
fs.writeFileSync('docs/permission-audit/component-boundaries.json',JSON.stringify(results,null,2)+'\n')
console.log(JSON.stringify({components:results.length,guarded:results.filter(result=>result.status.startsWith('standalone')).length,remainingIndividualReview:results.filter(result=>!result.status.startsWith('standalone')&&result.status!=='boundary already present').length}))
