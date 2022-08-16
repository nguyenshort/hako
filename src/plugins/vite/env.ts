import { Plugin } from 'vite'
import fs from 'fs'
import shell from 'shelljs'

// let cache: string[] = []

/**
 * Cache sẽ không chạy vì server sẽ luôn restart => cache memory sẽ bị reset
 */
export default () => {
  const content: Plugin = {
    name: 'vite:env-generator',
    async buildStart() {
      if(process.env.NODE_ENV === 'production') {
        return
      }

      const envContent = fs.readFileSync('.env', 'utf8')

      if(envContent) {
        const lines: string[] = envContent.split('\n').map(line => line.trim())

        // List env keys
        // const _keys = lines.filter(line => /^\w*=/.test(line)).map(line => line.split('=')[0])
        // // check cache
        // if(_keys.length === cache.length && _keys.every(key => cache.includes(key))) {
        //   // Không có gì thay đổi
        //   return
        // }
        // Update cache
        // cache = _keys

        let template = `
/**
 * @description Auto created by src/plugins/vite/env.ts 
 * @author: Yuan
 * @link https://github.com/nguyenshort
 * DON'T EDIT IT MANUALLY
 */
interface ImportMetaEnv {
`.trim()
        lines.forEach(line => {

          if(/^\w*=/.test(line)) {
            template += `\n  readonly ${line.split('=')[0]}: string`
          } else if (/^#/.test(line)) {
            // Dòng comment
            template += `\n  // ${line.replace(/^#/, '').trim()}`
            // template += `\n  // ${line}`
          } else {
            template += `\n`
          }
        })

        template += '\n}\n'
        template += `
interface ImportMeta {
  readonly env: ImportMetaEnv
}
`.trim()
        fs.writeFileSync('./types/env.d.ts', template)
      }
    },
    /**
     * Cập nhật env.example
     */
    async buildEnd() {
      if(process.env.NODE_ENV === 'production') {
        return
      }
      await shell.exec('npm run build:env')
    }
  }

  return content
}
