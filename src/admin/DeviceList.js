import React, { useState, useEffect } from 'react';
import {
  Button,
  message,
  Form,
  Row,
  Col,
  Select,
  Input,
  Layout,
  Table,
  Space,
  Modal,
  Slider,
  InputNumber,
  Tooltip,
} from 'antd';
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { gosSDK } from '../api';
import CreateDeviceModal from './CreateDeviceModal';
import './style.css';
import Iconfont from '../components/Iconfont';

const { Option } = Select;

const { Content } = Layout;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};

const deviceStatusMap = {
  0: {
    name: '离线',
    color: '#FF626A'
  },
  1:  {
    name: '在线',
    color: '#69C371'
  },
  2:  {
    name: '停用',
    color: '#FFBF00'
  },
  3:  {
    name: '未激活',
    color: '#9D9D9D'
  },
  4:  {
    name: '未注册',
    color: '#D8D8D8'
  },
  unknown:  {
    name: '未知',
    color: '#D8D8D8'
  },
};

export default function NetConfig() {
  const [formValue, setFormValue] = useState({});
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateDevice, setUpdateDevice] = useState(null);

  const columns = [
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: (
        <span>
          连接状态
          <Tooltip placement="top" title={<span>如果设备离线，请检查网络连接情况，并确认各项配置是否正确</span>}>
            <Button
              shape="circle"
              type="text"
              className="tips"
              icon={
                <Iconfont
                  type="iconicon-wenhao"
                  style={{lineHeight: '32px', float: 'left', padding: '0 8px'}}
                />
              }
            />
          </Tooltip>
        </span>),
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        let text = Number(record.status) || 'unknown';
        return (
          <span>
            <span className="status-light" style={{ background: deviceStatusMap[record.status].color }} />
            { deviceStatusMap[record.status].name }
          </span>
        );
      }
    },
    {
      title: '关联通道',
      key: 'source',
      dataIndex: 'source',
      render: (_, record) => record.source.map(i => i.name).join(', ')
    },
    {
      title: '同类事件播报间隔',
      dataIndex: 'maxPeriod',
      key: 'maxPeriod',
      render: (_, record) => `${parseInt(record.maxPeriod / 60)}分钟${record.maxPeriod % 60 ? record.maxPeriod % 60 + '秒' : ''}`

    },
    {
      title: '广播音量',
      dataIndex: 'volume',
      key: 'volume',
      width: 270,
      render: (_, record) => {
        return (
          <div>
            <Iconfont
              type={record.volume ? 'iconicon-yinliang-kai' : 'iconicon-yinliang-guan'}
              style={{lineHeight: '32px', verticalAlign: 'sub'}}
            />
            <Slider
              min={0}
              max={100}
              style={{width: 120, display: 'inline-block', verticalAlign: 'middle'}}
              value={record.volume}
              onChange={value => updateVolume(record.id, value, true)}
              onAfterChange={value => updateVolume(record.id, value)}
            />
            <InputNumber 
              min={0}
              max={100}
              style={{width: 72, marginLeft: 16}}
              value={record.volume}
              onChange={value => updateVolume(record.id, value)}
            />
          </div>
        );
      }
    },
    {
      title: '操作',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={() => setUpdateDevice(record)}>编辑</a>
          <a onClick={() => deleteConfirm(record)}>删除</a>
        </Space>
      ),
      width: 125
    }
  ];

  const onSearch = values => {
    setFormValue(values);
  };
  const onPageChange = (pageNo, pageSize) => {
    console.log(pageNo)
    setPagination({ ...pagination, current: pageNo, pageSize });
  };
  const fetch = () => {
    setLoading(true)
    gosSDK.speaker.getList({
      ...formValue
    }).then(res => {
      setList(res.data);
      setPagination({ current: res.pageNo, pageSize: res.pageSize, total: res.totalResults });
      setLoading(false);
    }).catch(() => setLoading(false))
  };
  const del = (device) => {
    gosSDK.speaker.delete(device.id)
      .then(() => {
        message.success('删除成功');
        fetch();
      })
      .catch(() => message.error('删除失败'));
  };

  function deleteConfirm(device) {
    console.log('deleteConfirm');
    Modal.confirm({
      title: '确定要删除吗？',
      icon: <ExclamationCircleOutlined />,
      content: `即将删除设备${device.name}`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => del(device),
    });
  }

  const openAddModal = () => {
    setCreateModalVisible(true);
  };
  const handleCreateCancel = () => {
    setCreateModalVisible(false);
  };
  const handleCreateFinish = () => {
    setCreateModalVisible(false);
    message.success('添加成功');
    fetch();
  }
  const handleUpdateCancel = () => {
    setUpdateDevice(null);
  };
  const handleUpdateFinish = () => {
    setUpdateDevice(null);
    message.success('修改成功');
    fetch();
  }

  useEffect(fetch, [formValue, pagination.current, pagination.pageSize]);

  const updateVolume = (id, volume, localChange) => {
    if (!localChange) {
      gosSDK.speaker.setVolume(id, volume);
    }
    let idx = list.findIndex(i => i.id === id);
    list[idx] = {
      ...list[idx],
      volume,
    }
    setList([...list]);
  };

  return (
    
      <Content style={{ margin: '16px' }}>
        <Button type="primary" onClick={openAddModal}>+ 添加广播设备</Button>
        <Table
          rowKey="id"
          style={{ marginTop: 16 }}
          columns={columns}
          dataSource={list}
          loading={loading}
          pagination={{ 
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: onPageChange,
            ...pagination,
          }}
        />
        <CreateDeviceModal
          title="添加广播设备"
          visible={createModalVisible}
          defaultValues={{
            port: 8888,
            volume: 50,
            maxPeriod: 60,
          }}
          onCancel={handleCreateCancel}
          onFinish={handleCreateFinish}
        />
        <CreateDeviceModal
          title="编辑广播设备"
          defaultValues={updateDevice}
          visible={updateDevice}
          onCancel={handleUpdateCancel}
          onFinish={handleUpdateFinish}
        />
      </Content>
  );
}