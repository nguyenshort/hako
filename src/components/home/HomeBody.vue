<template>
  <div
      id="home-body"
      class="px-4 pb-5"
      :class="{
        'pt-5': workspaceStore.hasApp,
        'pt-8': !workspaceStore.hasApp
      }"
  >
    <page-title
        title="Ứng Dụng Của Tôi"
        class="pb-5"
    >
    </page-title>

    <div class="relative">

      <svg class="absolute top-1/2 left-4 -translate-x-1/2 transition -translate-y-1/2 text-primary-600 dark:text-current" width="16" height="16" viewBox="0 0 20 20">
        <path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>

      <input
          type="text"
          class="form-input bg-primary-50 dark:bg-slate-800 rounded pl-8 pr-3 py-1.5 text-sm w-full focus:outline-0"
          placeholder="Search..."
      />
    </div>

    <list-apps class="mt-4 -mx-2" />

    <div class="fixed bottom-0 left-0 right-0">
      <div class="flex justify-end">
        <div class="text-xs px-3 pb-3">
          © Hako Inc
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
const workspaceStore = useMainStore()
</script>
