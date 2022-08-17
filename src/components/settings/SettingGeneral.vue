<template>
  <div>

    <setting-block title="Ngôn Ngữ">
      <div class="langs">
        <button
            class="text-[20px]"
            :class="{
                active: currentLag === 'vi'
            }"
            @click="currentLag = 'vi'"
        >
          <i-flagpack-vn />
        </button>
        <button
            class="text-[20px]"
            :class="{
                active: currentLag === 'en'
            }"
            @click="currentLag = 'en'"
        >
          <i-flagpack-us />
        </button>
        <button
            class="text-[20px]"
            :class="{
                active: currentLag === 'jp'
            }"
            @click="currentLag = 'jp'"
        >
          <i-flagpack-jp />
        </button>
      </div>
    </setting-block>

    <setting-block
        title="Giao Diện"
        decription="Dùng chế độ auto để tự động chuyển theo hệ thống."
    >
      <div class="langs flex items-center">
        <button class="w-8 h-8 bg-slate-900 rounded-full flex justify-center items-center text-white active">
          <i-fluent-dark-theme-20-filled />
        </button>

        <button class="w-8 h-8 bg-slate-900 rounded-full text-white flex justify-center items-center text-[18px] ml-3">
          <i-material-symbols-dark-mode />
        </button>

        <button class="w-7 h-7 bg-white rounded-full ml-3 flex justify-center items-center text-slate-900">
          <i-material-symbols-wb-sunny />
        </button>
      </div>
    </setting-block>

  </div>
</template>

<script lang="ts" setup>

const currentLag = ref('vi')
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
