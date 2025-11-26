import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'config/index': 'src/config/index.ts',
    'logging/index': 'src/logging/index.ts',
    'http/index': 'src/http/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  external: ['@nestjs/common', '@nestjs/core', 'rxjs', 'reflect-metadata'],
});
