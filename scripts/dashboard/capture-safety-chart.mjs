// Local fixture-only chart QA. Never run against production or use these values as analytics.
import { chromium } from '@playwright/test'
import { installDashboardFixtures } from './dashboard-fixtures.mjs'
const base = process.env.DASHBOARD_TEST_URL || 'http://127.0.0.1:5185'
if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(base)) throw new Error('Local server required')
const browser = await chromium.launch({channel:'chromium'})
try {
  for (const config of [
    {size:1,locale:'en',width:1440,name:'one-location'},
    {size:3,locale:'en',width:1440,name:'multiple-locations'},
    {size:25,locale:'ar',width:1440,name:'many-locations-rtl'},
    {size:3,locale:'ar',width:375,name:'mobile-rtl'},
  ]) {
    const page=await browser.newPage({viewport:{width:config.width,height:1000}})
    await installDashboardFixtures(page,{...config,rootCauses:false})
    await page.goto(base+'/organization')
    const panel=page.getByTestId('safety-panel')
    await panel.locator('canvas').waitFor()
    await page.waitForFunction(()=>{const c=document.querySelector('.command-grouped-canvas canvas'); if(!c)return false;const pixels=c.getContext('2d').getImageData(0,0,c.width,c.height).data;return pixels.some((v,i)=>i%4===0&&v===240&&pixels[i+1]===68&&pixels[i+2]===82)})
    await panel.screenshot({path:`docs/dashboard/screenshots/safety-chart-${config.name}.png`,animations:'disabled'})
    if(config.name==='multiple-locations') {
      const box=await panel.locator('canvas').boundingBox()
      await page.mouse.move(box.x+box.width/2,box.y+box.height/2)
      await panel.screenshot({path:'docs/dashboard/screenshots/safety-chart-tooltip.png',animations:'disabled'})
    }
    await page.close()
  }
} finally {await browser.close()}
