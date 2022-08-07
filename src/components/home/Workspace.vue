<template>
  <div
      class="px-5 pb-4"
      :class="{
        'pt-7': !workspaceStore.hasShortcut,
        'pt-4': workspaceStore.hasShortcut
      }"
  >

    <export-data>
      <div class="flex items-center">
        <input type="checkbox" />
        <span class="text-[13px] ml-2">Show app links</span>
      </div>
    </export-data>

    <div class="relative mt-3">

      <svg class="absolute top-1/2 left-4 -translate-x-1/2 transition -translate-y-1/2 text-primary-600 dark:text-current" width="16" height="16" viewBox="0 0 20 20">
        <path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>

      <input
          type="text"
          class="form-input bg-primary-50 dark:bg-slate-800 rounded pl-8 pr-3 py-1.5 text-sm w-full focus:outline-0"
          placeholder="Search..."
      />
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
import {useWorkspaceStore} from "@store/workspace";
import ExportData from "@components/ExportData.vue"

const workspaceStore = useWorkspaceStore()


</script>
<script lang="ts">
import {defineComponent} from "vue"

export default defineComponent({
  name: "Workspace"
})
</script>
