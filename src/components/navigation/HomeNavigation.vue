<template>
  <div id="navigation" class="w-0 transform relative min-h-screen flex flex-col">

    <!-- fix scrollbar -->
    <div ref="fixRef" class="flex-shrink-0">
      <div class="h-8"></div>
      <ws-item
          :disbale="false"
          @click="toRoute('/')"
          class="last:before:hidden"
          hotkey="⌘N"
          :class="{
            _active: mainStore.activeView === '/',
          }"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" stroke-width="1"/>
          <path d="M12 8V16" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 12L8 12" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </ws-item>
    </div>

    <draggable
        id="list-actions"
        ref="actionsRef"
        v-model="mainStore.apps"
        group="people"
        item-key="_id"
        class="overflow-y-auto scrollbar-hide h-auto"
        @start="drag=true"
        @end="drag=false"
        @change="onChangeOrder"
        :style="{ height }"
    >
      <template #item="{element, index}">
        <ws-item
            :item="element"
            :hotkey="`⌘${index + 1}`"
            :class="{
              _active: mainStore.activeView === element._id,
              'opacity-75': mainStore.activeView !== element._id
            }"
            @click="toRoute(element._id)"
            @contextmenu.prevent="showWsOptions(element)"
        ></ws-item>
      </template>
    </draggable>

    <div ref="fixMenuRef" class="flex-shrink-0 anchor-list">

      <div class="h-6"></div>

      <ws-item
          v-if="mainStore.hasApp"
          :hotkey="`${mainStore.apps.length}`"
          class="apps"
          :class="{
              _active: mainStore.activeView === '/apps'
           }"
          @click="toRoute('/apps')"
      >
        <i-ion-logo-apple-ar class='text-[24px]' />
      </ws-item>

      <ws-item
          :class="{
              _active: mainStore.activeView === '/settings'
           }"
          @click="toRoute('/settings')"
      >
        <i-ion-ios-settings-strong width="24" height="24" />
      </ws-item>


      <div class="mx-1.5 mt-3">
        <div class="text-[8px] w-full text-center uppercase bg-primary-600 py-1 text-white rounded">
          Nâng Cấp
        </div>
      </div>

      <div class="h-3"></div>

    </div>

    <div class="absolute top-0 bottom-0 right-0 w-px dark:bg-slate-800 bg-slate-200"></div>

  </div>
</template>

<script lang="ts" setup>
import {AppDocument} from "@entities/app.entity"

const mainStore = useMainStore()
const appBridge = useAppBridge()

const { height: heightWindow } = useWindowSize()
const fixRef = ref<HTMLDivElement>()
const fixRefSize = useElementSize(fixRef)

const fixMenuRef = ref<HTMLDivElement>()
const fixMenuRefSize = useElementSize(fixMenuRef)

const height = computed(() => {
  return (heightWindow.value - fixRefSize.height.value - fixMenuRefSize.height.value) + 'px'
})

const toRoute = async (route: string) => {
  if(mainStore.activeView === route) {
    return
  }
  mainStore.pushStackView(route)
  await appBridge.pushRoute(route)
}

const showWsOptions = (shortcut: AppDocument) => {
  appBridge.openAppContext(shortcut._id)
}

// drag/drop
const drag = ref(false)

const onChangeOrder = () => {

  const _apps: Array< Pick<AppDocument, '_id' | 'order'>> = mainStore.apps.map((app, index) => {
    return {
      _id: app._id,
      order: index
    }
  })

  appBridge.reAppOrder(_apps)
}
</script>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "HomeNavigation"
})
</script>

<style lang="scss">
#navigation {
  opacity: 0;

  &._active {
    width: 75px;
    opacity: 1;
  }

  .ws-item {
    @apply w-full aspect-1 flex justify-center items-center relative cursor-pointer
  }
  .ws-item {
    @apply before:absolute before:top-0 before:h-px before:left-0 dark:before:left-3 before:right-0 dark:before:right-3 before:bg-slate-200 dark:before:bg-slate-800
  }

  .ws-item {

    &._active {
      @apply bg-primary-50 dark:bg-slate-800 after:absolute after:left-0 after:top-0 after:bottom-0 after:border-l-4 after:border-primary-600
    }

    >.badge {
      @apply absolute bottom-0 right-0 px-2 py-2 rounded-full
    }
    >.badge {
      font-size: 9px;
    }
  }

  .anchor-list > .ws-item {
    aspect-ratio: 5/4;
    &.apps {
      .badge {
        @apply bg-primary-500 dark:bg-slate-800 p-0 w-4 aspect-1 flex justify-center items-center right-2 bottom-2 text-white dark:text-current
      }

      &._active {
        .badge {
          @apply dark:bg-slate-900
        }
      }
    }
  }

}
</style>
