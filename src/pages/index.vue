<template>
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

        <div
            v-for="(item, index) in workspaceStore.shortcuts"
            :key="item"
            class="view-wrapper"
            :class="{
              '_active': workspaceStore.focused?._id === item._id && !workspaceStore.focusedDeleted && !workspaceStore.workspaceEnable
            }"
        >
          <universal-view :shortcut="item" />
        </div>

        <workspace
            ref="workRef"
            class="view-wrapper"
            :class="{
              '_active': workspaceStore.workspaceEnable
            }"
        />

        <div
            class="view-wrapper"
            :class="{
              '_active': workspaceStore.focusedDeleted
            }"
        >
          <app-deleted />
        </div>

      </div>

    </div>

  </div>
</template>

<script lang="ts" setup>
import Workspace from "@components/home/Workspace.vue"
import UniversalView from "../components/home/UniversalView.vue"
import HomeNavigation from "@components/home/HomeNavigation.vue"

import {useWorkspaceStore} from "@store/workspace"
import AppDeleted from "@components/includes/AppDeleted.vue";

const workspaceStore = useWorkspaceStore()

</script>

<style scoped>
.view-wrapper {
  @apply absolute top-0 left-0 w-full h-full transition opacity-0 duration-300 ease-in-out z-10 invisible transform scale-95
}

.view-wrapper._active {
  @apply opacity-100 visible scale-100
}
</style>
