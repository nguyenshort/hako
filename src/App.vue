<template>
  <div id="hako">
    <div class="antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 min-h-screen">
      <router-view />
    </div>
  </div>
  <setting-modal />
  <app-loading v-if="showPloading" />
</template>

<script lang="ts" setup>

import {onMounted, ref} from "vue";
import AppLoading from "./components/includes/AppLoading.vue"
import {useWorkspaceStore} from "@store/workspace";
import SettingModal from "@components/includes/SettingModal.vue";
import {IShortcut} from "@shared/interface/shortcut";

// Store
const workspaceStore = useWorkspaceStore()

// Preload
const showPloading = ref(true)
onMounted(() => {
  setTimeout(() => {
    showPloading.value = false
  }, 1000)
})

const getShortcuts = async () => {
  const shortcuts = await window.ipcRenderer.getShortcuts()
  workspaceStore.setShortcuts(shortcuts)
}
onMounted(() => getShortcuts())

// Add listener
onMounted(() => {
  // thêm shortcut
  window.ipcRenderer.useEventListener("after-shortcut-created", (shortcut: IShortcut) => {
    workspaceStore.setShortcuts([...workspaceStore.shortcuts, shortcut])
    // Auto focus vào shortcut mới
    workspaceStore.setFocused(shortcut)
  })

  // xóa shortcut
  window.ipcRenderer.useEventListener("after-shortcut-removed", (_id: string) => {

    const items = workspaceStore.shortcuts.filter(item => item._id !== _id)

    // Xóa shortcut trong đang xem
    if (items.length === 0) {
      // Xoá hết
      workspaceStore.setComponentView('workspace')
      workspaceStore.setFocused(undefined)
    } else if (workspaceStore.focused?._id === _id) {
      workspaceStore.setFocused(undefined)
      workspaceStore.setComponentView('app-deleted')
    }

    workspaceStore.setShortcuts(items)

  })

  // Cập nhật
  window.ipcRenderer.useEventListener("after-updated-shortcut", (shortcut: IShortcut) => {
    workspaceStore.setShortcuts(workspaceStore.shortcuts.map(item => item._id === shortcut._id ? shortcut : item))
  })
})

</script>
