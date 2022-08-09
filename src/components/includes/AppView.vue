<template>
  <div :id="'universal-' + app._id" class="h-full"></div>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, ref} from "vue"
import {useMainStore} from "@store/workspace";
import {IApp} from "../../../shared/models/app";

const props = defineProps<{
  app: IApp
}>()

const workspaceStore = useMainStore()

const loading = ref(true)
const init = async () => {
  try {
    await window.appFn.upsert(props.app._id, workspaceStore.apps.length > workspaceStore.counterInit)
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
