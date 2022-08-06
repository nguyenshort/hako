<template>
  <div id="navigation" class="w-0 transform relative">

    <div class="h-9"></div>


    <div id="list-actions" class="overflow-y-auto scrollbar-hide">
      <div>
        <div
            v-for="(item, index) in workspaceStore.shortcuts"
            :key="item._id"
            class="ws-item"
            @click="removeShortcut(item)"
        >
          <div>
            <img
                :src="item.icon"
                class="w-8"
                alt=""
            />
          </div>

          <span class="badge">
          ⌘{{ index + 1 }}
        </span>

        </div>
        <div class="ws-item last:before:hidden">
          <div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" stroke-width="1"/>
              <path d="M12 8V16" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 12L8 12" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <span class="badge">
          ⌘N
        </span>

        </div>
      </div>

      <div v-for="index in 3" :key="index" class="ws-item _fake"></div>
    </div>

    <div class="absolute bottom-0 pb-2 right-0 left-0 _fix">

      <div class="h-36"></div>

      <div class="ws-item" @click="toggleColorMode">
        <div>
          <svg v-if="mode === 'light'" width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M256 48v48M256 416v48M403.08 108.92l-33.94 33.94M142.86 369.14l-33.94 33.94M464 256h-48M96 256H48M403.08 403.08l-33.94-33.94M142.86 142.86l-33.94-33.94"/><circle cx="256" cy="256" r="80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32"/></svg>
          <svg v-else width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M160 136c0-30.62 4.51-61.61 16-88C99.57 81.27 48 159.32 48 248c0 119.29 96.71 216 216 216 88.68 0 166.73-51.57 200-128-26.39 11.49-57.38 16-88 16-119.29 0-216-96.71-216-216z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
        </div>
      </div>

      <div class="ws-item">
        <div>
          <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 128h80M64 128h240M368 384h80M64 384h240M208 256h240M64 256h80"/><circle cx="336" cy="128" r="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="176" cy="256" r="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="336" cy="384" r="32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
        </div>
      </div>


      <div class="mx-1.5">
        <div class="text-[8px] w-full text-center uppercase bg-primary-600 py-1 text-white rounded">
          Nâng Cấp
        </div>
      </div>

    </div>


    <div class="absolute top-0 bottom-0 right-0 w-px bg-slate-800"></div>

  </div>
</template>

<script lang="ts" setup>
import {useWorkspaceStore} from "@store/workspace";
import {IShortcut} from "@shared/interface/shortcut";
import {useColorMode, useWindowSize} from "@vueuse/core";
import {computed, watch} from "vue";

const workspaceStore = useWorkspaceStore()

const removeShortcut = async (shortcut: IShortcut) => {
  try {
    console.log('removeShortcut', shortcut)
    await window.ipcRenderer.removeShortcut(shortcut._id)
    workspaceStore.removeShortcut(shortcut._id)
    await window.ipcRenderer.showNotification('Shortcut removed', 'success')
  } catch (e) {
   // Todo: Error
  }
}


const { height: heightWindow } = useWindowSize()

const height = computed(() => {
  return (heightWindow.value - 36) + 'px'
})

const mode = useColorMode() // Ref<'dark' | 'light'>
const toggleColorMode = () => {
  mode.value === 'dark' ? mode.value = 'light' : mode.value = 'dark'
}

/**
 * Lắng nghe số shortcut thay đổi
 * Có các trường hợp sau có thể xảy ra
 * 1. Thêm mới shortcut
 * 2. Xóa shortcut | đang/không focus trên shortcut
 * 3. Sửa shortcut
 */
watch(() => workspaceStore.shortcuts.length, (value, oldValue) => {
  console.log(value, oldValue)
  // Todo
})

</script>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "HomeNavigation"
})
</script>

<style scoped>

#list-actions {
  height: v-bind(height);
}

#navigation {
  opacity: 0;
  transition: width 300ms ease-in-out;
}

#navigation._active {
  width: 83px;
  opacity: 1;
}

.ws-item {
  @apply w-full aspect-1 flex justify-center items-center relative before:absolute before:bottom-0 before:h-px before:left-3 before:right-3 before:bg-slate-800 cursor-pointer
}
.ws-item._fake:before {
  display: none;
}

.ws-item > .badge {
  @apply absolute bottom-0 right-0 px-2 py-2 rounded-full
}
.ws-item > .badge {
  font-size: 9px;
}

#navigation > ._fix > .ws-item {
  aspect-ratio: 5/4;
}

#navigation > ._fix {
  @apply bg-gradient-to-b from-transparent to-slate-900 via-slate-900
}
</style>
