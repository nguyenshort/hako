<template>
  <div id="my-shortcuts" class="px-4 py-5">
    <export-data class="pb-7">
      <h4 class="uppercase font-semibold">Ứng Dụng Của Tôi</h4>
    </export-data>

    <div id="shortcuts" class="flex flex-wrap overflow-y-auto scrollbar-hide">
      <div
          v-for="app in workspaceStore.shortcuts"
          :key="app.name"
          class="w-[110px] item-shortcut"
      >
        <div class="h-[60px] flex items-center justify-center relative z-10">
          <img
              :src="app.icon"
              alt=""
              class="w-[45px] max-h-[45px] h-auto logo"
          />
        </div>

        <div class="flex items-center mt-1.5 relative z-10">
          <p class="text-xs font-medium">
            {{ app.name }}
          </p>
        </div>

      </div>

    </div>

  </div>
</template>

<script lang="ts" setup>
import ExportData from "@components/ExportData.vue"
import {useWorkspaceStore} from "@store/workspace";

const workspaceStore = useWorkspaceStore()

</script>

<style scoped>
.item-shortcut {
  @apply aspect-1 overflow-hidden flex flex-col justify-center items-center cursor-pointer mb-2 relative
}
</style>
