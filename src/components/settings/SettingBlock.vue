<template>
  <section>
    <p class="block-title">{{ title }}</p>
    <div class="block-content">
      <slot></slot>
    </div>
    <div v-if="decription" class="text-xs mt-3 opacity-90">
      {{ decription }}
    </div>
  </section>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
  decription?: string
}>()
</script>

<style scoped lang="scss">
section {
  > .block-title {
    @apply text-[16px] font-semibold text-gray-200 mb-0;
  }
  > .block-content {
    @apply mt-2.5;
  }

  + section {
    @apply mt-[25px];
  }
}
</style>
