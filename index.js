import { resolve } from 'deno-importmap'
import { join } from 'path'

export function importmapPlugin(importmap) {
  return {
    name: 'importmap',
    setup({ onResolve }) {
      onResolve({ filter: /.*/ }, async (args) => {
        const resolvedPath = resolve(args.path, importmap)
        console.log(resolve(args.path, importmap), args.path)
        if (resolvedPath.startsWith('http')) {
          return {
            path: resolvedPath,
            external: true,
          }
        } else {
          return { path: join(args.resolveDir, resolvedPath) }
        }
      })
    },
  }
}
