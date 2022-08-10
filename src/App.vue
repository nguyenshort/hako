<template>
  <div id="hako" class="antialiased text-slate-500 dark:text-slate-400">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import {useColorMode} from "@vueuse/core";

useColorMode()
</script>

<style>
._page-bg {
  @apply bg-white dark:bg-slate-900 min-h-screen
}
</style>
