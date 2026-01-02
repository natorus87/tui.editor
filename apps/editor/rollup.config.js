import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import fs from 'fs';
import banner from 'rollup-plugin-banner';
import { version, author, license } from './package.json';

function i18nEditorImportPath() {
  return {
    name: 'i18nEditorImportPath',
    transform(code) {
      return code.replace('../editorCore', '@licium/editor');
    },
  };
}

const fileNames = fs.readdirSync('./src/i18n');

function createBannerPlugin(type) {
  return banner(
    [
      `@licium/editor${type ? ` : ${type}` : ''}`,
      `@version ${version} | ${new Date().toDateString()}`,
      `@author ${author}`,
      `@license ${license}`,
    ].join('\n')
  );
}

function moveDeclarationFiles() {
  return {
    name: 'moveDeclarationFiles',
    writeBundle() {
      const srcDir = 'dist/esm/i18n/i18n';
      const destDir = 'dist/esm/i18n';

      if (fs.existsSync(srcDir)) {
        fs.readdirSync(srcDir).forEach((file) => {
          if (file.endsWith('.d.ts')) {
            fs.renameSync(`${srcDir}/${file}`, `${destDir}/${file}`);
          }
        });
        fs.rmdirSync(srcDir);
      }
    },
  };
}

export default [
  // editor
  {
    input: 'src/esm/index.ts',
    output: {
      dir: 'dist/esm',
      format: 'es',
      sourcemap: false,
    },
    plugins: [
      typescript({ compilerOptions: { allowJs: false } }),
      commonjs(),
      nodeResolve(),
      createBannerPlugin(),
    ],
    external: [/^prosemirror/],
  },
  // viewer
  {
    input: 'src/esm/indexViewer.ts',
    output: {
      dir: 'dist/esm',
      format: 'es',
      sourcemap: false,
    },
    plugins: [
      typescript({ compilerOptions: { allowJs: false } }),
      commonjs(),
      nodeResolve(),
      createBannerPlugin('viewer'),
    ],
    external: [/^prosemirror/],
  },
  // i18n
  {
    input: fileNames.map((fileName) => `src/i18n/${fileName}`),
    output: {
      dir: 'dist/esm/i18n',
      format: 'es',
      sourcemap: false,
    },
    external: ['@licium/editor'],
    plugins: [
      typescript({
        compilerOptions: { allowJs: false, declaration: true, outDir: 'dist/esm/i18n' },
      }),
      commonjs(),
      nodeResolve(),
      i18nEditorImportPath(),
      createBannerPlugin('i18n'),
      moveDeclarationFiles(),
    ],
  },
];
