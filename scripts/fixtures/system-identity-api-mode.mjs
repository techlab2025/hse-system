// Test the component's code flag through the real Vite module. No production override exists.
export async function useIdentityApiCodeFlag(page) {
  await page.route('**/src/views/Organization/SystemIdentity.vue*', async (route) => {
    if (new URL(route.request().url()).searchParams.has('type')) return route.continue()
    const response = await route.fetch()
    const source = await response.text()
    const flag = /const USE_SYSTEM_IDENTITY_API = false\b/
    if (!flag.test(source)) throw new Error('System Identity code flag not found in Vite module')
    await route.fulfill({
      response,
      body: source.replace(flag, 'const USE_SYSTEM_IDENTITY_API = true'),
    })
  })
}
