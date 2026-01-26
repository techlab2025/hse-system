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

  // const HandleSpecialHazardRoutes = (Hazardroute:any) => {
  // }
  // 1️⃣ Home always
  result.push({
    label: 'Home',
    url: ConditionHandler.getInstance().isEmployee()
      ? '/organization/equipment-mangement/all-observatin?type=2'
      : route.path.startsWith('/admin')
        ? '/admin'
        : '/organization',
  })

  const added = new Set<string>()

  const allRoutes = router.getRoutes()

  const addRoute = (r: RouteLocationMatched) => {
    if (!r.meta?.breadcrumb || added.has(r.name as string)) return
    // ⬅ parent first
    // If Route have Parent
    if (r.meta.parent) {
      // If Route have Parent And SubType As Special case In Hazard Use Sub Parent
      if (r.meta.subType && (route.params.parent_id || route.query.hazard == 1)) {
        const parentRoute = allRoutes.find((pr) => `${pr.name}` === r.meta.subParent)

        if (parentRoute) addRoute(parentRoute as any)
      }
      // If Route have Parent And SubType As Normal Use Parent
      else {
        const parentRoute = allRoutes.find((pr) => pr.name === r.meta.parent)
        // console.log(parentRoute, 'parentRoute')
        if (parentRoute) addRoute(parentRoute as any)
      }
    }

    result.push({
      label:
        r.meta.subType && (route.params.parent_id || route.query.hazard == 1)
          ? (r.meta.subType as string)
          : ((r.meta.breadcrumb || r.name) as string),
      url: r.path.replace(/\/:[^/]+(\?)?/g, `/${String(getUrlWithParams(r, route))}`),
      // getUrlWithParams(r, route),
      //  r.path.replace(/\/:[^/]+(\?)?/g, ''),
    })

    added.add(r.name as string)
  }

  route.matched.forEach(addRoute)

  return result
}
