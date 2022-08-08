<template>
  <div :id="'universal-' + shortcut._id" class="h-full"></div>
</template>

<script lang="ts" setup>
import {IShortcut} from "@shared/interface/shortcut";
import {nextTick, onMounted, ref} from "vue"
import {useWorkspaceStore} from "@store/workspace";

const props = defineProps<{
  shortcut: IShortcut
}>()

const workspaceStore = useWorkspaceStore()

const loading = ref(true)
const init = async () => {
  try {
    await window.ipcRenderer.initUniversalView(props.shortcut._id, workspaceStore.shortcuts.length > workspaceStore.counterInit)
    loading.value = false
  } catch (e) {
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
