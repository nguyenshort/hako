<template>
  <div id="home">

    <div class="flex">
      <home-navigation
          ref="naviRef"
          :class="{
            '_active': workspaceStore.hasShortcut
          }"
      />
      <workspace ref="workRef" class="w-full" />
    </div>

  </div>
</template>

<script lang="ts" setup>
import Workspace from "@components/home/Workspace.vue"
import UniversalView from "../components/home/UniversalView.vue"
import HomeNavigation from "@components/home/HomeNavigation.vue"

import {useWorkspaceStore} from "@store/workspace"

const workspaceStore = useWorkspaceStore()

</script>

<style scoped></style>
