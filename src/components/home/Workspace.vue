<template>
  <div class="px-3 pb-4 pt-2">

    <div class="flex items-center mt-3">
      <div>
        <input type="checkbox" />
        <span class="text-sm ml-2">Show app links</span>
      </div>

      <button class="ml-auto shared-btn">
        Shared App
      </button>

      <button class="shared-btn ml-3">
        Export Data
      </button>

    </div>

    <div class="relative mt-3">

      <svg class="absolute top-1/2 left-4 -translate-x-1/2 transition -translate-y-1/2" width="16" height="16" viewBox="0 0 20 20">
        <path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>

      <input type="text" class="form-input dark:bg-slate-800 rounded pl-8 pr-3 py-1.5 text-sm w-full focus:outline-0" placeholder="Search..." />
    </div>

    <list-short-cut class="mt-4" />

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
import ListShortCut from "../ListShortCut.vue"

</script>
<script lang="ts">
import {defineComponent} from "vue"

export default defineComponent({
  name: "Workspace"
})
</script>

<style scoped>
.shared-btn {
  @apply text-sm px-4 py-0.5 rounded border border-primary-400 text-primary-400
}
</style>
