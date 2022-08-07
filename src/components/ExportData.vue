<template>
  <div class="flex items-center">
    <slot></slot>

    <button class="ml-auto shared-btn">
      Shared App
    </button>

    <button class="shared-btn ml-3">
      Export Data
    </button>

  </div>
</template>

<script>
export default {
  name: "ExportData"
}
</script>

<style scoped>
.shared-btn {
  @apply text-sm px-4 py-0.5 rounded border border-primary-400 dark:text-primary-400 dark:bg-transparent text-white bg-primary-600
}
</style>
