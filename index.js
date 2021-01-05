import { resolve } from 'deno-importmap'
import { join } from 'path'

export function importmapPlugin(importmap) {
  return {
    name: 'importmap',
    setup({ onResolve }) {
      onResolve({ filter: /.*/ }, async (args) => {
        console.log(resolve(args.path, importmap), args.path)
        return {
          path: join(args.resolveDir, resolve(args.path, importmap)),
        }
      })
    },
  }
}
