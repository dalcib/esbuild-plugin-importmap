import esbuild from 'esbuild'
import { importmapPlugin } from './index.js'
import { resolve } from 'path'

const importmap = {
  imports: {
    react: './web_modules/react.js',
    'bar/': './web_modules/',
    'react-dom': 'https://cdn.skypack.dev/react-dom@17.0.1',
  },
}

async function test() {
  const result = await esbuild
    .build({
      stdin: {
        contents: `
        import ReactDom from 'react-dom'
        import React from 'react'
        import 'bar/index.js'
        console.log(React.version)`,
        resolveDir: resolve('.'),
      },
      bundle: true,
      plugins: [importmapPlugin(importmap)],
      write: false,
      format: 'esm',
    })
    .catch(() => process.exit(1))

  console.log(result.outputFiles[0].text)
  if (
    result.outputFiles[0].text ===
    `// <stdin>
import ReactDom from "https://cdn.skypack.dev/react-dom@17.0.1";

// web_modules/react.js
var react_default = {version: "17.0.1"};

// web_modules/index.js
console.log("bar");

// <stdin>
console.log(react_default.version);
`
  ) {
    console.log('✅')
  } else {
    console.error('❌')
  }
}

test()
