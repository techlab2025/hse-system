// Keep UI context out of API payloads. Some forms share the same request class.
const scopes = new WeakMap<object, string>()

export function setFormValidationScope(params: object | null | undefined, form: string) {
  if (params) scopes.set(params, form)
}

export function getFormValidationScope(params: object) {
  return scopes.get(params)
}
