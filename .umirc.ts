import { defineConfig } from '@umijs/max';
import path from 'path';

export default defineConfig({
    antd: {},
    model: {},
    // MFSU must be disabled for Remotes to avoid conflict with Module Federation
    mfsu: false,

    // Alias for @shared
    alias: {
        '@shared': path.resolve(__dirname, './shared'),
    },

    // Remote Module Federation Configuration for Distributed Deployment
    mf: {
        name: 'remote3',
        library: { type: 'var', name: 'remote3' },
        // UmiJS 4.x requires exposes to point to folder with index.tsx
        exposes: {
            './ReportRouter': './src/exposes/ReportRouter',    // Router for /reports/*
            './SettingsRouter': './src/exposes/SettingsRouter', // Router for /settings/*
            './AuditRouter': './src/exposes/AuditRouter',       // Router for /audit/*
            './ReportViewer': './src/exposes/ReportViewer',
            './SettingsPanel': './src/exposes/SettingsPanel',
            './AuditLog': './src/exposes/AuditLog',
            './ReportBuilder': './src/exposes/ReportBuilder',
            './CommunicationDemo': './src/exposes/CommunicationDemo',
        },
        shared: {
            react: { singleton: true },
            'react-dom': { singleton: true },
            antd: { singleton: true },
            zustand: { singleton: true },
        },
    },

    routes: [
        { path: '/', component: './index' },
        { path: '/reports', component: './reports' },
        { path: '/reports/new', component: './reports/new' },
        { path: '/settings', component: './settings' },
        { path: '/audit', component: './audit' },
        { path: '/demo', component: './demo' },
    ],

    npmClient: 'yarn',

    // Build output for static hosting (Vercel/Netlify)
    esbuildMinifyIIFE: true, // Fix esbuild helper conflicts
    hash: true,
    publicPath: '/',
});
