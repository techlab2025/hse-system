<template>
  <!-- Original vector decoration; no screenshot, embedded metrics, remote photo or weather data. -->
  <svg
    class="command-hero-art"
    viewBox="0 0 760 160"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient
        id="command-factory-sky"
        x1="0"
        x2="760"
        y1="0"
        y2="160"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#e7f2ff" stop-opacity="0" />
        <stop offset="1" stop-color="#bedcff" />
      </linearGradient>
      <linearGradient
        id="command-factory-steel"
        x1="400"
        x2="400"
        y1="30"
        y2="160"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#507eaa" stop-opacity=".55" />
        <stop offset="1" stop-color="#173d66" stop-opacity=".85" />
      </linearGradient>
    </defs>
    <path fill="url(#command-factory-sky)" d="M0 0h760v160H0z" />
    <g stroke="#477ba7" stroke-width="2" opacity=".48">
      <path
        d="M218 153V37l-8-7h125l40 7H218Zm0-105 98-15m-84 9 3 112m-17-89 17 13-17 15 17 14-17 15 17 14m80-102v47m-5 1h10m200 74V14l-9-6h140l35 6H514m0 16 104-19m-88 12v133m-16-104 16 13-16 15 16 14-16 15 16 15-16 14m105-126v42m-5 1h10"
      />
    </g>
    <g fill="url(#command-factory-steel)">
      <path
        d="M260 117h78v43h-78zM342 101h86v59h-86zM432 119h124v41H432zM562 91h130v69H562zM698 122h62v38h-62z"
      />
      <path
        d="M304 109V68h13v41h-13Zm60-8V42h12v59h-12Zm101 18V62h17v57h-17Zm97-28V33h13v58h-13Zm63 0V49h17v42h-17Zm72 31V68h13v54h-13Z"
      />
    </g>
    <g stroke="#c0d6e8" stroke-width="2" opacity=".9">
      <path
        d="M262 129h72m-72 12h72m12-28h78m-78 15h78m-78 16h78m12-12h117m-117 13h117m13-38h126m-126 17h126m-126 17h126m-82-55V44m-35 42V28m-66 87V56m-93 42V36"
      />
      <path
        d="M271 125v31m21-31v31m21-31v31m45-47v47m22-47v47m22-47v47m44-27v27m22-27v27m22-27v27m22-27v27m22-27v27m42-53v53m22-53v53m22-53v53m22-53v53m22-53v53m22-53v53"
      />
    </g>
    <g stroke="#d2a460" stroke-width="3" opacity=".55">
      <path d="M271 119h441M280 147h475M392 97h35M576 87h116" />
    </g>
  </svg>
</template>
