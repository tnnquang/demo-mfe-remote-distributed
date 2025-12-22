import React from 'react';
import AuditLog from '../../components/AuditLog';

/**
 * AuditRouter - Handles all /audit/* routes internally
 * 
 * Uses window.location because remote doesn't share Host's Router context.
 * 
 * Routes handled:
 * - /audit → AuditLog (log viewer)
 * - /audit/:id → Specific audit entry (future)
 */
const AuditRouter: React.FC = () => {
    const pathname = window.location.pathname;

    const getSubPath = () => {
        const match = pathname.match(/\/audit\/?(.*)$/);
        return match ? match[1] : '';
    };

    const subPath = getSubPath();

    if (subPath && subPath !== '') {
        return <div>Audit Entry: {subPath} (Coming Soon)</div>;
    }

    return <AuditLog />;
};

export default AuditRouter;
