import React, { useState, useEffect } from 'react';
import { Modal,
  Form,
  Select,
  Input,
  Alert,
  InputNumber,
  Tooltip,
  Button,
  Row,
  Col,
  DatePicker,
} from 'antd';
import moment from 'moment';
import { gosSDK, createCollection } from '../api';
import Iconfont from '../components/Iconfont';

const { Option } = Select;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
export default function CreateDeviceModal(props) {
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const [cameras, setCameras] = useState([{id: 1, name: 'test', channelNo: "10", sn: "13654"}]);

  useEffect(() => {
    gosSDK.portal.getCameraList()
      .then(res => {
        setCameras(res.data.map(i => {
          return {
            id: i.id,
            sn: i.cameraSn,
            channelNo: i.channelNo,
            name: i.cameraName,
          }
        }))
      })
  }, [])

  useEffect(() => {
    if (props.defaultValues) {
      form.setFieldsValue({
        ...props.defaultValues,
        channels: props.defaultValues.channels ? props.defaultValues.channels.map(i => i.id) : [],
      });
    }
  }, [props.defaultValues, form])
  
  const commit = () => {
    form
      .validateFields()
      .then(values => {
        onAdd({ ...props.defaultValues, ...values });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  }

  const handleCancel = () => {
    form.resetFields();
    setError(null);
    if (props.onCancel ) props.onCancel();
  }

  const onAdd = values => {
    values.channels = values.channels.map(cam => cameras.find(i => i.id === cam))
    createCollection({ ...values, endTime: moment(values.endTime).valueOf(), startTime: moment().valueOf() }).then(res => {
      form.resetFields();
      props.onFinish(res.id);
    }).catch(e => {
      setError(e.message);
    });
  }

  return (
    <Modal
      title={props.title}
      visible={props.visible}
      onOk={commit}
      onCancel={handleCancel}
      width={760}
      bodyStyle={{
        padding: '24px 64px 24px 48px'
      }}
      style={{ top: 20}}
    >
      <Form {...layout} form={form} name="edit">
        <Form.Item
          name="name"
          label="数据集名称"
          rules={[
            { required: true },
            { 
              message: '长度不能超过60字符',
              pattern: /^.{0,60}$/
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="channels"
          label="关联通道"
          rules={[
            { required: true },
          ]}
        >
          <Select mode="multiple">
            {cameras.map(cam => <Option key={cam.id} value={cam.id}>{cam.name}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item
          name="interval"
          label="取样间隔"
          rules={[
            { required: true },
          ]}
        >
          <InputNumber min={1} max={30} style={{width: 132}}/>
        </Form.Item>
        <div
          style={{
            marginTop: '-56px',
            marginLeft: '294px',
            display: 'flex',
            flexFlow: 'row wrap',
          }}
        >
          <span style={{lineHeight: '32px', float: 'left', padding: '0 8px'}}>秒</span>
        </div>
        <Row style={{lineHeight: '32px', margin: '24px 0'}}>
          <Col span={6} style={{textAlign: 'right', paddingRight: 14}}>
            数据采集终止条件
          </Col>
          <Col style={{marginLeft: -6}}>
            <Tooltip placement="top" title={<span>若满足以下任一条件，则终止当前数据采集任务</span>}>
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
          </Col>
        </Row>
        <Form.Item
          name="targetCount"
          label="人像数量上限"
          rules={[
            { required: true },
          ]}
        >
          <InputNumber
            min={50}
            max={500}
            style={{width: 132}}
          />
        </Form.Item>
        <div
          style={{
            marginTop: '-56px',
            marginLeft: '294px',
            display: 'flex',
            flexFlow: 'row wrap',
            marginBottom: 24,
            lineHeight: '32px'
          }}
        >
          <span style={{paddingLeft: 8}}>个</span>
          <Tooltip placement="top" title={<span>检测到的每一个人像，都作为数据集中的一张图片（此选项即该数据集的最大图片数）</span>}>
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
        </div>
        <Form.Item
          name="endTime"
          label="采集截止时间"
          rules={[
            { required: true },
          ]}
        >
          <DatePicker showTime />
        </Form.Item>
      </Form>
      { error ? <Alert message={error} type="error" /> : '' }
    </Modal>
  );
}