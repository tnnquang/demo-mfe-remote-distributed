import React, { useState } from 'react';
import { Card, Form, Input, Switch, Select, Button, Divider, Typography, Space, message, Tabs, InputNumber, Row, Col } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { useAuthStore } from '@shared/state';
import { Role } from '@shared/types';

const { Title, Text } = Typography;

interface Settings {
    general: {
        siteName: string;
        language: string;
        timezone: string;
        dateFormat: string;
    };
    security: {
        sessionTimeout: number;
        maxLoginAttempts: number;
        requireMfa: boolean;
        passwordExpiry: number;
    };
    notifications: {
        emailEnabled: boolean;
        smsEnabled: boolean;
        lowStockAlert: boolean;
        orderNotification: boolean;
    };
    appearance: {
        theme: 'light' | 'dark';
        primaryColor: string;
        sidebarCollapsed: boolean;
    };
}

const defaultSettings: Settings = {
    general: {
        siteName: 'MFE Demo',
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        dateFormat: 'DD/MM/YYYY',
    },
    security: {
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        requireMfa: false,
        passwordExpiry: 90,
    },
    notifications: {
        emailEnabled: true,
        smsEnabled: false,
        lowStockAlert: true,
        orderNotification: true,
    },
    appearance: {
        theme: 'light',
        primaryColor: '#1890ff',
        sidebarCollapsed: false,
    },
};

const SettingsPanel: React.FC = () => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [loading, setLoading] = useState(false);
    const { user } = useAuthStore();

    const handleSave = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        message.success('Đã lưu cài đặt');
        setLoading(false);
    };

    const handleReset = () => {
        setSettings(defaultSettings);
        message.info('Đã khôi phục cài đặt mặc định');
    };

    const isAdmin = user?.role === Role.ADMIN;

    const tabItems = [
        {
            key: 'general',
            label: 'Chung',
            children: (
                <Form layout="vertical">
                    <Form.Item label="Tên hệ thống">
                        <Input
                            value={settings.general.siteName}
                            onChange={e => setSettings({ ...settings, general: { ...settings.general, siteName: e.target.value } })}
                        />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Ngôn ngữ">
                                <Select
                                    value={settings.general.language}
                                    onChange={val => setSettings({ ...settings, general: { ...settings.general, language: val } })}
                                    options={[
                                        { label: 'Tiếng Việt', value: 'vi' },
                                        { label: 'English', value: 'en' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Múi giờ">
                                <Select
                                    value={settings.general.timezone}
                                    onChange={val => setSettings({ ...settings, general: { ...settings.general, timezone: val } })}
                                    options={[
                                        { label: 'Asia/Ho_Chi_Minh (UTC+7)', value: 'Asia/Ho_Chi_Minh' },
                                        { label: 'Asia/Bangkok (UTC+7)', value: 'Asia/Bangkok' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            ),
        },
        {
            key: 'security',
            label: 'Bảo mật',
            disabled: !isAdmin,
            children: (
                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Thời gian hết phiên (phút)">
                                <InputNumber
                                    min={5}
                                    max={120}
                                    value={settings.security.sessionTimeout}
                                    onChange={val => setSettings({ ...settings, security: { ...settings.security, sessionTimeout: val || 30 } })}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Số lần đăng nhập sai tối đa">
                                <InputNumber
                                    min={3}
                                    max={10}
                                    value={settings.security.maxLoginAttempts}
                                    onChange={val => setSettings({ ...settings, security: { ...settings.security, maxLoginAttempts: val || 5 } })}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="Yêu cầu xác thực 2 yếu tố (MFA)">
                        <Switch
                            checked={settings.security.requireMfa}
                            onChange={val => setSettings({ ...settings, security: { ...settings.security, requireMfa: val } })}
                        />
                    </Form.Item>
                    <Form.Item label="Thời hạn mật khẩu (ngày)">
                        <InputNumber
                            min={30}
                            max={365}
                            value={settings.security.passwordExpiry}
                            onChange={val => setSettings({ ...settings, security: { ...settings.security, passwordExpiry: val || 90 } })}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Form>
            ),
        },
        {
            key: 'notifications',
            label: 'Thông báo',
            children: (
                <Form layout="vertical">
                    <Form.Item label="Thông báo qua Email">
                        <Switch
                            checked={settings.notifications.emailEnabled}
                            onChange={val => setSettings({ ...settings, notifications: { ...settings.notifications, emailEnabled: val } })}
                        />
                    </Form.Item>
                    <Form.Item label="Thông báo qua SMS">
                        <Switch
                            checked={settings.notifications.smsEnabled}
                            onChange={val => setSettings({ ...settings, notifications: { ...settings.notifications, smsEnabled: val } })}
                        />
                    </Form.Item>
                    <Divider />
                    <Form.Item label="Cảnh báo hàng tồn kho thấp">
                        <Switch
                            checked={settings.notifications.lowStockAlert}
                            onChange={val => setSettings({ ...settings, notifications: { ...settings.notifications, lowStockAlert: val } })}
                        />
                    </Form.Item>
                    <Form.Item label="Thông báo đơn hàng mới">
                        <Switch
                            checked={settings.notifications.orderNotification}
                            onChange={val => setSettings({ ...settings, notifications: { ...settings.notifications, orderNotification: val } })}
                        />
                    </Form.Item>
                </Form>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Title level={4} style={{ marginBottom: 0 }}>Cài đặt hệ thống</Title>
                    <Text type="secondary">Quản lý cấu hình ứng dụng</Text>
                </div>
                <Space>
                    <Button icon={<ReloadOutlined />} onClick={handleReset}>
                        Khôi phục mặc định
                    </Button>
                    <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={loading}>
                        Lưu thay đổi
                    </Button>
                </Space>
            </div>

            <Card>
                <Tabs items={tabItems} />
            </Card>
        </div>
    );
};

export default SettingsPanel;
