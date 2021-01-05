import React, { useState, useEffect } from 'react';
import {
  Layout,
  Skeleton,
  Breadcrumb,
  Descriptions,
  Tabs,
} from 'antd';
import { HashRouter as Router, Route } from "react-router-dom";
import moment from 'moment';
import { getAIItem, subscripe } from '../api';
import './style.less';
import DataCollect from './Collect';
import DataLabel from './Label';
import Training from './Training';
import Empty from './Empty';

const { Content } = Layout;
const { TabPane } = Tabs;

export default function AIDetails(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [dataUpdate, setDataUpdate] = useState();

  const handleTabChange = activeKey => {
    console.log(props.match.params.id);
    props.history.push(`/details/${props.match.params.id}/${activeKey}`)
  };

  const fetch = (pagination) => {
    setLoading(true)
    getAIItem(props.match.params.id).then(res => {
      console.log(res);
      setData(res.data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    })
  };

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
  }
  const handleSocket = () => {
    subscripeEvents().then(res => {
      const socket = new WebSocket('ws://10.2.36.17/core/data/api/v1/websocket');

      socket.addEventListener('open', function (event) {
        console.log('即时通讯服务开启');
      });

      socket.addEventListener('message', function (event) {
        setDataUpdate(JSON.parse(event.data));
      });
      socket.addEventListener('open', function (event) {
        console.log('即时通讯服务关闭');
      });
    });
  };

  useEffect(() => {
    handleSocket();
    fetch(props.match.params.id);
  }, []);
  return (
    <React.Fragment>
      <Skeleton active loading={loading}>
        <div style={{
          background: '#FFFFFF',
          padding: '16px 16px 0',
          display: data ? 'block' : 'none',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div>
            <Breadcrumb>
              <Breadcrumb.Item><a href="#/">AI工作坊</a></Breadcrumb.Item>
              <Breadcrumb.Item><a href="#/list">算法管理</a></Breadcrumb.Item>
              <Breadcrumb.Item>{data && data.name}</Breadcrumb.Item>
            </Breadcrumb>
            <h3 style={{
              height: 28,
              lineHeight: '28px',
              fontSize: '20px',
              margin: '16px 0',
              color: 'rgba(0, 0, 0, 0.85)',
            }}>{data && data.name}</h3>
            <Descriptions style={{ marginRight: 446 }}>
              <Descriptions.Item label="版本号">
                {data && data.latestTrainTask ? data.latestTrainTask.version : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="数据集总量">
                {data && data.lastCollectionTask ? data.lastCollectionTask.currentCount : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {data && data.updateTime ? moment(data.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
            </Descriptions>
            <Tabs activeKey={props.match.params.step} onChange={handleTabChange}>
              <TabPane tab="数据采集" key="collect" />
              <TabPane tab="标签审核" key="label" disabled={data && data.lastCollectionTask && data.lastCollectionTask.state.status !== 3}/>
              <TabPane tab="训练结果" key="result" disabled={data && data.lastCollectionTask && data.lastCollectionTask.state.status !== 3}/>
              <TabPane tab="对比验证" key="compare" disabled={data && data.lastCollectionTask && data.lastCollectionTask.state.status !== 3}/>
            </Tabs>
          </div>
          <div
            style={{
              width: 446,
              margin: '38px 0 48px',
              right: 0,
              overflow: 'hidden',
              position: 'absolute',
              top: 16
            }}
          >
            <div className="index-card-mini">
              <div className="title">识别率</div>
              <div className="chart">
                <div className="bar" style={{height: '20%'}}></div>
                <div className="bar" style={{height: '80%'}}></div>
                <div className="bar" style={{height: '60%'}}></div>
                <div className="bar" style={{height: '90%'}}></div>
                <div className="bar" style={{height: '100%'}}></div>
              </div>
              <div className="value">98%</div>
            </div>
            <div className="index-card-mini blue">
              <div className="title">穿反光衣</div>
              <div className="chart">
                <div className="bar" style={{height: '20%'}}></div>
                <div className="bar" style={{height: '80%'}}></div>
                <div className="bar" style={{height: '60%'}}></div>
                <div className="bar" style={{height: '90%'}}></div>
                <div className="bar" style={{height: '100%'}}></div>
              </div>
              <div className="value">98%</div>
            </div>
            <div className="index-card-mini blue">
              <div className="title">未穿反光衣</div>
              <div className="chart">
                <div className="bar" style={{height: '20%'}}></div>
                <div className="bar" style={{height: '80%'}}></div>
                <div className="bar" style={{height: '60%'}}></div>
                <div className="bar" style={{height: '90%'}}></div>
                <div className="bar" style={{height: '100%'}}></div>
              </div>
              <div className="value">98%</div>
            </div>
          </div>
        </div>
      </Skeleton>
      <div style={{ height: 'calc(100vh - 250px)' }}>
        <Content style={{ margin: '16px', height: '100%', position: 'relative' }}>
          <Router>
            <Route
              key={`/details/${props.match.params.id}/collect`}
              path={`/details/${props.match.params.id}/collect`}
              render={routeProps => {
                return <DataCollect {...routeProps} eventData={dataUpdate} />
              }}
            />
            <Route
              key={`/details/${props.match.params.id}/label`}
              path={`/details/${props.match.params.id}/label`}
              render={routeProps => {
                return data && data.lastCollectionTask && data.lastCollectionTask.state.status !== 3 ?
                  <Empty/> :
                  <DataLabel
                    {...routeProps} 
                    datasetId={(data && data.lastCollectionTask && data.lastCollectionTask.datasetId) || ''}
                    state={data && data.latestTrainTask && data.latestTrainTask.state}
                    algrithmId={props.match.params.id}
                  />
              }}
            />
            <Route
              key={`/details/${props.match.params.id}/result`}
              path={`/details/${props.match.params.id}/result`}
              render={routeProps => {
                return <Training />
              }}
            />
            <Route
              key={`/details/${props.match.params.id}/compare`}
              path={`/details/${props.match.params.id}/compare`}
              render={routeProps => {
                return '敬请期待'
              }}
            />
          </Router>
        </Content>
      </div>
    </React.Fragment>
  );
}
