import React from 'react';
import SettingsPanel from '../../components/SettingsPanel';

/**
 * SettingsRouter - Handles all /settings/* routes internally
 * 
 * Uses window.location because remote doesn't share Host's Router context.
 * 
 * Routes handled:
 * - /settings → SettingsPanel (main settings)
 * - /settings/profile → User profile settings (future)
 * - /settings/security → Security settings (future)
 */
const SettingsRouter: React.FC = () => {
    const pathname = window.location.pathname;

    const getSubPath = () => {
        const match = pathname.match(/\/settings\/?(.*)$/);
        return match ? match[1] : '';
    };

    const subPath = getSubPath();

    if (subPath && subPath !== '') {
        return <div>Settings Section: {subPath} (Coming Soon)</div>;
    }

    return <SettingsPanel />;
};

export default SettingsRouter;
