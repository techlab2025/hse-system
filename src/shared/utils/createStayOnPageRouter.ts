import type { Router } from 'vue-router'

const stayOnPageRouters = new WeakMap<Router, Router>()

/**
 * Keeps add requests independent from their controller's post-success redirect.
 * This lets "Save and New" reuse the exact same request and validation flow.
 */
export const createStayOnPageRouter = (router: Router): Router => {
  const existingRouter = stayOnPageRouters.get(router)
  if (existingRouter) return existingRouter

  const stayOnPageRouter = new Proxy(router, {
    get(target, property) {
      if (property === 'push' || property === 'replace') {
        return async () => undefined
      }

      if (property === 'go' || property === 'back' || property === 'forward') {
        return () => undefined
      }

      const value = Reflect.get(target, property, target)
      return typeof value === 'function' ? value.bind(target) : value
    },
  }) as Router

  stayOnPageRouters.set(router, stayOnPageRouter)
  return stayOnPageRouter
}
