<template>
  <div :id="'universal-' + shortcut._id"></div>
</template>

<script lang="ts" setup>
import {IShortcut} from "@shared/interface/shortcut";
import {nextTick, onMounted, ref} from "vue";

const props = defineProps<{
  shortcut: IShortcut
}>()

const loading = ref(true)
const init = async () => {
  try {
    await window.ipcRenderer.initUniversalView(props.shortcut._id)
    loading.value = false
  } catch (e) {
    // Todo: handle error
  }
}

onMounted(() => nextTick(() => init()))
</script>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "UniversalView"
})
</script>

<style scoped></style>
