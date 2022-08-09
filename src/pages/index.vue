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

      <!-- Apps -->

    </div>

  </div>

  <home-loading v-if="showPloading" />
</template>

<script lang="ts" setup>
import HomeNavigation from "@components/navigation/HomeNavigation.vue"

import {useMainStore} from "@store/workspace"
import {nextTick, onMounted, ref} from "vue";
import HomeBody from "@components/home/HomeBody.vue";
import HomeLoading from "@components/home/HomeLoading.vue";
import {useAppBridge} from "@composables/useAppBridge";
import {IApp} from "../../shared/models/app";

const mainStore = useMainStore()
const appBridge = useAppBridge()

// Preload animation
const showPloading = ref(true)
onMounted(() => {
  setTimeout(() => {
    showPloading.value = false
  }, 1000)
})

const getMyApps = async () => {
  const apps = await appBridge.getMyApps()
  mainStore.setApps(apps)
  mainStore.setCounterInit(apps.length)
}
onMounted(() => getMyApps())

// Listener
onMounted(() => nextTick(() => {
    // Sự kiện app được thêm vào
    appBridge.addEventListener('app:created', (app: IApp) => {
      const _index = mainStore.apps.findIndex(item => item._id === app._id)
      if (_index === -1) {
        appBridge.pushNotify('App created', 'success')
        mainStore.setApps([...mainStore.apps, app])
      } else {
        mainStore.apps[_index] = app
      }
    })

    // Sự kiện app được xóa
    appBridge.addEventListener('app:removed', (_id: string) => {
      const _index = mainStore.apps.findIndex(item => item._id === _id)
      if (_index !== -1) {
        appBridge.pushNotify('App deleted', 'success')
        mainStore.apps.splice(_index, 1)
      }
    })

  // sự kiện stack change
  appBridge.addEventListener('focused:change', (views: string[]) => {
    mainStore.setStackViews(views)
  })
}))
</script>
