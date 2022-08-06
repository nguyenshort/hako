<template>
  <div>ok</div>
</template>

<script lang="ts" setup>
import {IShortcut} from "@shared/interface/shortcut";

defineProps<{
  shortcut: IShortcut
}>()
</script>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "UniversalView"
})
</script>

<style scoped>

</style>
