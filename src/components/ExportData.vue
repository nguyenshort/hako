<template>
  <div class="flex items-center">
    <h4 class="uppercase font-semibold">Ứng Dụng Của Tôi</h4>

    <div class="ml-auto"></div>

  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "ExportData"
})
</script>

<style scoped>
.shared-btn {
  @apply text-sm px-4 py-0.5 rounded border border-primary-400 dark:text-primary-400 dark:bg-transparent text-white bg-primary-600
}
</style>
