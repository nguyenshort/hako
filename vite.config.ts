import {defineConfig, loadEnv, UserConfig} from 'vite'
import { rmSync } from 'fs'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import path, {join} from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import Inspect from 'vite-plugin-inspect'


// @ts-ignore
import EnvGenerator from './src/plugins/vite/env'
import electron from "vite-plugin-electron";
import {AntDesignVueResolver} from "unplugin-vue-components/resolvers";

rmSync('dist', { recursive: true, force: true }) // v14.14.0

// @ts-ignore
export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  const env = loadEnv(mode, process.cwd(), '')
  /**
   * @link https://vitejs.dev/config/
   */
  return defineConfig({
    build: {
      sourcemap: true,
    },
    plugins: [
      vue(),
      electron({
        main: {
          entry: 'electron/main/index.ts',
          vite: withDebug({
            resolve: {
              alias: {
                '@shared': join(__dirname, './shared')
              }
            },
            build: {
              outDir: 'dist/electron/main',
            },
            plugins: [
              tsconfigPaths({
                loose: true
              })
            ]
          }),
        },
        preload: {
          // input: {
          //   // You can configure multiple preload here
          //   index: join(__dirname, 'electron/preload/index.ts'),
          //   universal: join(__dirname, 'electron/preload/universal.ts'),
          //   app: join(__dirname, 'electron/preload/universal.ts'),
          // },
          input: [
            join(__dirname, 'electron/preload/index.ts')
          ],
          vite: {
            build: {
              // For Debug
              sourcemap: 'inline',
              outDir: 'dist/electron/preload',
            },
          },
        },
        // Enables use of Node.js API in the Renderer-process
        renderer: {},
      }),
      AutoImport({
        imports: [
          '@vueuse/core',
          'vue',
          'vue-router',
          {
            '@vue/apollo-composable': [
              'useSubscription'
            ]
          }
        ],
        include: [
          /\.[tj]sx?$/,
          /\.vue$/, /\.vue\?vue/,
          /\.md$/
        ],
        dirs: [
          'src/**/composable/*', // blob pattern
          'src/**/store',
          'src/**/dto',
        ],
        dts: path.resolve(__dirname, 'types/auto-imports.d.ts'),
        eslintrc: {
          enabled: true,
          globalsPropValue: true
        },
      }),
      Components({
        resolvers: [
          IconsResolver({
            prefix: 'i'
          }),
          AntDesignVueResolver({
            importStyle: 'less'
          }),
          (componentName) => {
            // where `componentName` is always CapitalCase
            if (componentName.toLowerCase() === 'draggable')
              return { name: 'default', from: 'vuedraggable' }
          },
        ],
        dts: path.resolve(__dirname, 'types/components.d.ts')
      }),
      Icons({
        autoInstall: true
      }),
      tsconfigPaths({
        loose: true
      }),
      Inspect({}),
      EnvGenerator()
    ],
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            'primary-color': '#3b66f5',
            'border-radius-base': '6px',
            'font-family':
                'Nunito Sans, SF Pro Text, SF Pro Icons, Roboto, Helvetica Neue, Helvetica, Arial, sans-serif'
          },
          javascriptEnabled: true
        }
      }
    },
    preview: {
      port: Number(env.VITE_PORT) || 3000,
    },
    server: {
      port: Number(env.VITE_PORT) || 3000,
      proxy: {
        '/bunny': {
          // @ts-ignore
          target: 'https://sg.storage.bunnycdn.com/smileeyev2/',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/bunny/, '')
        },
        '/smileeye': {
          // @ts-ignore
          target: 'https://v2-be.smileeye.edu.vn/',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/smileeye/, '')
        }
      },
    }
  })
}


function withDebug(config: UserConfig): UserConfig {
  if (process.env.VSCODE_DEBUG) {
    if (!config.build) config.build = {}
    config.build.sourcemap = true
    config.plugins = (config.plugins || []).concat({
      name: 'electron-vite-debug',
      configResolved(config) {
        const index = config.plugins.findIndex(p => p.name === 'electron-main-watcher');
        // At present, Vite can only modify plugins in configResolved hook.
        (config.plugins as Plugin[]).splice(index, 1)
      },
    })
  }
  return config
}
