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
            class="absolute top-0 left-0 w-full h-full"
        >
          <universal-view :shortcut="item" />
        </div>

        <workspace ref="workRef" class="top-0 left-0 w-full absolute h-full" />

        <div class="top-0 left-0 w-full absolute h-full">
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

<style scoped></style>
