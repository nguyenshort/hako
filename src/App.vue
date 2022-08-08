<template>
  <div id="hako" class="antialiased text-slate-500 dark:text-slate-400">
    <router-view />
  </div>
  <setting-modal />
</template>

<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {useWorkspaceStore} from "@store/workspace";
import SettingModal from "@components/includes/SettingModal.vue";
import {IShortcut} from "@shared/interface/shortcut";

// Store
const workspaceStore = useWorkspaceStore()

const getShortcuts = async () => {
  const shortcuts = await window.ipcRenderer.getShortcuts()
  workspaceStore.setShortcuts(shortcuts)
}
onMounted(() => getShortcuts())

// Add listener
onMounted(() => {
  // thêm shortcut
  window.ipcRenderer.useEventListener("after-shortcut-created", (shortcut: IShortcut) => {

    const _index = workspaceStore.shortcuts.findIndex(item => item._id === shortcut._id)
    if (_index === -1) {
      workspaceStore.setShortcuts([...workspaceStore.shortcuts, shortcut])
    } else {
      workspaceStore.shortcuts[_index] = shortcut
    }

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
