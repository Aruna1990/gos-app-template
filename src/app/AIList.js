import React, { useState, useEffect } from 'react';
import {
  Layout,
  Card,
  List,
} from 'antd';
import { getAIList } from '../api';
import './style.less';
import Iconfont from '../components/Iconfont';

const { Content } = Layout;
const { Meta } = Card;

export default function AIList() {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 9, total: 0 });

  const handlePageChange = (pageNo, pageSize) => {
    setPagination({ ...pagination, current: pageNo, pageSize });
  };

  const fetch = (pagination) => {
    setLoading(true)
    getAIList({
      pageNo: pagination.current,
      length: pagination.pageSize,
    }).then(res => {
      console.log(res)
      setList(res.data.recordList);
      setPagination({ current: res.data.pageNo, pageSize: res.data.pageSize, total: res.data.totalResults });
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    })
  };

  useEffect(() => fetch(pagination), [pagination]);

  return (
    <React.Fragment>
      <h3 style={{
        height: 76,
        lineHeight: '76px',
        background: '#FFFFFF',
        fontSize: '20px',
        padding: '0 24px',
        marginBottom: 16,
        color: 'rgba(0, 0, 0, 0.85)',
      }}>算法管理</h3>
      <div style={{ height: 'calc(100vh - 156px)' }}>
        <Content style={{ margin: '16px' }}>
          <div>
            <List
              pagination={{
                ...pagination,
                onChange: handlePageChange,
                hideOnSinglePage: true,
              }}
              dataSource={list}
              loading={loading}
              renderItem={item => (
                <Card
                  style={{ width: 364, margin: '0 16px 16px 0' }}
                  actions={[
                    <a href={`#/details/${item.id}/collect`}>数据采集</a>,
                    <a
                      href={`#/details/${item.id}/label`}
                      disabled={!item.latestTrainTask || item.latestTrainTask.state.status !== 4}
                    >优化</a>,
                    <a
                      href={`#/details/${item.id}/deploy`}
                      disabled={!item.latestTrainTask || item.latestTrainTask.state.status !== 5}
                    >部署</a>,
                  ]}
                >
                  {console.log(item)}
                  <Meta
                    title={
                      <div>
                        <span>
                          <Iconfont type="iconmenu-shebeiguanli" style={{marginRight: 8}}/>{item.name}
                        </span>
                        <span style={{float: 'right'}}>
                          <span
                            className="status-dot"
                            style={{
                              background: item.latestTrainTask && item.latestTrainTask.state === 0 ? '#7ED321' : '#508BEE'
                            }}
                          ></span>
                          {(item.latestTrainTask && item.latestTrainTask.state.message) || '未开始'}
                        </span>
                      </div>
                    }
                    description={(
                      <div>
                        版本号：{(item.lastTrainTask && item.lastTrainTask.version) || '-'}<br/>
                        数据集总量：{(item.lastCollectionTask && item.lastCollectionTask.currentCount) || '-'}<br/>
                        识别率：
                        <span
                          className="status-dot"
                          style={{background: '#68DEC4'}}
                        ></span>
                        <span>全部：</span>{(item.lastTrainTask && (item.lastTrainTask.rightCount / item.lastTrainTask.targetCount)) || '-'}<br/>
                        <span
                          className="status-dot"
                          style={{marginLeft: 56, background: '#479FFF'}}
                        ></span>
                        <span>穿反光衣：</span>{(item.lastTrainTask && (item.lastTrainTask.rightCount / item.lastTrainTask.targetCount)) || '-'}<br/>
                        <span
                          className="status-dot"
                          style={{marginLeft: 56, background: '#479FFF'}}
                        ></span>
                        <span>未穿反光衣：</span>{}<br/>
                        最后训练：{(item.latestTrainTask && item.latestTrainTask.createTime) || '-'}<br/>
                      </div>
                    )}
                  />
                </Card>
              )}
            />
          </div>
        </Content>
      </div>
    </React.Fragment>
  );
}