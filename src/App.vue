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
    workspaceStore.setFocusedShortcut(shortcut)
  })

  // xóa shortcut
  window.ipcRenderer.useEventListener("after-shortcut-removed", (_id: string) => {
    console.log("after-shortcut-removed", _id)
    workspaceStore.setShortcuts(workspaceStore.shortcuts.filter(item => item._id !== _id))
  })

  // Cập nhật
  window.ipcRenderer.useEventListener("after-updated-shortcut", (shortcut: IShortcut) => {
    workspaceStore.setShortcuts(workspaceStore.shortcuts.map(item => item._id === shortcut._id ? shortcut : item))
  })
})

</script>
