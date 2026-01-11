import type { RouteRecordRaw, WebsiteModule } from '../types'

/**
 * Generate CRUD routes for a resource
 */
export function createCrudRoutes(path: string, name: string, basePath: string): RouteRecordRaw[] {
  return [
    {
      path,
      name: name == 'Areas' ? 'Location' : name,
      component: () => import(`@/views/${basePath}/Index${name}.vue`),
      meta: {
        breadcrumb: name == 'Areas' ? 'Location' : name,
        type: 'Shared',
      },
    },
    {
      path: `${path}/add`,
      name: `Add ${name == 'Areas' ? 'Location' : name}`,
      component: () => import(`@/views/${basePath}/Add${name}.vue`),
      meta: {
        breadcrumb: `Add ${name == 'Areas' ? 'Location' : name}`,
        parent: name == 'Areas' ? 'Location' : name,
        type: 'Shared',
      },
    },
    {
      path: `${path}/:id`,
      name: `Edit ${name == 'Areas' ? 'Location' : name}`,
      component: () => import(`@/views/${basePath}/Edit${name}.vue`),
      meta: {
        breadcrumb: `Edit ${name == 'Areas' ? 'Location' : name}`,
        parent: name == 'Areas' ? 'Location' : name,
        type: 'Shared',
      },
    },
  ]
}

/**
 * Generate location routes with parent support
 */
// Location Breadcrumb
export function createLocationRoutes(path: string, name: string): RouteRecordRaw[] {
  return [
    {
      path: `${path}/:parent_id?`,
      name: ` ${name == 'Areas' ? 'Location' : name}`,
      component: () => import(`@/views/Admin/Location/${name}/Index${name}.vue`),
      meta: {
        breadcrumb: ` ${name == 'Areas' ? 'Location' : name}`,
        type: 'Shared',
      },
    },
    {
      path: `${path}/add/:parent_id?`,
      name: `Add  ${name == 'Areas' ? 'Location' : name}`,
      component: () => import(`@/views/Admin/Location/${name}/Add${name}.vue`),
      meta: {
        breadcrumb: `Add  ${name == 'Areas' ? 'Location' : name}`,
        parent: ` ${name == 'Areas' ? 'Location' : name}`,
        type: 'Shared',
      },
    },
    {
      path: `${path}/:id`,
      name: `Edit  ${name == 'Areas' ? 'Location' : name}`,
      component: () => import(`@/views/Admin/Location/${name}/Edit${name}.vue`),
      meta: {
        breadcrumb: `Edit  ${name == 'Areas' ? 'Location' : name}`,
        parent: ` ${name == 'Areas' ? 'Location' : name}`,
        type: 'Shared',
      },
    },
  ]
}

/**
 * Generate website module routes
 */
export function createWebsiteModuleRoutes(modules: WebsiteModule[]): RouteRecordRaw[] {
  const routes: RouteRecordRaw[] = []

  modules.forEach((module: WebsiteModule) => {
    const singular = module.singular || module.path
    const displayName = module.plural || module.name

    routes.push(
      {
        path: module.path,
        name: displayName,
        component: () => import(`@/views/Admin/Website/${module.name}/Index${module.name}.vue`),
        meta: {
          breadcrumb: displayName,
          type: 'Shared',
        },
      },
      {
        path: `${singular}/add`,
        name: `Add ${displayName}`,
        component: () => import(`@/views/Admin/Website/${module.name}/Add${module.name}.vue`),
        meta: {
          breadcrumb: `Add ${displayName}`,
          parent: displayName,
          type: 'Shared',
        },
      },
      {
        path: `${singular}/:id`,
        name: `Edit ${displayName}`,
        component: () => import(`@/views/Admin/Website/${module.name}/Edit${module.name}.vue`),
        meta: {
          breadcrumb: `Edit ${displayName}`,
          parent: displayName,
          type: 'Shared',
        },
      },
    )
  })

  return routes
}

/**
 * Add suffix to route names
 */
export function addSuffix(routes: RouteRecordRaw[], suffix: string): RouteRecordRaw[] {
  return routes.map((route: RouteRecordRaw) => ({
    ...route,
    name: route.name ? `${String(route.name)} ${suffix}` : route.name,
  }))
}
