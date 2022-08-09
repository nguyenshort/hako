<template>
  <div id="hako" class="antialiased text-slate-500 dark:text-slate-400">
    <router-view />
  </div>
  <setting-modal />
</template>

<script lang="ts" setup>
import SettingModal from "@components/includes/SettingModal.vue"
</script>
