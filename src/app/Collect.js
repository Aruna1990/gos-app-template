import React, { useState, useEffect } from 'react';
import {
  Button,
  message,
  Table,
} from 'antd';
import moment from 'moment';
import { getCollectList } from '../api';
import CreateDeviceModal from './CreateDeviceModal';
import './style.less';

const statusMap = {
  0: {
    name: '待采集',
    color: '#FFBF00'
  },
  1:  {
    name: '采集中',
    color: '#7ED321'
  },
  2:  {
    name: '采集失败',
    color: '#FF626A'
  },
  3:  {
    name: '采集完成',
    color: '#508BEE'
  },
  unknown:  {
    name: '未知',
    color: '#D8D8D8'
  },
};

export default function DataCollect(props) {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const subscripeEvents = () => {
    // return new Promise((resolve, reject) => {
    //   subscripe({
    //     component: 'aifactory',
    //     topics: []
    //   }).then(res => {
    //     console.log(res);
    //     resolve(res);
    //   }).catch(e => {
    //     reject(e);
    //   })
    // })
    return Promise.resolve();
  };

  const columns = [
    {
      title: '数据集名称',
      dataIndex: 'name',
      key: 'name',
      width: 232,
    },
    {
      title: '任务状态',
      dataIndex: 'state',
      key: 'state',
      render: (_, record) => {
        return (
          <span>
            <span className="status-light" style={{ background: statusMap[record.state.status].color }} />
            { record.state.message }
          </span>
        );
      }
    },
    {
      title: '摄像头',
      key: 'channels',
      dataIndex: 'channels',
      render: (_, record) => record.channels.map(i => i.name).join(', '),
      width: 272
    },
    {
      title: '取样间隔',
      dataIndex: 'interval',
      key: 'interval',
      render: (_, record) => `${record.interval}秒`

    },
    {
      title: '人像数量（已采集/上限）',
      dataIndex: 'targetCount',
      key: 'targetCount',
      render: (_, record) => <span><span style={{color: '#7ED321'}}>{record.currentCount || 0}</span><span>/{record.targetCount}</span></span>

    },
    {
      title: '采集截止时间',
      dataIndex: 'expireTime',
      key: 'expireTime',
      render: (_, record) => moment(record.expireTime).format('YYYY-MM-DD HH:mm:ss'),
      width: 192
    }
  ];

  const onPageChange = (pageNo, pageSize) => {
    console.log(pageNo)
    setPagination({ ...pagination, current: pageNo, pageSize });
  };
  const fetch = () => {
    setLoading(true)
    getCollectList({
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    }).then(res => {
      setList(res.data.recordList);
      setPagination({ current: res.data.pageNo, pageSize: res.data.pageSize, total: res.data.totalResults });
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    })
  };

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
  let socket;
  const ws = (data) => {
    if (data && data.topic === '/gos/aifactory/data/collection/state') {
      list[0] = {...list[0], ...data.contents[0]};
      setList([...list]);
    }
  }
  useEffect(() => {
    fetch();
  }, [pagination]);
  useEffect(() => {
    console.log(props.eventData);
    ws(props.eventData);
  }, [props.eventData])
  return (
      <React.Fragment>
        <Button type="primary" onClick={openAddModal}>+ 新建采集任务</Button>
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
          title="新建采集任务"
          defaultValues={{
            interval: 30,
            targetCount: 500
          }}
          visible={createModalVisible}
          onCancel={handleCreateCancel}
          onFinish={handleCreateFinish}
        />
      </React.Fragment>
  );
}