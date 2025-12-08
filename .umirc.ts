import { defineConfig } from '@umijs/max';
import path from 'path';

export default defineConfig({
    antd: {},
    model: {},
    mfsu: false, // Disable MFSU to prevent conflict with Module Federation

    // Alias for @shared
    alias: {
        '@shared': path.resolve(__dirname, './shared'),
    },

    // Remote Module Federation Configuration for Distributed Deployment
    mf: {
        name: 'remote3',
        library: { type: 'var', name: 'remote3' },
        exposes: {
            './ReportViewer': './src/components/ReportViewer',
            './SettingsPanel': './src/components/SettingsPanel',
            './AuditLog': './src/components/AuditLog',
            './ReportBuilder': './src/components/ReportBuilder',
            './CommunicationDemo': './src/components/CommunicationDemo',
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
    hash: true,
    publicPath: '/',
});
