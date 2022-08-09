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
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M201.14 64L256 32l54.86 32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M256 32v80"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M310.86 448L256 480l-54.86-32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M256 480v-80"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M64 207.51V144l53.15-31.51"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M64 144l67.29 40"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M448 304.49V368l-53.15 31.51"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M448 368l-67.29-40"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M117.15 400L64 368v-63.51"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M64 368l66.64-40"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M394.85 112.49L448 144v63.51"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M448 144l-67.29 40M256 320v-64l54.86-32M256 256l-54.86-32"/></svg>
      </ws-item>

      <ws-item @click="toggleColorMode">
        <svg v-if="mode === 'light'" width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M256 48v48M256 416v48M403.08 108.92l-33.94 33.94M142.86 369.14l-33.94 33.94M464 256h-48M96 256H48M403.08 403.08l-33.94-33.94M142.86 142.86l-33.94-33.94"/><circle cx="256" cy="256" r="80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32"/></svg>
        <svg v-else width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M160 136c0-30.62 4.51-61.61 16-88C99.57 81.27 48 159.32 48 248c0 119.29 96.71 216 216 216 88.68 0 166.73-51.57 200-128-26.39 11.49-57.38 16-88 16-119.29 0-216-96.71-216-216z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
      </ws-item>

      <ws-item @click="toRoute('/settings')">
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 128h80M64 128h240M368 384h80M64 384h240M208 256h240M64 256h80"/><circle cx="336" cy="128" r="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="176" cy="256" r="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="336" cy="384" r="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
      </ws-item>


      <div class="mx-1.5">
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
import {useMainStore} from "@store/workspace";
import {useColorMode, useElementSize, useWindowSize} from "@vueuse/core";
import {computed, ref} from "vue";
import WsItem from "@components/navigation/WsItem.vue";
import draggable from 'vuedraggable'
import {IApp} from "../../../shared/models/app";
import {useAppBridge} from "@composables/useAppBridge";

const mainStore = useMainStore()

const { height: heightWindow } = useWindowSize()
const fixRef = ref<HTMLDivElement>()
const fixRefSize = useElementSize(fixRef)

const fixMenuRef = ref<HTMLDivElement>()
const fixMenuRefSize = useElementSize(fixMenuRef)

const height = computed(() => {
  return (heightWindow.value - fixRefSize.height.value - fixMenuRefSize.height.value) + 'px'
})

const mode = useColorMode() // Ref<'dark' | 'light'>
const toggleColorMode = () => {
  mode.value === 'dark' ? mode.value = 'light' : mode.value = 'dark'
}

const toRoute = async (route: string) => {
  mainStore.pushStackView(route)
  await useAppBridge().pushRoute(route)
}

const showWsOptions = (shortcut: IApp) => {
  useAppBridge().openAppContext(shortcut._id)
}

// drag/drop
const drag = ref(false)
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
