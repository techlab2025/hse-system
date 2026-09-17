import ConditionHandler from '@/base/Presentation/utils/condition_handler'
import type { RouteLocationMatched } from 'vue-router'

type BreadCrumbItem = {
  label: string
  url?: string
}

export const buildBreadcrumb = (route: any, router: any): BreadCrumbItem[] => {
  const result: BreadCrumbItem[] = []

  const getUrlWithParams = (r: RouteLocationMatched, route: any) => {
    const Params = Object.values(route.params)[0]
    return Params
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

    if (r.meta.parent) {
      if (r.meta.subType && (route.params.parent_id || route.query.hazard == 1)) {
        const parentRoute = allRoutes.find((pr) => `${pr.name}` === r.meta.subParent)
        if (parentRoute) addRoute(parentRoute as any)
      } else {
        const parentRoute = allRoutes.find((pr) => pr.name === r.meta.parent)
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
      url: r.path.replace(/\/:[^/]+(\?)?/g, `/${String(getUrlWithParams(r, route))}`),
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
