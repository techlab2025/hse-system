import type { App } from 'vue'
import { watch } from 'vue'

type LocaleMessages = Record<string, string | LocaleMessages>

interface I18nComposerLike {
  locale: { value: string }
  getLocaleMessage: (locale: string) => LocaleMessages
}

const TRANSLATABLE_ATTRIBUTES = [
  'alt',
  'aria-label',
  'data-empty-message',
  'label',
  'placeholder',
  'title',
] as const

const originalText = new WeakMap<Text, string>()
const originalAttributes = new WeakMap<Element, Map<string, string>>()

function flattenMessages(messages: LocaleMessages, result = new Map<string, string>()) {
  Object.entries(messages).forEach(([key, value]) => {
    if (typeof value === 'string') {
      result.set(key, value)
      result.set(value, value)
      return
    }

    flattenMessages(value, result)
  })

  return result
}

function buildTranslationMap(composer: I18nComposerLike) {
  const english = flattenMessages(composer.getLocaleMessage('en'))
  const target = flattenMessages(composer.getLocaleMessage(composer.locale.value))
  const translations = new Map<string, string>()

  english.forEach((englishValue, key) => {
    const translatedValue = target.get(key)
    if (translatedValue) translations.set(englishValue.trim(), translatedValue)
  })

  return translations
}

function translateValue(value: string, translations: Map<string, string>) {
  const trimmed = value.trim()
  if (!trimmed) return value

  const translated = translations.get(trimmed)
  if (!translated) return value

  const leadingSpace = value.match(/^\s*/)?.[0] ?? ''
  const trailingSpace = value.match(/\s*$/)?.[0] ?? ''
  return `${leadingSpace}${translated}${trailingSpace}`
}

function translateElement(root: Node, translations: Map<string, string>) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const textNodes: Text[] = []

  if (root.nodeType === Node.TEXT_NODE) textNodes.push(root as Text)
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text)

  textNodes.forEach((node) => {
    const parent = node.parentElement
    if (!parent || ['SCRIPT', 'STYLE', 'CODE', 'PRE'].includes(parent.tagName)) return

    if (!originalText.has(node)) originalText.set(node, node.data)
    const source = originalText.get(node) ?? node.data
    const translated = translateValue(source, translations)
    if (node.data !== translated) node.data = translated
  })

  const elements: Element[] = []
  if (root.nodeType === Node.ELEMENT_NODE) elements.push(root as Element)
  if ('querySelectorAll' in root) elements.push(...(root as Element).querySelectorAll('*'))

  elements.forEach((element) => {
    let storedAttributes = originalAttributes.get(element)
    if (!storedAttributes) {
      storedAttributes = new Map()
      originalAttributes.set(element, storedAttributes)
    }

    TRANSLATABLE_ATTRIBUTES.forEach((attribute) => {
      const currentValue = element.getAttribute(attribute)
      if (currentValue === null) return
      if (!storedAttributes.has(attribute)) storedAttributes.set(attribute, currentValue)

      const source = storedAttributes.get(attribute) ?? currentValue
      const translated = translateValue(source, translations)
      if (currentValue !== translated) element.setAttribute(attribute, translated)
    })
  })
}

export function createAutoTranslate(composer: I18nComposerLike) {
  let started = false

  return {
    install(app: App) {
      app.mixin({
        mounted() {
          if (started) return
          started = true

          let translations = buildTranslationMap(composer)
          const translatePage = () => translateElement(document.body, translations)
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === 'characterData') {
                translateElement(mutation.target, translations)
                return
              }

              mutation.addedNodes.forEach((node) => translateElement(node, translations))
            })
          })

          translatePage()
          observer.observe(document.body, { childList: true, characterData: true, subtree: true })

          watch(
            () => composer.locale.value,
            () => {
              translations = buildTranslationMap(composer)
              translatePage()
            },
            { flush: 'post' },
          )
        },
      })
    },
  }
}
