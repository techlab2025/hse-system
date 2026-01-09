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
    url: route.path.startsWith('/admin') ? '/admin' : '/organization',
  })

  const added = new Set<string>()

  const allRoutes = router.getRoutes()

  const addRoute = (r: RouteLocationMatched) => {
    if (!r.meta?.breadcrumb || added.has(r.name as string)) return

    // ⬅ parent first
    if (r.meta.parent) {
      const parentRoute = allRoutes.find((pr) => pr.name === r.meta.parent)
      if (parentRoute) addRoute(parentRoute as any)
    }

    result.push({
      label: (r.meta.breadcrumb || r.name) as string,
      url: r.path.replace(/\/:[^/]+(\?)?/g, `/${String(getUrlWithParams(r, route))}`),
      // getUrlWithParams(r, route),
      //  r.path.replace(/\/:[^/]+(\?)?/g, ''),
    })

    added.add(r.name as string)
  }

  route.matched.forEach(addRoute)

  return result
}
