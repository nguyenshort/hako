<template>

  <div id="list-app" class="flex flex-wrap justify-evenly overflow-y-auto scrollbar-hide">

    <div class="w-[110px] item-shortcut item-shortcut-bg">

      <div class="w-[60px] aspect-1 flex justify-center items-center relative z-10">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 8V16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16 12L8 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>

      <p class="text-xs font-medium ml-1 relative z-10">Add App</p>

    </div>

    <div
        v-for="app in apps"
        :key="app.name"
        class="w-[110px] item-shortcut item-shortcut-bg"
        @click="addHandle(app)"
    >
      <div class="h-[60px] flex items-center justify-center relative z-10">
        <img
            :src="app.icon"
            alt=""
            class="w-[45px] max-h-[45px] h-auto"
        />
      </div>

      <div class="flex items-center mt-1.5 relative z-10">
        <svg width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" class="fill-current" viewBox="0 0 512 512">
          <path d="M256 464c114.87 0 208-93.13 208-208S370.87 48 256 48 48 141.13 48 256s93.13 208 208 208zm-91.36-212.65a16 16 0 0122.63-.09L240 303.58V170a16 16 0 0132 0v133.58l52.73-52.32A16 16 0 11347.27 274l-80 79.39a16 16 0 01-22.54 0l-80-79.39a16 16 0 01-.09-22.65z"/>
        </svg>
        <p class="text-xs font-medium ml-1">
          {{ app.name }}
        </p>
      </div>

    </div>

    <!--Fix size-->
    <div
        v-for="index in 30"
        :key="index"
        class="w-[110px] item-shortcut"
    ></div>

  </div>

</template>

<script lang="ts" setup>
import {computed, reactive} from "vue";
import {useWindowSize} from "@vueuse/core";
import {IAppInput} from "../../shared/models/app";
import {useAppBridge} from "@composables/useAppBridge";

const apps = reactive<IAppInput[]>([
  {
    name: "Google",
    icon: "/images/google.png",
    url: "https://google.com"
  },
  {
    name: "Youtube",
    icon: "/images/youtube.png",
    url: "https://youtube.com"
  },
 {
    name: "Facebook",
    icon: "/images/facebook.png",
    url: "https://facebook.com"
  },
  {
    name: "Twitter",
    icon: "/images/twitter.png",
    url: "https://twitter.com"
  },
  {
    name: "Instagram",
    icon: "/images/instagram.png",
    url: "https://instagram.com"
  },
  {
    name: "Tiktok",
    icon: "/images/tiktok.png",
    url: "https://tiktok.com"
  }
])

const addHandle = async (app: IAppInput) => {
  try {
    await useAppBridge().createApp(Object.assign({}, app))
  } catch (e) {
    //TODO: handle error
  }
}

const { height: heightWindow } = useWindowSize()
const height = computed(() => {
  if(window.innerHeight <= 0) {
    return '0px'
  }
  // 35 bottom + 35 bottom + ~ 40 space
  return `${heightWindow.value - 35 - 35 - 40 - 40 - 10}px`
})
</script>

<script lang="ts">
import {defineComponent} from "vue"

export default defineComponent({
  name: "ListApps"
})
</script>

<style scoped>
.item-shortcut {
  @apply aspect-1 overflow-hidden flex flex-col justify-center items-center cursor-pointer mb-2 relative
}
.item-shortcut-bg {
  @apply before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-primary-50 before:scale-90 before:rounded-md dark:before:bg-slate-800
}

#list-app {
  height: v-bind(height);
}
</style>
