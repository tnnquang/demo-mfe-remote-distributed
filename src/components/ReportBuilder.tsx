/**
 * Report Builder - Create custom reports with inter-app data
 */
import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, DatePicker, Button, Table, Space, Typography, Row, Col, Statistic, message, Tag, Steps, Divider } from 'antd';
import { FileTextOutlined, BarChartOutlined, LineChartOutlined, PieChartOutlined, DownloadOutlined, SendOutlined } from '@ant-design/icons';
import { useSyncStore, useSelectedUser, useSelectedProduct } from '@shared/state';
import { createEventBus, MFE_EVENTS } from '@shared/utils/eventBus';
import type { UserSelectedPayload, ProductSelectedPayload } from '@shared/types/contracts';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const eventBus = createEventBus('remote-distributed');

interface ReportConfig {
    title: string;
    type: 'sales' | 'users' | 'inventory' | 'custom';
    dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
    includeUserId?: string;
    includeProductId?: string;
    chartType: 'bar' | 'line' | 'pie';
}

const reportTypes = [
    { label: 'Sales Report', value: 'sales', icon: <BarChartOutlined /> },
    { label: 'User Activity', value: 'users', icon: <LineChartOutlined /> },
    { label: 'Inventory Status', value: 'inventory', icon: <PieChartOutlined /> },
    { label: 'Custom Report', value: 'custom', icon: <FileTextOutlined /> },
];

const ReportBuilder: React.FC = () => {
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [generatedReport, setGeneratedReport] = useState<any>(null);

    // Get selected context from other apps
    const selectedUserId = useSelectedUser();
    const selectedProductId = useSelectedProduct();

    // Listen for selections from other apps
    useEffect(() => {
        const unsubUser = eventBus.on<UserSelectedPayload>(MFE_EVENTS.USER_SELECTED, (data) => {
            form.setFieldValue('includeUserId', data.userId);
            message.info(`User ${data.userId} included in report`);
        });

        const unsubProduct = eventBus.on<ProductSelectedPayload>(MFE_EVENTS.PRODUCT_SELECTED, (data) => {
            form.setFieldValue('includeProductId', data.productId);
            message.info(`Product ${data.productId} included in report`);
        });

        return () => { unsubUser(); unsubProduct(); };
    }, [form]);

    // Auto-populate from sync store
    useEffect(() => {
        if (selectedUserId) {
            form.setFieldValue('includeUserId', selectedUserId);
        }
        if (selectedProductId) {
            form.setFieldValue('includeProductId', selectedProductId);
        }
    }, [selectedUserId, selectedProductId, form]);

    const handleGenerate = () => {
        const values = form.getFieldsValue();

        // Mock report generation
        const report = {
            id: `RPT-${Date.now()}`,
            ...values,
            generatedAt: new Date().toISOString(),
            data: [
                { metric: 'Total Sales', value: Math.floor(Math.random() * 100000) },
                { metric: 'Orders', value: Math.floor(Math.random() * 1000) },
                { metric: 'Users', value: Math.floor(Math.random() * 500) },
                { metric: 'Conversion', value: `${(Math.random() * 10).toFixed(2)}%` },
            ],
        };

        setGeneratedReport(report);
        setCurrent(2);

        // Notify other apps about new report
        eventBus.emit(MFE_EVENTS.NOTIFICATION, {
            type: 'success',
            title: `Report "${values.title}" generated`,
            source: 'remote-distributed',
        });
    };

    const handleExport = () => {
        message.success('Report exported to PDF');
        eventBus.emit(MFE_EVENTS.NOTIFICATION, {
            type: 'info',
            title: 'Report exported from Reports app',
            source: 'remote-distributed',
        });
    };

    const steps = [
        { title: 'Configure', icon: <FileTextOutlined /> },
        { title: 'Data Sources', icon: <BarChartOutlined /> },
        { title: 'Generate', icon: <DownloadOutlined /> },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>📊 Report Builder</Title>
            <Paragraph>
                Create custom reports with data from all connected apps.
                Selected users/products from other apps are automatically included.
            </Paragraph>

            <Steps current={current} items={steps} style={{ marginBottom: 24 }} />

            <Row gutter={[16, 16]}>
                <Col xs={24} md={16}>
                    <Card>
                        {current === 0 && (
                            <Form form={form} layout="vertical" initialValues={{ chartType: 'bar', type: 'sales' }}>
                                <Form.Item name="title" label="Report Title" rules={[{ required: true }]}>
                                    <Input placeholder="Monthly Sales Report" />
                                </Form.Item>
                                <Form.Item name="type" label="Report Type">
                                    <Select options={reportTypes} />
                                </Form.Item>
                                <Form.Item name="dateRange" label="Date Range">
                                    <RangePicker style={{ width: '100%' }} />
                                </Form.Item>
                                <Form.Item name="chartType" label="Chart Type">
                                    <Select options={[
                                        { label: 'Bar Chart', value: 'bar' },
                                        { label: 'Line Chart', value: 'line' },
                                        { label: 'Pie Chart', value: 'pie' },
                                    ]} />
                                </Form.Item>
                                <Button type="primary" onClick={() => setCurrent(1)}>Next</Button>
                            </Form>
                        )}

                        {current === 1 && (
                            <Form form={form} layout="vertical">
                                <Form.Item name="includeUserId" label="Include User Data">
                                    <Input placeholder="User ID (auto-filled from selection)" />
                                </Form.Item>
                                <Form.Item name="includeProductId" label="Include Product Data">
                                    <Input placeholder="Product ID (auto-filled from selection)" />
                                </Form.Item>
                                <Divider />
                                <Space>
                                    <Button onClick={() => setCurrent(0)}>Back</Button>
                                    <Button type="primary" onClick={handleGenerate}>
                                        Generate Report
                                    </Button>
                                </Space>
                            </Form>
                        )}

                        {current === 2 && generatedReport && (
                            <div>
                                <Title level={4}>{generatedReport.title}</Title>
                                <Tag color="green">Generated</Tag>
                                <Text type="secondary"> at {new Date(generatedReport.generatedAt).toLocaleString()}</Text>

                                <Table
                                    dataSource={generatedReport.data}
                                    columns={[
                                        { title: 'Metric', dataIndex: 'metric', key: 'metric' },
                                        { title: 'Value', dataIndex: 'value', key: 'value' },
                                    ]}
                                    pagination={false}
                                    style={{ marginTop: 16 }}
                                />

                                <Space style={{ marginTop: 16 }}>
                                    <Button icon={<DownloadOutlined />} onClick={handleExport}>
                                        Export PDF
                                    </Button>
                                    <Button onClick={() => { setCurrent(0); setGeneratedReport(null); }}>
                                        New Report
                                    </Button>
                                </Space>
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card title="📌 Context from Other Apps">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div>
                                <Text strong>Selected User: </Text>
                                {selectedUserId ? (
                                    <Tag color="blue">{selectedUserId}</Tag>
                                ) : (
                                    <Text type="secondary">None (select in Users app)</Text>
                                )}
                            </div>
                            <div>
                                <Text strong>Selected Product: </Text>
                                {selectedProductId ? (
                                    <Tag color="green">{selectedProductId}</Tag>
                                ) : (
                                    <Text type="secondary">None (select in Products app)</Text>
                                )}
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ReportBuilder;
