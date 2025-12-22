import React from 'react';

/**
 * Remote3App - Single entry point for Remote3
 * 
 * This component handles ALL internal routing for Remote3.
 * Host only needs to mount this at `/app3/*`
 */

// Lazy load internal components
const ReportViewer = React.lazy(() => import('../../components/ReportViewer'));
const ReportBuilder = React.lazy(() => import('../../components/ReportBuilder'));
const SettingsPanel = React.lazy(() => import('../../components/SettingsPanel'));
const AuditLog = React.lazy(() => import('../../components/AuditLog'));
const CommunicationDemo = React.lazy(() => import('../../components/CommunicationDemo'));

const LoadingFallback = () => (
    <div style={{ padding: 20, textAlign: 'center' }}>Loading...</div>
);

const Remote3App: React.FC = () => {
    const pathname = window.location.pathname;

    // Parse route - remove /app3 prefix
    const getRoute = () => {
        const basePath = pathname.replace(/^\/app3\/?/, '/');
        return basePath || '/';
    };

    const route = getRoute();

    const renderContent = () => {
        // Reports routes
        if (route.startsWith('/reports')) {
            if (route === '/reports/new') {
                return <ReportBuilder />;
            }
            if (route !== '/reports' && route !== '/reports/') {
                const reportId = route.replace('/reports/', '');
                return <div>Report Detail: {reportId} (Coming Soon)</div>;
            }
            return <ReportViewer />;
        }

        // Settings routes
        if (route.startsWith('/settings')) {
            if (route !== '/settings' && route !== '/settings/') {
                const section = route.replace('/settings/', '');
                return <div>Settings Section: {section} (Coming Soon)</div>;
            }
            return <SettingsPanel />;
        }

        // Audit routes
        if (route.startsWith('/audit')) {
            if (route !== '/audit' && route !== '/audit/') {
                const entryId = route.replace('/audit/', '');
                return <div>Audit Entry: {entryId} (Coming Soon)</div>;
            }
            return <AuditLog />;
        }

        // Communication Demo
        if (route.startsWith('/demo') || route.startsWith('/communication')) {
            return <CommunicationDemo />;
        }

        // Default: Reports
        return <ReportViewer />;
    };

    return (
        <React.Suspense fallback={<LoadingFallback />}>
            {renderContent()}
        </React.Suspense>
    );
};

export default Remote3App;
