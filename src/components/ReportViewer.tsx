import React, { useState } from 'react';
import { Card, Table, Select, DatePicker, Button, Space, Typography, Row, Col, Statistic, Tabs, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    DownloadOutlined,
    PrinterOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
    BarChartOutlined,
    LineChartOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import type { Report } from '@shared/types';
import { formatCurrency, formatDate } from '@shared/utils';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Mock report data
const mockReports: Report[] = [
    { id: '1', title: 'Báo cáo doanh thu tháng 11/2024', type: 'sales', generatedAt: '2024-12-01', generatedBy: 'Admin', data: { total: 1250000000, orders: 856, avgOrder: 1460000 } },
    { id: '2', title: 'Báo cáo tồn kho Q4/2024', type: 'inventory', generatedAt: '2024-12-05', generatedBy: 'Manager', data: { totalItems: 15420, lowStock: 23, value: 8500000000 } },
    { id: '3', title: 'Thống kê người dùng 2024', type: 'users', generatedAt: '2024-12-07', generatedBy: 'Admin', data: { total: 1128, active: 985, new: 156 } },
    { id: '4', title: 'Nhật ký hoạt động tháng 11', type: 'audit', generatedAt: '2024-12-02', generatedBy: 'System', data: { actions: 4520, users: 45, criticalEvents: 3 } },
];

const salesData = [
    { month: 'T1', revenue: 850000000, orders: 620 },
    { month: 'T2', revenue: 920000000, orders: 680 },
    { month: 'T3', revenue: 1050000000, orders: 750 },
    { month: 'T4', revenue: 980000000, orders: 710 },
    { month: 'T5', revenue: 1120000000, orders: 820 },
    { month: 'T6', revenue: 1080000000, orders: 790 },
    { month: 'T7', revenue: 1200000000, orders: 870 },
    { month: 'T8', revenue: 1150000000, orders: 840 },
    { month: 'T9', revenue: 1280000000, orders: 920 },
    { month: 'T10', revenue: 1350000000, orders: 980 },
    { month: 'T11', revenue: 1250000000, orders: 856 },
    { month: 'T12', revenue: 1420000000, orders: 1020 },
];

const ReportViewer: React.FC = () => {
    const [selectedReport, setSelectedReport] = useState<string>('sales');
    const [reports] = useState<Report[]>(mockReports);

    const columns: ColumnsType<Report> = [
        { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => {
                const colors: Record<string, string> = { sales: 'green', inventory: 'blue', users: 'purple', audit: 'orange' };
                const labels: Record<string, string> = { sales: 'Doanh thu', inventory: 'Kho hàng', users: 'Người dùng', audit: 'Audit' };
                return <Tag color={colors[type]}>{labels[type]}</Tag>;
            },
        },
        { title: 'Tạo bởi', dataIndex: 'generatedBy', key: 'generatedBy' },
        { title: 'Ngày tạo', dataIndex: 'generatedAt', key: 'generatedAt', render: (date: string) => formatDate(date) },
        {
            title: 'Thao tác',
            key: 'actions',
            render: () => (
                <Space>
                    <Button type="link" size="small" icon={<FileExcelOutlined />}>Excel</Button>
                    <Button type="link" size="small" icon={<FilePdfOutlined />}>PDF</Button>
                </Space>
            ),
        },
    ];

    const tabItems = [
        {
            key: 'overview',
            label: 'Tổng quan',
            children: (
                <div>
                    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                        <Col xs={24} sm={12} lg={6}>
                            <Card>
                                <Statistic
                                    title="Tổng doanh thu năm"
                                    value={13630000000}
                                    formatter={(val) => formatCurrency(Number(val))}
                                    valueStyle={{ color: '#52c41a' }}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card>
                                <Statistic title="Tổng đơn hàng" value={9856} valueStyle={{ color: '#1890ff' }} />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card>
                                <Statistic
                                    title="Giá trị đơn TB"
                                    value={1382000}
                                    formatter={(val) => formatCurrency(Number(val))}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Card>
                                <Statistic title="Tăng trưởng" value={15.2} suffix="%" valueStyle={{ color: '#52c41a' }} />
                            </Card>
                        </Col>
                    </Row>

                    <Card title="Doanh thu theo tháng">
                        <Table
                            dataSource={salesData}
                            columns={[
                                { title: 'Tháng', dataIndex: 'month', key: 'month' },
                                { title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue', render: (val: number) => formatCurrency(val) },
                                { title: 'Số đơn', dataIndex: 'orders', key: 'orders' },
                            ]}
                            rowKey="month"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </div>
            ),
        },
        {
            key: 'history',
            label: 'Lịch sử báo cáo',
            children: <Table columns={columns} dataSource={reports} rowKey="id" />,
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <Space>
                    <Select
                        value={selectedReport}
                        onChange={setSelectedReport}
                        style={{ width: 200 }}
                        options={[
                            { label: 'Báo cáo doanh thu', value: 'sales' },
                            { label: 'Báo cáo kho hàng', value: 'inventory' },
                            { label: 'Báo cáo người dùng', value: 'users' },
                        ]}
                    />
                    <RangePicker />
                </Space>
                <Space>
                    <Button icon={<DownloadOutlined />}>Xuất báo cáo</Button>
                    <Button icon={<PrinterOutlined />}>In</Button>
                </Space>
            </div>

            <Tabs items={tabItems} />
        </div>
    );
};

export default ReportViewer;
