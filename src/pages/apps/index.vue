<template>
  <div id="my-apps" class="bg-white dark:bg-slate-900 min-h-screen px-4 py-5 flex flex-col h-full">
    <page-title
        title="Ứng Dụng Của Tôi"
        class="pb-7"
    >
      <button
          class="_page-title-btn text-white flex items-center uppercase transition duration-300 ease-in-out"
          :class="{
            'bg-rose-600': !editEnabled,
            'bg-primary-600': editEnabled
          }"
          @click="editEnabled = !editEnabled"
      >
        {{ !editEnabled ? 'Chỉnh Sửa' : 'Lưu Lại' }}
      </button>
    </page-title>

    <draggable
        id="apps"
        ref="actionsRef"
        v-model="apps"
        group="people"
        item-key="_id"
        class="flex flex-wrap overflow-y-auto scrollbar-hide"
        :class="{
          _edit: editEnabled
        }"
        @start="drag=true"
        @end="drag=false"
        @change="onChangeOrder"
    >
      <template #item="{element}">
        <div
            class="w-[110px] app-item"
            :data-id="element._id"
            @contextmenu.prevent="showWsOptions(element)"
        >

          <div class="relative _body">
            <div class="h-[60px] flex items-center justify-center relative z-10">
              <img
                  :src="element.icon"
                  alt=""
                  class="w-[45px] max-h-[45px] h-auto logo"
              />
            </div>

            <div class="flex items-center mt-1.5 relative z-10">
              <p class="text-xs font-medium">
                {{ element.name }}
              </p>
            </div>

            <button
                v-if="editEnabled"
                class="absolute top-0 right-0 z-20 text-white bg-rose-600 rounded-full transition hover:scale-125"
                @click="removeApp(element)"
            >
              <svg
                  width="15px"
                  height="15px"
                  xmlns="http://www.w3.org/2000/svg"
                  class="fill-current"
                  viewBox="0 0 512 512"
              >
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/>
              </svg>
            </button>
          </div>

        </div>
      </template>
    </draggable>

    <div class="mt-auto flex items-center justify-between">
      <p class="text-xs">Kéo thay để thay đổi thứ tự ứng dụng</p>
      <p class="text-xs">© Hako Inc</p>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {AppDocument} from "@entities/app.entity"
import {UpdateAppsOrderInput} from "@dtos/app.dto";

const drag = ref(false)

const appBridge = useAppBridge()
const anime = useAnime()

const apps = ref<AppDocument[]>([])
const getApps = async () => {
  apps.value = await appBridge.getMyApps()
}
onMounted(() => getApps())

const showWsOptions = (shortcut: AppDocument) => {
  appBridge.openAppContext(shortcut._id)
}

onMounted(()=> {
  appBridge.addEventListener('apps:change', (_apps: AppDocument[]) => {
    apps.value = _apps
  })
})

const onChangeOrder = () => {

  const _apps: UpdateAppsOrderInput = apps.value.map((app, index) => {
    return {
      _id: app._id,
      order: index
    }
  })

  appBridge.reAppOrder(_apps)
}

const editEnabled = ref(false)

const removeApp = (app: AppDocument) => {
  const el = document.querySelector(`[data-id="${app._id}"]`) as HTMLElement
  // remove defalt animation
  el.classList.remove('transition')
  anime({
    targets: el,
    opacity: 0,
    width: 0,
    height: 0
  })
  anime({
    targets: el.querySelector('._body'),
    opacity: 0,
    scale: 0,
    complete: async () => {
      apps.value = apps.value.filter(a => a._id !== app._id)
      await appBridge.removeApp(app._id)
    }
  })
}

onMounted(() => nextTick(() => {
  appBridge.addEventListener('focused:change', (views: string[]) => {
    editEnabled.value = false
  })
}))

</script>

<style scoped>
.app-item {
  @apply aspect-1 overflow-hidden flex flex-col justify-center items-center cursor-pointer mb-2 relative
}

#apps._edit .app-item {
  animation: shake 1s;
  animation-iteration-count: infinite;
}

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}
</style>
