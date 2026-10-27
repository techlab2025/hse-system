<template>
  <span class="ql-formats">
    <select class="ql-header" :aria-label="$t('editor.style')">
      <option value="1">{{ $t('editor.heading') }}</option>
      <option value="2">{{ $t('editor.subheading') }}</option>
      <option value="0" selected>{{ $t('editor.normal') }}</option>
    </select>
    <select class="ql-font" :aria-label="$t('editor.font')">
      <option selected>{{ $t('editor.normal') }}</option>
      <option value="serif">{{ $t('editor.serif') }}</option>
      <option value="monospace">{{ $t('editor.monospace') }}</option>
    </select>
  </span>
  <span class="ql-formats">
    <button
      class="ql-bold"
      type="button"
      :aria-label="$t('editor.bold')"
      :title="$t('editor.bold')"
    ></button>
    <button
      class="ql-italic"
      type="button"
      :aria-label="$t('editor.italic')"
      :title="$t('editor.italic')"
    ></button>
    <button
      class="ql-underline"
      type="button"
      :aria-label="$t('editor.underline')"
      :title="$t('editor.underline')"
    ></button>
  </span>
  <span class="ql-formats">
    <select class="ql-color" :aria-label="$t('editor.color')"></select>
    <select class="ql-background" :aria-label="$t('editor.background')"></select>
  </span>
  <span class="ql-formats">
    <button
      class="ql-list"
      value="ordered"
      type="button"
      :aria-label="$t('editor.numbered')"
      :title="$t('editor.numbered')"
    ></button>
    <button
      class="ql-list"
      value="bullet"
      type="button"
      :aria-label="$t('editor.bullets')"
      :title="$t('editor.bullets')"
    ></button>
    <select class="ql-align" :aria-label="$t('editor.align')">
      <option selected></option>
      <option value="center"></option>
      <option value="right"></option>
      <option value="justify"></option>
    </select>
  </span>
  <span class="ql-formats">
    <button
      class="ql-link"
      type="button"
      :aria-label="$t('editor.link')"
      :title="$t('editor.link')"
    ></button>
    <button
      class="ql-image"
      type="button"
      :aria-label="$t('editor.image')"
      :title="$t('editor.image')"
    ></button>
    <button
      class="ql-code-block"
      type="button"
      :aria-label="$t('editor.code')"
      :title="$t('editor.code')"
    ></button>
    <button
      class="ql-clean"
      type="button"
      :aria-label="$t('editor.clear')"
      :title="$t('editor.clear')"
    ></button>
  </span>
</template>
