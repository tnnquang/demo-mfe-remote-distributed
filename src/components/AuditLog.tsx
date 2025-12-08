import React, { useState } from 'react';
import { Table, Input, Select, DatePicker, Tag, Space, Button, Card, Typography, Row, Col, Statistic, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    SearchOutlined,
    FilterOutlined,
    ExportOutlined,
    UserOutlined,
    EditOutlined,
    DeleteOutlined,
    LoginOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import type { AuditLog as AuditLogType } from '@shared/types';
import { formatDateTime } from '@shared/utils';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Mock audit log data
const mockAuditLogs: AuditLogType[] = [
    { id: '1', action: 'LOGIN', resource: 'auth', resourceId: '-', userId: '1', userName: 'Admin User', timestamp: '2024-12-08T10:30:00', details: { ip: '192.168.1.100', browser: 'Chrome' }, ipAddress: '192.168.1.100' },
    { id: '2', action: 'UPDATE', resource: 'product', resourceId: '123', userId: '2', userName: 'Manager User', timestamp: '2024-12-08T09:45:00', details: { field: 'price', oldValue: 1000000, newValue: 1200000 }, ipAddress: '192.168.1.105' },
    { id: '3', action: 'CREATE', resource: 'user', resourceId: '156', userId: '1', userName: 'Admin User', timestamp: '2024-12-08T09:20:00', details: { email: 'newuser@test.com' }, ipAddress: '192.168.1.100' },
    { id: '4', action: 'DELETE', resource: 'product', resourceId: '89', userId: '1', userName: 'Admin User', timestamp: '2024-12-07T16:30:00', details: { name: 'Old Product' }, ipAddress: '192.168.1.100' },
    { id: '5', action: 'VIEW', resource: 'report', resourceId: 'sales-2024-11', userId: '2', userName: 'Manager User', timestamp: '2024-12-07T15:00:00', details: {}, ipAddress: '192.168.1.105' },
    { id: '6', action: 'EXPORT', resource: 'report', resourceId: 'inventory-q4', userId: '2', userName: 'Manager User', timestamp: '2024-12-07T14:30:00', details: { format: 'xlsx' }, ipAddress: '192.168.1.105' },
    { id: '7', action: 'UPDATE', resource: 'settings', resourceId: 'security', userId: '1', userName: 'Admin User', timestamp: '2024-12-07T11:00:00', details: { sessionTimeout: 30 }, ipAddress: '192.168.1.100' },
    { id: '8', action: 'LOGIN_FAILED', resource: 'auth', resourceId: '-', userId: '-', userName: 'unknown@test.com', timestamp: '2024-12-07T10:45:00', details: { reason: 'Invalid password' }, ipAddress: '10.0.0.50' },
];

const AuditLog: React.FC = () => {
    const [logs] = useState<AuditLogType[]>(mockAuditLogs);
    const [searchText, setSearchText] = useState('');
    const [selectedAction, setSelectedAction] = useState<string | undefined>();

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.userName.toLowerCase().includes(searchText.toLowerCase()) ||
            log.resource.toLowerCase().includes(searchText.toLowerCase());
        const matchesAction = !selectedAction || log.action === selectedAction;
        return matchesSearch && matchesAction;
    });

    const getActionConfig = (action: string) => {
        const configs: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
            LOGIN: { color: 'green', icon: <LoginOutlined />, label: 'Đăng nhập' },
            LOGIN_FAILED: { color: 'red', icon: <LoginOutlined />, label: 'Đăng nhập thất bại' },
            CREATE: { color: 'blue', icon: <EditOutlined />, label: 'Tạo mới' },
            UPDATE: { color: 'orange', icon: <EditOutlined />, label: 'Cập nhật' },
            DELETE: { color: 'red', icon: <DeleteOutlined />, label: 'Xóa' },
            VIEW: { color: 'default', icon: <EyeOutlined />, label: 'Xem' },
            EXPORT: { color: 'purple', icon: <ExportOutlined />, label: 'Xuất dữ liệu' },
        };
        return configs[action] || { color: 'default', icon: null, label: action };
    };

    const columns: ColumnsType<AuditLogType> = [
        {
            title: 'Thời gian',
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: 180,
            render: (timestamp: string) => formatDateTime(timestamp),
            sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
            defaultSortOrder: 'descend',
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            width: 160,
            render: (action: string) => {
                const config = getActionConfig(action);
                return (
                    <Tag color={config.color} icon={config.icon}>
                        {config.label}
                    </Tag>
                );
            },
        },
        {
            title: 'Người thực hiện',
            key: 'user',
            width: 180,
            render: (_, record) => (
                <Space>
                    <UserOutlined />
                    <span>{record.userName}</span>
                </Space>
            ),
        },
        {
            title: 'Tài nguyên',
            key: 'resource',
            render: (_, record) => (
                <div>
                    <Text strong style={{ textTransform: 'capitalize' }}>{record.resource}</Text>
                    {record.resourceId !== '-' && (
                        <Text type="secondary" style={{ marginLeft: 8 }}>#{record.resourceId}</Text>
                    )}
                </div>
            ),
        },
        {
            title: 'Chi tiết',
            key: 'details',
            render: (_, record) => (
                <Tooltip title={JSON.stringify(record.details, null, 2)}>
                    <Text type="secondary" ellipsis style={{ maxWidth: 200 }}>
                        {Object.keys(record.details).length > 0
                            ? JSON.stringify(record.details).substring(0, 50) + '...'
                            : '-'}
                    </Text>
                </Tooltip>
            ),
        },
        {
            title: 'IP',
            dataIndex: 'ipAddress',
            key: 'ipAddress',
            width: 130,
        },
    ];

    const successLogins = logs.filter(l => l.action === 'LOGIN').length;
    const failedLogins = logs.filter(l => l.action === 'LOGIN_FAILED').length;
    const criticalActions = logs.filter(l => ['DELETE', 'UPDATE'].includes(l.action) && l.resource === 'settings').length;

    return (
        <div>
            {/* Stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic title="Tổng hoạt động" value={logs.length} valueStyle={{ color: '#1890ff' }} />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Đăng nhập thành công / thất bại"
                            value={successLogins}
                            suffix={`/ ${failedLogins}`}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Thay đổi quan trọng"
                            value={criticalActions}
                            valueStyle={{ color: criticalActions > 0 ? '#faad14' : '#52c41a' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters */}
            <Card style={{ marginBottom: 16 }}>
                <Space wrap>
                    <Input
                        placeholder="Tìm kiếm..."
                        prefix={<SearchOutlined />}
                        style={{ width: 250 }}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                    />
                    <Select
                        placeholder="Loại hành động"
                        style={{ width: 180 }}
                        allowClear
                        value={selectedAction}
                        onChange={setSelectedAction}
                        options={[
                            { label: 'Đăng nhập', value: 'LOGIN' },
                            { label: 'Đăng nhập thất bại', value: 'LOGIN_FAILED' },
                            { label: 'Tạo mới', value: 'CREATE' },
                            { label: 'Cập nhật', value: 'UPDATE' },
                            { label: 'Xóa', value: 'DELETE' },
                            { label: 'Xem', value: 'VIEW' },
                            { label: 'Xuất', value: 'EXPORT' },
                        ]}
                    />
                    <RangePicker />
                    <Button icon={<ExportOutlined />}>Xuất log</Button>
                </Space>
            </Card>

            {/* Table */}
            <Table
                columns={columns}
                dataSource={filteredLogs}
                rowKey="id"
                pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} bản ghi` }}
            />
        </div>
    );
};

export default AuditLog;
