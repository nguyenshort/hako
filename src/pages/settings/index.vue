<template>
  <div class="_page-bg px-4 py-5">

    <page-title
        title="Cài Đặt Ứng Dụng"
        class="pb-7"
    >
      <button class="ml-auto text-sm px-4 py-0.5 rounded text-white bg-rose-600">
        Đặt Lại
      </button>
    </page-title>

    <div class="w-full h-full flex _tab-area">
      <div
          class="w-[200px] flex-shrink-0"
      >

        <ul>
          <li
              v-for="(tab, index) in tabs"
              :key="index"
              class="tab-item cursor-pointer"
              :class="{
                _active: tab.name === activeTab.name
              }"
              @click="activeTab = tab"
          >
            <div class="flex items-center py-3 transition-all transform">

              <component class="transition transform" :is="tab.icon" />
              <span class="ml-3 text-[14px] font-medium">{{ tab.name }}</span>

            </div>
          </li>
        </ul>

      </div>

      <div class="w-7 flex-shrink-0"></div>

      <div class="w-full _tab-content overflow-y-auto scrollbar-hide">
        <keep-alive>
          <transition name="fade" mode="out-in">
            <component :is="activeTab.component" />
          </transition>
        </keep-alive>
      </div>

    </div>

  </div>
</template>

<script lang="ts" setup>
import RiHeartsLine from '~icons/ri/hearts-line'
import RiListSettingsLine from '~icons/ri/list-settings-line'
import MaterialSymbolsFingerprint from '~icons/material-symbols/fingerprint'
import IonExtensionPuzzleOutline from '~icons/ion/extension-puzzle-outline'
import MaterialSymbolsInfoOutline from '~icons/material-symbols/info-outline'

import SettingLicense from '@components/settings/SettingLicense.vue'
import SettingGeneral from '@components/settings/SettingGeneral.vue'
import SettingInfo from '@components/settings/SettingInfo.vue'

const tabs = shallowRef([
  {
    name: 'Giấy Phép',
    component: SettingLicense,
    icon: RiHeartsLine
  },
  {
    name: 'Cài Đặt Chung',
    component: SettingGeneral,
    icon: RiListSettingsLine
  },
  {
    name: 'Bảo Mật',
    component: defineAsyncComponent(() => import('@components/settings/SettingLicense.vue')),
    icon: MaterialSymbolsFingerprint
  },
  {
    name: 'Tiện Ích',
    component: defineAsyncComponent(() => import('@components/settings/SettingLicense.vue')),
    icon: IonExtensionPuzzleOutline
  },
  {
    name: 'Giới Thiệu',
    component: SettingInfo,
    icon: MaterialSymbolsInfoOutline
  }
])

const activeTab = shallowRef(tabs.value[1])
</script>

<style lang="scss" scoped>
._tab-area {
  max-height: calc(100vh - 24px - 28px - 20px - 20px);
  ._tab-content {
    @apply bg-slate-800 rounded-lg px-4 py-4;
  }
}

.tab-item {
  @apply border-l-2 border-transparent rounded-br-lg rounded-tr-lg overflow-hidden;

  >div {
    @apply pl-[15px];
  }

  &._active {
    @apply border-primary-600;
    > div {
      @apply text-white bg-slate-800 pl-[25px];
      svg {
        @apply scale-110
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
