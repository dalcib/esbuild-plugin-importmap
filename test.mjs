import esbuild from 'esbuild'
import { importmapPlugin } from './index.js'
import { resolve } from 'path'

const importmap = {
  imports: {
    react: './web_modules/react.js',
    'bar/': './web_modules/',
  },
}

async function test() {
  const result = await esbuild
    .build({
      stdin: {
        contents: `
        import React from 'react'
        import 'bar/index.js'
        console.log(React.version)`,
        resolveDir: resolve('.'),
      },
      bundle: true,
      plugins: [importmapPlugin(importmap)],
      write: false,
    })
    .catch(() => process.exit(1))

  console.log(result.outputFiles[0].text)
  if (
    result.outputFiles[0].text ===
    `(() => {
  // web_modules/react.js
  var react_default = {version: "17.0.1"};

  // web_modules/index.js
  console.log("bar");

  // <stdin>
  console.log(react_default.version);
})();
`
  ) {
    console.log('✅')
  } else {
    console.error('❌')
  }
}

test()
