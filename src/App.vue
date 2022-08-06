<template>
  <div id="hako">
    <div class="antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 min-h-screen">
      <router-view />
    </div>
  </div>
  <app-loading v-if="showPloading" />
</template>

<script lang="ts" setup>

import {onMounted, ref} from "vue";
import AppLoading from "./components/includes/AppLoading.vue"
import {useEmitter} from "@nguyenshort/vue3-mitt"
import {useWorkspaceStore} from "@store/workspace";

// Store
const workspaceStore = useWorkspaceStore()

// Preload
const showPloading = ref(true)
onMounted(() => {
  setTimeout(() => {
    showPloading.value = false
  }, 1000)
})

const refreshShortcuts = async () => {
  const shortcuts = await window.ipcRenderer.getShortcuts()
  workspaceStore.setShortcuts(shortcuts)
}
onMounted(() => refreshShortcuts())

// Làm mới shortcuts
const emitter = useEmitter()
onMounted(() => {
  emitter.on('refresh-shortcuts', refreshShortcuts)
})

</script>
