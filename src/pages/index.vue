<template>
  <div class="bg-white dark:bg-slate-900 min-h-screen">

    <div id="home">
      <div class="flex">
        <home-navigation
            ref="naviRef"
            class="flex-shrink-0"
            :class="{
              '_active': mainStore.hasApp
            }"
        />

        <home-body class="w-full relative" />

      </div>

      <!-- Universal Apps -->
      <universal-view
          v-for="item in mainStore.apps"
          :key="item"
          :app="item"
      />

    </div>

  </div>

  <home-loading v-if="showPloading" />
</template>

<script lang="ts" setup>
import UniversalView from "@components/includes/AppView.vue"
import HomeNavigation from "@components/navigation/HomeNavigation.vue"

import {useMainStore} from "@store/workspace"
import {nextTick, onMounted, ref} from "vue";
import {IApp} from "../../shared/models/app";
import HomeBody from "@components/home/HomeBody.vue";
import HomeLoading from "@components/home/HomeLoading.vue";
import {AppEvents} from "../../shared/events/app.events";
import {useHeplFn} from "@composables/useElectron";

const mainStore = useMainStore()

// Preload animation
const showPloading = ref(true)
onMounted(() => {
  setTimeout(() => {
    showPloading.value = false
  }, 1000)
})

const getApps = async () => {
  const shortcuts = await window.appFn.get()
  mainStore.setApps(shortcuts)
  mainStore.setCounterInit(shortcuts.length)
}
onMounted(() => getApps())

// Add listener
onMounted(() => {
  // thêm app
  window.helpFn.useEventListener(AppEvents.CREATED, (shortcut: IApp) => {

    const _index = mainStore.apps.findIndex(item => item._id === shortcut._id)
    if (_index === -1) {
      useHeplFn().showNotification('App created', 'success')
      mainStore.setApps([...mainStore.apps, shortcut])
    } else {
      mainStore.apps[_index] = shortcut
    }

    // Auto focus vào shortcut mới
    mainStore.setFocused(shortcut)
  })

  // xóa shortcut
  window.helpFn.useEventListener(AppEvents.REMOVED, (_id: string) => {

    const items = mainStore.apps.filter(item => item._id !== _id)

    // Xóa shortcut trong đang xem
    if (items.length === 0) {
      // Xoá hết
      mainStore.setFocused(undefined)
      mainStore.setComponentView('workspace')
    } else if (mainStore.focused?._id === _id) {
      mainStore.setFocused(undefined)
    }
    //  workspaceStore.setComponentView('workspace')
    mainStore.setApps(items)

    useHeplFn().showNotification('App removed', 'success')

  })

  // Cập nhật
  window.helpFn.useEventListener("after-updated-shortcut", (shortcut: IApp) => {
    mainStore.setApps(mainStore.apps.map(item => item._id === shortcut._id ? shortcut : item))
  })
})

// Fix when init app => auto switch shortcut
const counter = ref(0)


// Sự kiện phát ra khi có view mới dc tiêm vào
const focusLastView = () => {
  window.helpFn.useEventListener('focus-last-view', (view: string) => {
    if(view.startsWith('universal-')) {
      counter.value++

      // Fix nhấp nháy counter
      if(counter.value > mainStore.apps.length) {
        const _id = view.split('-')[1]
        const shortcut = mainStore.apps.find(item => item._id === _id)
        if(shortcut) {
          mainStore.setFocused(shortcut)
        }
      }
    }
  })
}

onMounted(() => nextTick( () => focusLastView()))
</script>
