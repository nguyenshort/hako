<template>
  <div class="flex items-center">
    <h4 class="uppercase font-semibold">
      {{ title }}
    </h4>

    <div class="ml-auto"></div>

    <slot></slot>

  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
}>()
</script>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "PageTitle"
})
</script>

<style scoped>

</style>
