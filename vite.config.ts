import path from 'node:path';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import type { ConfigEnv, UserConfig } from 'vite';
import { loadEnv } from 'vite';
import { viteMockServe } from 'vite-plugin-mock';
import svgLoader from 'vite-svg-loader';

const CWD = process.cwd();

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfig => {
  const { VITE_BASE_URL, VITE_API_URL_PREFIX, VITE_API_URL } = loadEnv(mode, CWD);
  
  // 调试环境变量
  console.log('🔧 环境变量调试:');
  console.log('mode:', mode);
  console.log('VITE_API_URL_PREFIX:', VITE_API_URL_PREFIX);
  console.log('VITE_API_URL:', VITE_API_URL);
  console.log('CWD:', CWD);
  
  // 设置环境变量，确保使用代理
  process.env.VITE_IS_REQUEST_PROXY = 'false';
  
  return {
    base: VITE_BASE_URL,
    define: {
      'import.meta.env.VITE_IS_REQUEST_PROXY': JSON.stringify('false'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${path.resolve('src/style/variables.less')}";`,
          },
          math: 'strict',
          javascriptEnabled: true,
        },
      },
    },

    plugins: [
      vue(),
      vueJsx(),
      viteMockServe({
        mockPath: 'mock',
        enable: true,
      }),
      svgLoader(),
    ],

    server: {
      port: 3002,
      host: '0.0.0.0',
      proxy: {
        [VITE_API_URL_PREFIX]: {
          target: VITE_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(new RegExp(`^${VITE_API_URL_PREFIX}`), '/api'),
          configure: (proxy, options) => {
            console.log('🌐 代理配置已加载，目标服务器:', options.target);
            
            proxy.on('error', (err, req, res) => {
              console.log('❌ 代理错误:', err.message, 'URL:', req?.url);
            });
            
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('📤 代理请求:', req.method, req.url, '→', proxyReq.getHeader('host'));
            });
            
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('📥 代理响应:', proxyRes.statusCode, req.url);
            });
          },
        },
      },
    },
  };
};
