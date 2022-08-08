<template>
  <div id="spotlight" class="min-h-screen relative flex justify-center">

    <div id="searchbox" class="max-w-[650px] w-full px-7 mt-[30vh]">

      <div
          class="rounded-md w-full relative"
      >
        <form class="flex items-center px-4 line-border">

          <svg width="20" height="20" viewBox="0 0 20 20"><path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>

          <input
              v-model="keyword"
              type="text"
              class="w-full bg-transparent focus:outline-0 placeholder-slate-500 pl-4 pr-3 h-14"
              placeholder="Tìm kiếm..."
          />

          <button class="bg-gray-700 rounded-md" type="reset" aria-label="Cancel">Cancel</button>

        </form>

        <div
            v-if="!keyword"
            class="flex flex-wrap pt-5 pb-2"
        >
          <div
              v-for="item in workspaceStore.shortcuts"
              :key="item._id"
              class="w-[110px] flex flex-col items-center justify-center relative z-10 mb-4"
          >
            <div class="h-[60px] flex items-center justify-center relative z-10">
              <img
                  :src="item.icon"
                  alt=""
                  class="w-[40px] max-h-[40px] h-auto logo"
              />
            </div>

            <div class="flex items-center relative z-10">
              <p class="text-xs font-medium">
                {{ item.name }}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script lang="ts" setup>

import {useWorkspaceStore} from "@store/workspace";
import {ref} from "vue";

const workspaceStore = useWorkspaceStore()

const keyword = ref('')

</script>

<style lang="scss" scoped>
#spotlight {
  background-color: rgb(15 23 42/.8);
  #searchbox {
    > div {
      background: #1e293b;
      box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 5%);
      backdrop-filter: blur(4px);
    }

    form {
      button[type="reset"] {
        padding: 0.25rem 0.375rem;
        font-size: 0;
        width: 1.75rem;
        height: 1.5rem;
        background-size: 57.1428571429% auto;
        background-position: 50%;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml,%3Csvg width='16' height='7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M.506 6h3.931V4.986H1.736v-1.39h2.488V2.583H1.736V1.196h2.69V.182H.506V6ZM8.56 1.855h1.18C9.721.818 8.87.102 7.574.102c-1.276 0-2.21.705-2.205 1.762-.003.858.602 1.35 1.585 1.585l.634.159c.633.153.986.335.988.727-.002.426-.406.716-1.03.716-.64 0-1.1-.295-1.14-.878h-1.19c.03 1.259.931 1.91 2.343 1.91 1.42 0 2.256-.68 2.259-1.745-.003-.969-.733-1.483-1.744-1.71l-.523-.125c-.506-.117-.93-.304-.92-.722 0-.375.332-.65.934-.65.588 0 .949.267.994.724ZM15.78 2.219C15.618.875 14.6.102 13.254.102c-1.537 0-2.71 1.086-2.71 2.989 0 1.898 1.153 2.989 2.71 2.989 1.492 0 2.392-.992 2.526-2.063l-1.244-.006c-.117.623-.606.98-1.262.98-.883 0-1.483-.656-1.483-1.9 0-1.21.591-1.9 1.492-1.9.673 0 1.159.389 1.253 1.028h1.244Z' fill='%2394a3b8'/%3E%3C/svg%3E");
      }
    }

  }
}

.line-border {
  @apply border-b border-gray-700
}
</style>
