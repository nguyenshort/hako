<template>
  <div>
    <div class="text-[13px]">
      Mặc dù giấy phép là không bắt buộc. Bạn vẫn có thể tiếp tục sử dụng Hako miễn phí mà không gặp bất kì hạn chế nào.
      Giấy phép chỉ giúp bạn có thể truy cập sớm vào các ứng dụng của Hako. Và hơn hết là ủng hộ tôi tiếp tục bảo trì và phát triển ứng dụng.
    </div>
    <form v-if="!userStore.user?.isActive" class="mt-4" @submit.prevent="onSubmit">
      <input
          v-model="license"
          type="text"
          placeholder="Enter your license key"
          class="w-full px-3.5 py-3 bg-gray-900 rounded-lg text-sm"
      />

      <div class="w-full flex justify-end mt-4">
        <a-button
            type="primary"
            :loading="loading"
            html-type="submit"
            class="transition"
            :class="{
              'opacity-50': !license
            }"
        >
          Submit
        </a-button>
      </div>
    </form>

    <div v-else class="mt-3">
      <div class="flex items-center">
        <i-fxemoji-partypopper />
        <span class="text-[13px] ml-2">Cảm ơn sự đóng góp bạn.</span>
      </div>
      <input
          :value="userStore.user?.license"
          readonly
          type="text"
          placeholder="Enter your license key"
          class="w-full px-3.5 py-3 bg-gray-900 rounded-lg text-sm mt-3"
      />

      <div class="w-full flex justify-end mt-4">
        <a-button
            type="danger"
            :loading="loadingRemove"
            @click="onRemove"
        >
          Remove
        </a-button>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import party from "party-js"

const el = useCurrentElement()
const userStore = useUserStore()
const appBridge = useAppBridge()

const loading = ref<boolean>(false)
const license = ref('')

const checkLicense = async (): Promise<boolean> => {
  party.confetti(el.value as any, {
    count: party.variation.range(20, 40),
  });
  // Todo: check license
  return true
}

const onSubmit = async () => {
  if(!userStore.user) {
    return
  }

  loading.value = true
  const isValid = await checkLicense()

  if(isValid) {
    userStore.user.license = license.value
    userStore.user.isActive = true
    await appBridge.updateUser({ license: license.value, isActive: true })
  }

  loading.value = false
}

const loadingRemove = ref<boolean>(false)
const onRemove = () => {
  if(!userStore.user) {
    return
  }
  loadingRemove.value = true
  license.value = ''

  userStore.user.license = ''
  userStore.user.isActive = false
  appBridge.updateUser({ license: '', isActive: false })

  loadingRemove.value = false
}
</script>

