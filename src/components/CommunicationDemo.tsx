/**
 * Communication Demo for remote-distributed
 */
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Space, Tag, message, Typography, List, Badge, Input, Descriptions, Alert } from 'antd';
import { SendOutlined, SyncOutlined, CloudServerOutlined, ApiOutlined, KeyOutlined } from '@ant-design/icons';
import { useSyncStore, useSelectedUser, useSelectedProduct, useCart } from '@shared/state';
import { createEventBus, MFE_EVENTS } from '@shared/utils/eventBus';
import { createTokenBridge } from '@shared/utils/tokenBridge';
import { createAssetResolver } from '@shared/utils/assetResolver';

const { Title, Text, Paragraph } = Typography;

const eventBus = createEventBus('remote-distributed');
const tokenBridge = createTokenBridge('remote-distributed');
const assetResolver = createAssetResolver('remote-distributed');

interface EventLogItem {
    id: string;
    type: string;
    source?: string;
    timestamp: Date;
}

const CommunicationDemo: React.FC = () => {
    const [eventLog, setEventLog] = useState<EventLogItem[]>([]);
    const [message_, setMessage] = useState('');
    const [token, setToken] = useState<string | null>(null);

    // Sync store
    const selectedUser = useSelectedUser();
    const selectedProduct = useSelectedProduct();
    const cart = useCart();
    const { selectUser, selectProduct, addToCart } = useSyncStore();

    // Token bridge
    useEffect(() => {
        setToken(tokenBridge.getToken());
        const unsub = tokenBridge.on('token:updated', (data) => {
            setToken(data.token || null);
            addLog('token:updated', data.source);
        });
        return unsub;
    }, []);

    // Event bus
    useEffect(() => {
        const unsub1 = eventBus.on(MFE_EVENTS.USER_SELECTED, (data: any) => {
            addLog(MFE_EVENTS.USER_SELECTED, data.source);
        });
        const unsub2 = eventBus.on(MFE_EVENTS.PRODUCT_SELECTED, (data: any) => {
            addLog(MFE_EVENTS.PRODUCT_SELECTED, data.source);
        });
        const unsub3 = eventBus.on(MFE_EVENTS.NOTIFICATION, (data: any) => {
            addLog(MFE_EVENTS.NOTIFICATION, data.source);
            message.info(data.title);
        });
        return () => { unsub1(); unsub2(); unsub3(); };
    }, []);

    const addLog = (type: string, source?: string) => {
        setEventLog(prev => [
            { id: Date.now().toString(), type, source, timestamp: new Date() },
            ...prev.slice(0, 9),
        ]);
    };

    const handleBroadcast = () => {
        if (message_) {
            eventBus.emit(MFE_EVENTS.NOTIFICATION, {
                type: 'info',
                title: message_,
                source: 'remote-distributed',
            });
            setMessage('');
        }
    };

    const handleSetToken = () => {
        const newToken = `dist_token_${Date.now()}`;
        tokenBridge.setToken(newToken);
        setToken(newToken);
        message.success('Token set and synced');
    };

    const handleSelectUser = () => {
        const userId = `dist-user-${Date.now()}`;
        selectUser(userId);
        eventBus.emit(MFE_EVENTS.USER_SELECTED, { userId, source: 'remote-distributed' });
    };

    const handleSelectProduct = () => {
        const productId = `dist-product-${Date.now()}`;
        selectProduct(productId);
        eventBus.emit(MFE_EVENTS.PRODUCT_SELECTED, { productId, source: 'remote-distributed' });
    };

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>🌐 MFE Communication Demo</Title>
            <Paragraph>
                <Tag color="purple">remote-distributed</Tag>
                This app can be deployed on a separate domain (e.g., Vercel) and still communicate with other apps.
            </Paragraph>

            <Alert
                message="Cross-Domain Ready"
                description="This app uses BroadcastChannel (same-origin) and PostMessage (cross-origin) for communication."
                type="info"
                icon={<CloudServerOutlined />}
                showIcon
                style={{ marginBottom: 16 }}
            />

            <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <Card title="📦 Sync Store State">
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="User">{selectedUser || '-'}</Descriptions.Item>
                            <Descriptions.Item label="Product">{selectedProduct || '-'}</Descriptions.Item>
                            <Descriptions.Item label="Cart Items">{cart.length}</Descriptions.Item>
                        </Descriptions>
                        <Space style={{ marginTop: 16 }} wrap>
                            <Button size="small" onClick={handleSelectUser}>Select User</Button>
                            <Button size="small" onClick={handleSelectProduct}>Select Product</Button>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card title={<><KeyOutlined /> Token Bridge</>}>
                        <div style={{ marginBottom: 8 }}>
                            <Text strong>Token: </Text>
                            {token ? (
                                <Text code>{token.substring(0, 15)}...</Text>
                            ) : (
                                <Tag color="warning">No Token</Tag>
                            )}
                        </div>
                        <Space>
                            <Button size="small" type="primary" onClick={handleSetToken}>Set Token</Button>
                            <Button size="small" onClick={() => tokenBridge.requestToken()}>Request</Button>
                            <Button size="small" danger onClick={() => { tokenBridge.clearToken(); setToken(null); }}>Clear</Button>
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card title={<><ApiOutlined /> Event Bus</>}>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input
                                placeholder="Broadcast message..."
                                value={message_}
                                onChange={(e) => setMessage(e.target.value)}
                                onPressEnter={handleBroadcast}
                            />
                            <Button type="primary" icon={<SendOutlined />} onClick={handleBroadcast} />
                        </Space.Compact>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card title="🖼️ Asset Resolution">
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="Host Logo">
                                {assetResolver.getHostAsset('/logo.png')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Local Asset">
                                {assetResolver.getLocalAsset('/favicon.ico')}
                            </Descriptions.Item>
                            <Descriptions.Item label="Vite Asset">
                                {assetResolver.getRemoteAsset('remote-vite', '/vite.svg')}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                <Col xs={24} md={12}>
                    <Card
                        title="📋 Event Log"
                        extra={<Badge count={eventLog.length} />}
                    >
                        <List
                            size="small"
                            dataSource={eventLog}
                            locale={{ emptyText: 'No events yet' }}
                            renderItem={(item) => (
                                <List.Item>
                                    <Space>
                                        <Tag>{item.type}</Tag>
                                        {item.source && <Text type="secondary">from {item.source}</Text>}
                                        <Text type="secondary">{item.timestamp.toLocaleTimeString()}</Text>
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CommunicationDemo;
