<template>
  <div :id="'universal-' + app._id" class="h-full"></div>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, ref} from "vue"
import {IApp} from "../../../shared/models/app";
import {useAppBridge} from "@composables/useAppBridge";

const props = defineProps<{
  app: IApp
}>()

const loading = ref(true)
const init = async () => {
  try {
    await useAppBridge().pushRoute(props.app._id)
    loading.value = false
  } catch (e) {
    //
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
