import ConditionHandler from '@/base/Presentation/utils/condition_handler'
import type { RouteLocationMatched } from 'vue-router'

type BreadCrumbItem = {
  label: string
  url?: string
}

export const buildBreadcrumb = (route: any, router: any): BreadCrumbItem[] => {
  const result: BreadCrumbItem[] = []

  const getProjectContextId = () => {
    const rawValue = route.query.project_id ?? route.params.project_id
    const projectId = Array.isArray(rawValue) ? rawValue[0] : rawValue

    return projectId ? String(projectId) : ''
  }

  const getUrlWithParams = (r: RouteLocationMatched, route: any) => {
    if (r.name === 'Project Details') {
      const projectId = getProjectContextId()
      if (projectId) return projectId
    }

    const Params = Object.values(route.params)[0]
    return Params
  }

  const getRouteUrl = (r: RouteLocationMatched) => {
    const url = r.path.replace(/\/:[^/]+(\?)?/g, `/${String(getUrlWithParams(r, route))}`)
    const projectId = getProjectContextId()

    if (projectId && r.meta?.projectParent && !url.includes('project_id=')) {
      return `${url}?project_id=${projectId}`
    }

    return url
  }

  // 1️⃣ Home always
  result.push({
    label: 'Home',
    url: ConditionHandler.getInstance().isOrganizationEmployee()
      ? '/organization/employee-interface'
      : route.path.startsWith('/admin')
        ? '/admin'
        : '/organization',
  })

  const added = new Set<string>()
  const allRoutes = router.getRoutes()

  const addRoute = (r: RouteLocationMatched) => {
    if (!r.meta?.breadcrumb || added.has(r.name as string)) return

    const parentName =
      r.meta.projectParent && getProjectContextId()
        ? (r.meta.projectParent as string)
        : (r.meta.parent as string | undefined)

    if (parentName) {
      if (r.meta.subType && (route.params.parent_id || route.query.hazard == 1)) {
        const parentRoute = allRoutes.find((pr: any) => `${pr.name}` === r.meta.subParent)
        if (parentRoute) addRoute(parentRoute as any)
      } else {
        const parentRoute = allRoutes.find((pr: any) => pr.name === parentName)
        if (parentRoute) addRoute(parentRoute as any)
      }
      console.log(
        result.map((x) => ({
          label: x.label,
          url: x.url,
        })),
      )
    }

    result.push({
      label:
        r.meta.subType && (route.params.parent_id || route.query.hazard == 1)
          ? (r.meta.subType as string)
          : ((r.meta.breadcrumb || r.name) as string),
      url: getRouteUrl(r),
    })

    added.add(r.name as string)
  }

  route.matched.forEach(addRoute)

  // ✅ Make last breadcrumb not clickable
  if (result.length > 0) {
    delete result[result.length - 1].url
  }

  return result
}
