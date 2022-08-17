<template>
  <div>

    <setting-block title="Ngôn Ngữ">
      <div class="langs">
        <button
            class="text-[20px]"
            :class="{
                active: userStore.user?.language === 'vi'
            }"
            @click="changeLanguage('vi')"
        >
          <i-flagpack-vn />
        </button>
        <button
            class="text-[20px]"
            :class="{
                active: userStore.user?.language === 'en'
            }"
            @click="changeLanguage('en')"
        >
          <i-flagpack-us />
        </button>
        <button
            class="text-[20px]"
            :class="{
                active: userStore.user?.language === 'jp'
            }"
            @click="changeLanguage('jp')"
        >
          <i-flagpack-jp />
        </button>
      </div>
    </setting-block>

    <setting-block
        :title="`Giao Diện (${userStore.user?.theme})`"
        decription="Dùng chế độ auto để tự động chuyển theo hệ thống."
    >
      <div class="langs flex items-center">
        <button
            class="w-8 h-8 bg-slate-900 rounded-full flex justify-center items-center text-white"
            :class="{
                active: userStore.user?.theme  === 'auto'
            }"
            @click="changeColor('auto')"
        >
          <i-fluent-dark-theme-20-filled />
        </button>

        <button
            class="w-8 h-8 bg-slate-900 rounded-full text-white flex justify-center items-center text-[18px] ml-3"
            :class="{
                active: userStore.user?.theme === 'dark'
            }"
            @click="changeColor('dark')"
        >
          <i-material-symbols-dark-mode />
        </button>

        <button
            class="w-7 h-7 bg-white rounded-full ml-3 flex justify-center items-center text-slate-900"
            :class="{
                active: userStore.user?.theme === 'light'
            }"
            @click="changeColor('light')"
        >
          <i-material-symbols-wb-sunny />
        </button>
      </div>
    </setting-block>

  </div>
</template>

<script lang="ts" setup>
import {BasicColorSchema} from "@vueuse/core";

const userStore = useUserStore()
const appBridge = useAppBridge()

const changeColor = async (color: BasicColorSchema) => {
  if(!userStore.user) {
    return
  }
  userStore.user.theme = color
  await appBridge.updateUser({ theme: color })
}

const changeLanguage = (language: string) => {
  if(!userStore.user) {
    return
  }
  userStore.user.language = language
  appBridge.updateUser({ language })
}

</script>

<style scoped lang="scss">

.langs {
  > button {
    @apply transition;
    & + button {
      margin-left: 1rem;
    }
    &:not(.active) {
      opacity: 0.4;
    }
  }
}
</style>
