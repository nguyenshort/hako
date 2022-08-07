<template>
  <div id="home">
    <div class="flex">
      <home-navigation
          ref="naviRef"
          class="flex-shrink-0"
          :class="{
            '_active': workspaceStore.hasShortcut
          }"
      />

      <!-- List Workspace -->
      <div class="w-full relative">
        <component
            :is="inView"
            :key="workspaceStore.componentView"
        ></component>
      </div>

    </div>

    <!-- Universal Apps -->
    <universal-view
        v-for="item in workspaceStore.shortcuts"
        :key="item"
        :shortcut="item"
    />

  </div>
</template>

<script lang="ts" setup>
import Workspace from "@components/home/Workspace.vue"
import AppDeleted from "@components/includes/AppDeleted.vue"

import UniversalView from "../components/home/UniversalView.vue"
import HomeNavigation from "@components/navigation/HomeNavigation.vue"

import {useWorkspaceStore} from "@store/workspace"
import {computed, nextTick, onMounted} from "vue";

const workspaceStore = useWorkspaceStore()


// Sự kiện phát ra khi có view mới dc tiêm vào
const listenUniversalInjected = () => {
  // window.ipcRenderer.useEvent('injected-universal-view', (_id: string) => {
  //   console.log('Injected:', _id)
  //   const shortcut = workspaceStore.shortcuts.find(item => item._id === _id)
  //   if(!shortcut) return
  //   workspaceStore.setFocusedShortcut(shortcut)
  // })
}

onMounted(() => nextTick( () => listenUniversalInjected()))


const inView = computed<any>(() => {
  return (workspaceStore.componentView === 'workspace' ? Workspace : AppDeleted)
})

</script>
