<template>
  <div class="bg-white dark:bg-slate-900 min-h-screen">

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

  </div>

  <app-loading v-if="showPloading" />
</template>

<script lang="ts" setup>
import Workspace from "@components/home/Workspace.vue"
import MyShortcuts from "@components/MyShortcuts.vue"

import UniversalView from "../components/home/UniversalView.vue"
import HomeNavigation from "@components/navigation/HomeNavigation.vue"

import {useWorkspaceStore} from "@store/workspace"
import {computed, nextTick, onMounted, ref} from "vue";
import AppLoading from "../App.vue";

const workspaceStore = useWorkspaceStore()

// Preload
const showPloading = ref(true)
onMounted(() => {
  setTimeout(() => {
    showPloading.value = false
  }, 1000)
})

// Fix when init app => auto switch shortcut
const counter = ref(0)


// Sự kiện phát ra khi có view mới dc tiêm vào
const focusLastView = () => {
  window.ipcRenderer.useEventListener('focus-last-view', (view: string) => {
    if(view.startsWith('universal-')) {
      counter.value++

      // Fix nhấp nháy counter
      if(counter.value > workspaceStore.shortcuts.length) {
        const _id = view.split('-')[1]
        const shortcut = workspaceStore.shortcuts.find(item => item._id === _id)
        if(shortcut) {
          workspaceStore.setFocused(shortcut)
        }
      }
    }
  })
}

onMounted(() => nextTick( () => focusLastView()))


const inView = computed<any>(() => {
  let component
  switch (workspaceStore.componentView) {
    case 'workspace':
      component = Workspace
      break
    case 'my-shortcuts':
      component = MyShortcuts
      break
    default:
      component = UniversalView
      break
  }
  return component
})

</script>
