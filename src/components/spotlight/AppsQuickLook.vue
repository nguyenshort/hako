<template>
  <div class="pt-5 pb-2">
    <div
        class="flex flex-wrap"
    >
      <div
          v-for="item in workspaceStore.shortcuts"
          :key="item._id"
          class="w-[110px] flex flex-col items-center justify-center relative z-10 mb-4"
      >
        <div class="h-[60px] flex items-center justify-center relative z-10">
          <img
              :src="item.icon"
              alt=""
              class="w-[40px] max-h-[40px] h-auto logo"
          />
        </div>

        <div class="flex items-center relative z-10">
          <p class="text-xs font-medium">
            {{ item.name }}
          </p>
        </div>

      </div>

    </div>

    <p class="px-4 pb-2 text-sm">Ứng dụng bạn đã cài sẽ xuất hiện ở đây</p>
  </div>
</template>

<script lang="ts" setup>
import {useWorkspaceStore} from "@store/workspace";

const workspaceStore = useWorkspaceStore()


</script>
