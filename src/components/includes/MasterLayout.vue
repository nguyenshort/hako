<template>
  <div id="hako" class="antialiased text-slate-500 dark:text-slate-400">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import {BasicColorSchema} from "@vueuse/core";
import {UserDocument} from "@entities/user.entity";

const color = useColorMode()

const appBridge = useAppBridge()
const userStore = useUserStore()

const getUser = async () => {
  const user = await appBridge.getUser()
  userStore.setUser(user)
}
await getUser()

watch(() => userStore.user, () => {
  if(userStore.user) {
    color.value = userStore.user.theme as BasicColorSchema
  }
}, { immediate: true, deep: true })

onMounted(() => nextTick(() => {
  appBridge.addEventListener('user:change', (user: UserDocument) => {
    userStore.setUser(user)
  })
}))
</script>

<style scoped></style>
