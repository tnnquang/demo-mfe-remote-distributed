import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import from exposes folder (UmiJS structure)
import ReportViewer from '../ReportViewer';
import ReportBuilder from '../ReportBuilder';
import SettingsPanel from '../SettingsPanel';
import AuditLog from '../AuditLog';
import CommunicationDemo from '../CommunicationDemo';

interface AppProps {
    basename?: string;
}

/**
 * Remote3 App - Single entry point with internal routing
 * 
 * Can be mounted at different basenames:
 * - /reports -> shows ReportViewer at root
 * - /settings -> shows SettingsPanel at root
 * - /audit -> shows AuditLog at root
 */
const App: React.FC<AppProps> = ({ basename = '/reports' }) => {
    // Determine default component based on basename
    const getDefaultComponent = () => {
        if (basename.includes('settings')) return SettingsPanel;
        if (basename.includes('audit')) return AuditLog;
        return ReportViewer;
    };

    const DefaultComponent = getDefaultComponent();

    return (
        <BrowserRouter basename={basename}>
            <Routes>
                {/* Root - shows default based on basename */}
                <Route path="/" element={<DefaultComponent />} />

                {/* Reports routes */}
                <Route path="/new" element={<ReportBuilder />} />
                <Route path="/detail/:id" element={<div>Detail (Coming Soon)</div>} />

                {/* Sub-section routes */}
                <Route path="/:section" element={<div>Section (Coming Soon)</div>} />

                {/* Demo */}
                <Route path="/demo" element={<CommunicationDemo />} />

                {/* Fallback */}
                <Route path="*" element={<DefaultComponent />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
