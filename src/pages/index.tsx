import React from 'react';
import { Typography, Card } from 'antd';

const { Title, Paragraph } = Typography;

const IndexPage: React.FC = () => {
    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>Remote 3 - Distributed (UmiJS 4.x)</Title>
            <Paragraph>
                Ứng dụng này được thiết kế để triển khai phân tán (Vercel/Netlify).
            </Paragraph>

            <Card style={{ marginTop: 24 }}>
                <Title level={4}>Exposed Components:</Title>
                <ul>
                    <li><code>ReportViewer</code> - Xem và xuất báo cáo</li>
                    <li><code>SettingsPanel</code> - Cài đặt hệ thống</li>
                    <li><code>AuditLog</code> - Nhật ký hoạt động</li>
                </ul>
            </Card>

            <Card style={{ marginTop: 16 }}>
                <Title level={4}>Thông tin:</Title>
                <ul>
                    <li><strong>Framework:</strong> UmiJS 4.x (@umijs/max)</li>
                    <li><strong>Port (Dev):</strong> 3003</li>
                    <li><strong>Deployment:</strong> Vercel / Netlify</li>
                    <li><strong>Entry:</strong> /remote.js</li>
                </ul>
            </Card>
        </div>
    );
};

export default IndexPage;
