import type { App, ComponentPublicInstance } from 'vue'

const FORM_COMPONENT_NAME = /form/i

const formatComponentName = (name: string) =>
  name
    .replace(/Form$/i, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()

type FormComponentInstance = ComponentPublicInstance & {
  $: {
    subTree?: {
      el?: Node | null
      anchor?: Node | null
    }
    type?: {
      name?: string
      __name?: string
    }
  }
  $options: {
    name?: string
    __name?: string
  }
}

const markElement = (node: Node | null | undefined) => {
  if (!(node instanceof HTMLElement) && !(node instanceof SVGElement)) return

  node.classList.add('identity-form')
  node.setAttribute('data-identity-form', '')
}

const markShell = (node: Node | null | undefined, componentName: string) => {
  if (!(node instanceof HTMLElement)) return

  node.classList.add('identity-form-shell')
  node.setAttribute('data-form-component', componentName)
  const formKind = formatComponentName(componentName)
  node.setAttribute('data-form-kind', formKind)

  const hasVisualHeader = Boolean(
    node.querySelector(
      ':scope > .employee-header, :scope > .form-header, :scope > h1, :scope > h2, :scope > * .employee-header, :scope > * .form-header',
    ),
  )
  node.classList.toggle('identity-form-shell--generated-title', !hasVisualHeader)

}

/**
 * Adds a styling hook to the rendered root of every component whose name
 * contains "Form". Fragment components are supported by marking each of their
 * top-level elements, so existing templates do not need structural wrappers.
 */
const markFormRoots = (component: FormComponentInstance) => {
  const instance = component.$
  const componentName =
    instance?.type?.name ||
    instance?.type?.__name ||
    component.$options.name ||
    component.$options.__name ||
    ''

  if (!FORM_COMPONENT_NAME.test(componentName)) return

  const firstNode = instance?.subTree?.el
  const lastNode = instance?.subTree?.anchor

  if (firstNode instanceof HTMLElement || firstNode instanceof SVGElement) {
    markElement(firstNode)
    if (firstNode instanceof HTMLFormElement) markShell(firstNode, componentName)
    return
  }

  // Vue renders fragments between two text anchors. Mark every element in the
  // range so forms with multiple template roots receive the same visual skin.
  if (firstNode && lastNode && firstNode.parentNode === lastNode.parentNode) {
    // A fragment-based Form component is usually rendered directly inside the
    // real semantic <form>. Elevate that host into the composed form surface.
    if (firstNode.parentNode instanceof HTMLFormElement) {
      markShell(firstNode.parentNode, componentName)
    }

    let node = firstNode.nextSibling

    while (node && node !== lastNode) {
      const nextNode = node.nextSibling
      markElement(node)
      node = nextNode
    }
  }
}

export const installIdentityFormStyling = (app: App) => {
  app.mixin({
    mounted() {
      markFormRoots(this as FormComponentInstance)
    },
    updated() {
      markFormRoots(this as FormComponentInstance)
    },
  })
}
