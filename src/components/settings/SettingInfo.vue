<template>
  <div>

    <setting-block
        title="Application"
        decription="Là một ứng dụng mã nguồn mở. Được tạo ra bởi một thực tập sinh."
    >

      <div class="mt-3 flex">
        <div class="w-[60px] flex-shrink-0">
          <img class="w-full h-auto" src="/svg/logo.svg" alt="" />
        </div>

        <div class="w-full pl-4">
          <h2 class="text-white font-medium text-[14px] mb-0">Hako - All in one</h2>
          <p class="mt-1 text-xs">{{ version }}</p>
        </div>

      </div>

    </setting-block>

    <setting-block title="Author">

      <div class="mt-3 flex">
        <div class="w-[60px] flex-shrink-0">
          <img class="w-full h-auto rounded-full" src="/images/author.jpeg" alt="" />
        </div>

        <div class="w-full pl-4">
          <h2 class="text-white font-medium text-[14px] mb-0">Yuan</h2>
          <p class="mt-1 text-xs">Just an Queer Developer</p>
        </div>

      </div>
      <div class="text-xs mt-4">
        <p class="mb-1.5">Ban đầu tôi không có ý định phát triển dự án này. Nhưng tại sao? Một người trong 1 dự án thương mại như thế này kinh thường tôi.
          Họ nói tôi không làm được, tôi không có khả năng đó.
        </p>
        <p class="mb-1.5">Đó là mấu chốt để tôi nỗ lực phát triển dự án này. Tôi chỉ muốn chứng mình là tôi làm được.</p>
        <b>I can do it by myself.</b>
      </div>

      <div class="logos mt-4">
        <button>
          <i-mdi-github />
        </button>
        <button>
          <i-logos-facebook />
        </button>
        <button>
          <i-logos-twitter />
        </button>
        <button>
          <i-fa-brands-instagram />
        </button>
        <button>
          <i-arcticons-pubg-mobile />
        </button>
      </div>

    </setting-block>

    <setting-block title="Technical">
      <div class="text-xs reset-p">
        <p>Tôi là 1 fan cứng của Vue. Tôi rất thần tượng anh <b>Evan You</b>. Yêu cũng nên...haha LMAO.</p>
        <p>Hầu hết công nghệ sử dụng trong dự án đều xoay quanh hệ sinh thái của Vue và Vite.</p>
        <p>Đây cũng là lần đầu tiên tôi tiếp xúc với Electron nên không thể tránh khỏi sai sót. Mong mọi người giúp đỡ.</p>
      </div>

      <div class="logos mt-4">
        <button>
          <i-logos-webstorm />
        </button>
        <button>
          <i-vscode-icons-file-type-vue />
        </button>
        <button>
          <i-logos-vitejs />
        </button>
        <button>
          <i-logos-electron />
        </button>
        <button>
          <i-logos-tailwindcss-icon  />
        </button>
        <button>
          <i-logos-ant-design />
        </button>
        <button>
          <i-vscode-icons-file-type-scss />
        </button>
        <button>
          <i-logos-vueuse />
        </button>
        <button>
          <i-logos-firebase />
        </button>
        <button>
          <i-logos-nodejs-icon />
        </button>
      </div>
    </setting-block>

    <setting-block title="License - MIT">
      <div class="text-xs reset-p">
        <p>Copyright (c) 2022-present, Yuan</p>
        <p>
          Permission is hereby granted, free of charge, to any person obtaining a copy
          of this software and associated documentation files (the "Software"), to deal
          in the Software without restriction, including without limitation the rights
          to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
          copies of the Software, and to permit persons to whom the Software is
          furnished to do so, subject to the following conditions:
        </p>
        <p>
          The above copyright notice and this permission notice shall be included in
          all copies or substantial portions of the Software.
        </p>
        <p>
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
          IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
          AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
          LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
          OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
          THE SOFTWARE.
        </p>
      </div>
    </setting-block>

  </div>
</template>

<script lang="ts" setup>
import {computed} from "vue";

const version = computed(() => {
  return import.meta.env.VITE_VERSION
});
</script>

<style lang="scss">
.reset-p {
  > p {
    @apply mb-1.5;
  }
}

.logos {
  display: flex;
  > button {
    @apply mr-3.5 transition hover:scale-125;
  }
}
</style>
