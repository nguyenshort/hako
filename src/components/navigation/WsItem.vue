<template>
  <div
      ref="el"
      class="ws-item transition transform duration-300 ease-in-out"
  >
    <div>
      <slot></slot>
      <img
          v-if="item?.icon"
          :src="item?.icon"
          class="w-8 transform duration-300 ease-in-out transition hover:scale-125"
          alt=""
      />
    </div>

    <span v-if="hotkey" class="badge">
      {{ hotkey }}
    </span>

  </div>
</template>

<script lang="ts" setup>
import {IApp} from "@shared/models/app"

const props = defineProps<{
  hotkey?: string
  item?: IApp
}>()

</script>
