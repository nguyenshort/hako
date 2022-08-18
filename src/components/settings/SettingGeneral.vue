<template>
  <div>
    <setting-block title="Ngôn Ngữ">
      <div class="langs">
        <button
            class="text-[20px]"
            :class="{
                active: userStore.user?.language === 'vi'
            }"
            @click="changeValue( 'language', 'vi')"
        >
          <i-flagpack-vn />
        </button>
        <button
            class="text-[20px]"
            :class="{
                active: userStore.user?.language === 'en'
            }"
            @click="changeValue('language', 'en')"
        >
          <i-flagpack-us />
        </button>
        <button
            class="text-[20px]"
            :class="{
                active: userStore.user?.language === 'jp'
            }"
            @click="changeValue('language', 'jp')"
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
            @click="changeValue('theme', 'auto')"
        >
          <i-fluent-dark-theme-20-filled />
        </button>

        <button
            class="w-8 h-8 bg-slate-900 rounded-full text-white flex justify-center items-center text-[18px] ml-3"
            :class="{
                active: userStore.user?.theme === 'dark'
            }"
            @click="changeValue('theme', 'dark')"
        >
          <i-material-symbols-dark-mode />
        </button>

        <button
            class="w-7 h-7 bg-white rounded-full ml-3 flex justify-center items-center text-slate-900"
            :class="{
                active: userStore.user?.theme === 'light'
            }"
            @click="changeValue('theme', 'light')"
        >
          <i-material-symbols-wb-sunny />
        </button>
      </div>
    </setting-block>

    <setting-block
        title="Tải lười biếng"
        decription="Tải lười biếng các tài khoản của bạn (không tự động load tất cả các tài khoản khi ở ứng dụng)."
    >
      <div>
        <a-switch
            :checked="userStore.user?.lazyApp"
            class="focus:outline-0"
            @click="changeValue('lazyApp', !userStore.user?.lazyApp)"
        />
      </div>
    </setting-block>

    <setting-block
        title="Đóng băng tự động"
        decription="
          Tự động gỡ tải khoản khi ứng dụng không được sử dụng.
          Theo mặc định ứng dụng sẽ giữ tất cả các tài khoản đang được sử dụng trên stack.
          Nếu máy bạn không đủ mạnh, hãy huỷ bỏ tuỳ chọn này.
        "
    >
      <div>
        <a-switch
            :checked="userStore.user?.autoFreeze"
            class="focus:outline-0"
            @click="changeValue('autoFreeze', !userStore.user?.autoFreeze)"
        />
      </div>
    </setting-block>

    <setting-block
        title="Khởi động"
        decription="Tự động mở ứng dụng khi bật máy."
    >
      <div>
        <a-switch
            :checked="userStore.user?.autoStart"
            class="focus:outline-0"
            @click="changeValue('autoStart', !userStore.user?.autoStart)"
        />
      </div>
    </setting-block>
  </div>
</template>

<script lang="ts" setup>
import {UserDocument} from "@entities/user.entity";

const userStore = useUserStore()
const appBridge = useAppBridge()

const changeValue = async (key: keyof Omit<UserDocument, '_id'>, value: any) => {
  if(!userStore.user) {
    return
  }
  userStore.user[key] = value
  await appBridge.updateUser({[key]: value})
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
