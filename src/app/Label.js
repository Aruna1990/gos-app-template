import React, { useState, useEffect } from 'react';
import {
  Select,
  Button,
  message,
  List,
} from 'antd';
import { getLabelList, updateLabel, train, RESOURCE_ROOT } from '../api';
import './label.less';

const { Option } = Select;

export default function DataLabel(props) {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [labelChanged, setLabelChanged] = useState(false);
  const [disableLabelSelect, setDisableLabelSelect] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 9, total: 0 });

  const fetch = (datasetId,pagination) => {
    setLoading(true)
    getLabelList(datasetId).then(res => {
      console.log('getLabelList')
      setList(res.data.recordList);
      setPagination({ ...pagination, total: res.data.totalResults });
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    })
  };

  const handleLabelChange = (id, value) => {
    updateLabel({
      dFileId: id,
      tagCodes: value,
    }).then(res => {
      setLabelChanged(true);
      setList(list => {
        let idx = list.findIndex(i => i.id === id);
        list[idx] = {
          ...list[idx],
          manualTags: [{
            ...list[idx].manualTags[0],
            code: value,
          }],
          loading: false,
        }
        return [...list];
      });
    }).catch(() => {
      message.error('修改标签失败');
    })
  };
  const handleTraningState = () => {
    train({
      datasetId: props.datasetId,
      cmd: props.state && props.state.status === 0 ? 'start' : '',
      algrithmId: props.algrithmId,
    }).then(() => {
      message.seccuss('训练开启成功');
      setDisableLabelSelect(true);
    }).catch(() => {
      message.error('开启训练失败');
    })
  }

  useEffect(() => {
    if (props.datasetId) {
      fetch(props.datasetId)
    }
  }, [props.datasetId])

  useEffect(() => setDisableLabelSelect(props.state && props.state.status !== 0), props.match.params.id)

  return (
    <div
      style={{
        height: '100%',
      }}
    >
      <div style={{background: '#fff', padding: '16px 24px', height: '100%'}}>
        <div style={{height: 32, lineHeight: '32px'}}>
          总计：<span style={{color: '#508BEE'}}>{pagination.total}</span>张
          <Button
            type="primary"
            disabled={(props.state && props.state.status !== 0) || !labelChanged}
            style={{float: 'right'}}
            onClick={handleTraningState}
          >   {(props.state && props.state.status !== 0) ? `训练${props.state.message}` : '开始训练'}
          </Button>
        </div>
        <hr/>
        <List
          class="image-list"
          split={false}
          dataSource={list}
          loading={loading}
          renderItem={i => (
            <List.Item>
              <div className="image-list-item">
                <img alt="" src={`${RESOURCE_ROOT}${i.filePath}`}/>
                <Select
                  className="label-select"
                  showArrow={false}
                  style={{ width: '96px' }}
                  value={(i.manualTags && i.manualTags[0] && i.manualTags[0].code) || i.tags[0].code}
                  onChange={value => handleLabelChange(i.id, value)}
                  loading={i.loading}
                  disabled={disableLabelSelect}
                >
                  <Option value="vests">穿反光衣</Option>
                  <Option value="unVests">未穿反光衣</Option>
                  <Option value="safeBelts">戴安全带</Option>
                  <Option value="unSafeBelts">未戴安全带</Option>
                  <Option value="hardhats">戴安全帽</Option>
                  <Option value="unHardhats">未戴安全帽</Option>
                </Select>
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}