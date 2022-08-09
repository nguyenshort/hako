<template>
  <div id="my-shortcuts" class="px-4 py-5 flex flex-col h-full">
    <export-data class="pb-7">
      <h4 class="uppercase font-semibold">Ứng Dụng Của Tôi</h4>
    </export-data>

    <draggable
        id="shortcuts"
        ref="actionsRef"
        v-model="workspaceStore.apps"
        group="people"
        item-key="_id"
        class="flex flex-wrap overflow-y-auto scrollbar-hide"
        @start="drag=true"
        @end="drag=false"
    >
      <template #item="{element}">
        <div
            class="w-[110px] item-shortcut"
            @contextmenu.prevent="showWsOptions(element)"
        >
          <div class="h-[60px] flex items-center justify-center relative z-10">
            <img
                :src="element.icon"
                alt=""
                class="w-[45px] max-h-[45px] h-auto logo"
            />
          </div>

          <div class="flex items-center mt-1.5 relative z-10">
            <p class="text-xs font-medium">
              {{ element.name }}
            </p>
          </div>

        </div>
      </template>
    </draggable>

    <div class="mt-auto flex items-center justify-between">
      <p class="text-xs">Kéo thay để thay đổi thứ tự ứng dụng</p>
      <p class="text-xs">© Hako Inc</p>
    </div>

  </div>
</template>

<script lang="ts" setup>
import ExportData from "@components/ExportData.vue"
import {useMainStore} from "@store/workspace";
import {ref} from "vue"
import draggable from 'vuedraggable'
import {IApp} from "@shared/models/app";

const workspaceStore = useMainStore()


const drag = ref(false)

const showWsOptions = (shortcut: IApp) => {
  window.ipcRenderer.openShortcutContext(shortcut._id)
}

</script>

<style scoped>
.item-shortcut {
  @apply aspect-1 overflow-hidden flex flex-col justify-center items-center cursor-pointer mb-2 relative
}
</style>
