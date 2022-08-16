<template>
  <div class="_page-bg">

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
import {AppDocument} from "@entities/app.entity"

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
  appBridge.addEventListener('app:created', (app: AppDocument) => {
    mainStore.pushStackView(app._id)
    appBridge.pushRoute(app._id)
    appBridge.pushNotify('App created', 'success')
  })

  // Sự kiện app được xóa
  appBridge.addEventListener('app:removed', (_id: string) => {
    appBridge.pushNotify('App deleted', 'success')
  })

  // sự kiện stack change
  appBridge.addEventListener('focused:change', (views: string[]) => {
    mainStore.setStackViews(views)
  })

  // sự kiện app được chọn
  appBridge.addEventListener('apps:change', (apps: AppDocument[]) => {
    mainStore.setApps(apps)
  })

}))
</script>
