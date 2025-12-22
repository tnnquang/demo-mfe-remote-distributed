import React from 'react';
import ReportViewer from '../../components/ReportViewer';

/**
 * ReportRouter - Handles all /reports/* routes internally
 * 
 * Uses window.location because remote doesn't share Host's Router context.
 * 
 * Routes handled:
 * - /reports → ReportViewer (list view)
 * - /reports/new → ReportBuilder (future)
 * - /reports/:id → View specific report (future)
 */
const ReportRouter: React.FC = () => {
    const pathname = window.location.pathname;

    const getSubPath = () => {
        const match = pathname.match(/\/reports\/?(.*)$/);
        return match ? match[1] : '';
    };

    const subPath = getSubPath();

    if (subPath === 'new') {
        return <div>Create New Report (Coming Soon)</div>;
    }

    if (subPath && subPath !== '') {
        return <div>Report Detail: {subPath} (Coming Soon)</div>;
    }

    return <ReportViewer />;
};

export default ReportRouter;
