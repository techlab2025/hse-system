import fs from 'node:fs'
import { parse as parseSfc } from '@vue/compiler-sfc'
import { parse as parseTemplate } from '@vue/compiler-dom'

const inventory=JSON.parse(fs.readFileSync('docs/permission-audit/action-dependencies.json','utf8'))
const matrix=JSON.parse(fs.readFileSync('docs/permission-audit/policy-matrix.json','utf8'))
const results=[]
const mutations=endpoints=>endpoints.filter(endpoint=>/^(?:create|update|delete|close|toggle|assign|remove)_/.test(endpoint))
const dynamicEndpoints=new Set(['create_observation','update_observation','delete_observation'])
const observationType=file=>/\/Incedant\//.test(file)?3:/\/Hazard\//.test(file)?2:/\/Ovservation\//.test(file)?1:null
const expression=(endpoint,file)=>{
 if(dynamicEndpoints.has(endpoint)){
  const type=observationType(file)
  return type?`canOrganizationOperation('${endpoint}', { type: ${type} })`:null
 }
 return matrix.endpoints[endpoint]?`canOrganizationOperation('${endpoint}')`:null
}
for(const item of inventory){
 let source=fs.readFileSync(item.file,'utf8')
 const {descriptor}=parseSfc(source,{filename:item.file}),script=descriptor.scriptSetup??descriptor.script
 if(!script)continue
 const edits=[],gated=new Map(),functions=[]
 for(const fn of item.functions){
  const endpoints=mutations(fn.endpoints)
  if(endpoints.length!==1||!fn.block||fn.returnType)continue
  const guard=expression(endpoints[0],item.file)
  if(!guard)continue
  const body=source.slice(fn.bodyStart,fn.bodyEnd)
  if(!body.includes(`if (!${guard}) return`))edits.push({start:fn.bodyStart+1,end:fn.bodyStart+1,text:`\n  if (!${guard}) return\n`})
  gated.set(fn.name,guard)
  functions.push({handler:fn.name,endpoint:endpoints[0],status:matrix.endpoints[endpoints[0]]?.unsupported&&!dynamicEndpoints.has(endpoints[0])?'Denied pending backend permission registration':'Execution guard derived from actual controller/API dependencies'})
 }
 let callbacks=0
 for(const callback of item.callbacks){
  if(callback.mutations.length!==1)continue
  const policy=matrix.endpoints[callback.mutations[0]]
  if(!policy?.anyOf?.length)continue
  const start=callback.start
  // Preserve existing platform permissions; replace only the Organization evaluation.
  const nearby=source.slice(Math.max(0,start-500),start)
  if(/organizationPermission:\s*\[[^\]]*\]\s*,\s*$/.test(nearby))continue
  edits.push({start,end:start,text:`organizationPermission: [${policy.anyOf.map(name=>'PermissionsEnum.'+name).join(', ')}],\n    `})
  callbacks++
 }
 let controls=0
 if(descriptor.template&&gated.size){
  const template=descriptor.template,tree=parseTemplate(template.content)
  function visit(node,submitGuard=null){
   if(node.type===1){
    const submit=node.props.find(prop=>prop.type===7&&prop.name==='on'&&prop.arg?.content==='submit')
    if(submit?.exp)submitGuard=gated.get(submit.exp.content.match(/^([\w$]+)/)?.[1])??null
    if(node.tag==='button'){
     let guard=null
     for(const prop of node.props)if(prop.type===7&&prop.name==='on'&&prop.exp)guard??=gated.get(prop.exp.content.match(/^([\w$]+)/)?.[1])??null
     const submitType=node.props.some(prop=>prop.type===6&&prop.name==='type'&&prop.value?.content==='submit')
     if(submitType)guard??=submitGuard
     if(guard){
      const condition=node.props.find(prop=>prop.type===7&&prop.name==='if')
      const branch=node.props.some(prop=>prop.type===7&&['else','else-if'].includes(prop.name))
      if(condition?.exp&&!condition.exp.content.includes(guard))edits.push({start:template.loc.start.offset+condition.exp.loc.start.offset,end:template.loc.start.offset+condition.exp.loc.end.offset,text:`(${condition.exp.content}) && ${guard}`})
      else if(!condition&&!branch){const offset=template.loc.start.offset+node.loc.start.offset+'<button'.length;edits.push({start:offset,end:offset,text:` v-if="${guard}"`})}
      controls++
     }
    }
   }
   for(const child of node.children??[])visit(child,submitGuard)
  }
  visit(tree)
 }
 if(!edits.length)continue
 let imports=''
 if(gated.size&&!/import\s*\{[^}]*\bcanOrganizationOperation\b/.test(script.content))imports+="import { canOrganizationOperation } from '@/features/permission/Presentation/Helpers/organization_authorization'\n"
 if(callbacks&&!/import\s*\{[^}]*\bPermissionsEnum\b/.test(script.content))imports+="import { PermissionsEnum } from '@/features/users/Admin/Core/Enum/permission_enum'\n"
 if(imports)edits.push({start:script.loc.start.offset,end:script.loc.start.offset,text:'\n'+imports})
 for(const edit of edits.sort((a,b)=>b.start-a.start))source=source.slice(0,edit.start)+edit.text+source.slice(edit.end)
 const errors=parseSfc(source,{filename:item.file}).errors
 if(errors.length)throw new Error(item.file+': '+errors.join('\n'))
 fs.writeFileSync(item.file,source)
 results.push({file:item.file,functions,callbacks,controls,status:'Proven single-endpoint execution/control boundaries; other actions still require semantic review'})
}
fs.writeFileSync('docs/permission-audit/action-execution-boundaries.json',JSON.stringify(results,null,2)+'\n')
console.log(JSON.stringify({files:results.length,handlers:results.reduce((sum,item)=>sum+item.functions.length,0),callbacks:results.reduce((sum,item)=>sum+item.callbacks,0),controls:results.reduce((sum,item)=>sum+item.controls,0)}))
