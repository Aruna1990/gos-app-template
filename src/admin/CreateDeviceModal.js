import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Input, Alert, InputNumber, Slider, Tooltip, Button } from 'antd';
import { gosSDK } from '../api';
import Iconfont from '../components/Iconfont';

const { TextArea } = Input;
const { Option } = Select;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
export default function CreateDeviceModal(props) {
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const [cameras, setCameras] = useState([]);
  const [currentVolume, setCurrentVolume] = useState(0);

  useEffect(() => {
    gosSDK.portal.getCameraList()
      .then(res => {
        setCameras(res.data.map(i => {
          return {
            id: i.id,
            name: i.cameraName,
          }
        }))
      })
  }, [])

  useEffect(() => {
    if (props.defaultValues) {
      form.setFieldsValue({
        ...props.defaultValues,
        source: props.defaultValues.source ? props.defaultValues.source.map(i => i.id) : [],
        maxPeriod1: parseInt(props.defaultValues.maxPeriod / 60),
        maxPeriod2: props.defaultValues.maxPeriod % 60,
      });
      setCurrentVolume(props.defaultValues && props.defaultValues.volume)
    }
  }, [props.defaultValues])
  
  const handleChanges = (changedFields, allFields) => {
    console.log(changedFields);
    let vol = changedFields.find(i => i.name.find(n => n === 'volume'));
    if (vol) {
      setCurrentVolume(vol.value);
    }
  };
  const reset = () => {
    form.setFieldsValue({
      ...props.defaultValues,
      source: props.defaultValues.source ? props.defaultValues.source.map(i => i.id) : [],
      maxPeriod1: parseInt(props.defaultValues.maxPeriod / 60),
      maxPeriod2: props.defaultValues.maxPeriod % 60,
    });
  };
  const createDevice = () => {
    form
      .validateFields()
      .then(values => {
        values.maxPeriod1 = values.maxPeriod1 || 0;
        values.maxPeriod2 = values.maxPeriod2 || 0;
        values.maxPeriod = values.maxPeriod1 * 60 + values.maxPeriod2;

        values.maxPeriod1 = null;
        values.maxPeriod2 = null;

        if (props.defaultValues && props.defaultValues.id) {
          onUpdate({ ...props.defaultValues, ...values });
        } else {
          onAdd({ ...props.defaultValues, ...values });
        }
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
    values.source = values.source.map(cam => cameras.find(i => i.id === cam))
    gosSDK.speaker.add({ ...values }).then(res => {
      console.log(res);
      form.resetFields();
      props.onFinish(res.id);
    }).catch(e => {
      setError(e.message);
    });
  }
  const onUpdate = values => {
    values.source = values.source.map(cam => cameras.find(i => i.id === cam))
    gosSDK.speaker.update({ ...values }).then(res => {
      console.log(res);
      form.resetFields();
      props.onFinish(values.id);
    }).catch(e => {
      setError(e.message);
    });
  }
  return (
    <Modal
      title={props.title}
      visible={props.visible}
      onOk={createDevice}
      onCancel={handleCancel}
      width={760}
      bodyStyle={{
        padding: '24px 64px 24px 48px'
      }}
      style={{ top: 20}}
    >
      <Form {...layout} form={form} name="create-device" onFieldsChange={handleChanges}>
        <Form.Item
          name="name"
          label="设备名称"
          rules={[
            { required: true },
            { 
              message: '不能输入特殊字符',
              pattern: /^[A-Za-z0-9\-_\u4e00-\u9fa5]{0,}$/
            },
            { 
              message: '长度不能超过32字符',
              pattern: /^.{0,32}$/
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="appId"
          label="应用ID"
          rules={[
            { required: true },
            { 
              message: '不能输入特殊字符',
              pattern: /^[A-Za-z0-9]{0,}$/
            },
            { 
              message: '长度不能超过36字符',
              pattern: /^.{0,36}$/
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="secret"
          label="应用密钥"
          rules={[
            { required: true },
            { 
              message: '不能输入特殊字符',
              pattern: /^[A-Za-z0-9]{0,}$/
            },
            { 
              message: '长度不能超过36字符',
              pattern: /^.{0,36}$/
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="ip"
          label="设备IP地址"
          rules={[
            { required: true },
            { 
              message: '请输入合法IP地址',
              pattern: /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/,
              validateTrigger: 'onSubmit'
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="port" label="设备端口" rules={[{ required: true }]}>
          <InputNumber max={65535}/>
        </Form.Item>
        <Form.Item name="source" label="关联通道">
          <Select mode="multiple">
            {cameras.map(cam => <Option key={cam.id} value={cam.key}>{cam.name}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="maxPeriod1" label="相同事件播报间隔">
          <InputNumber min={0} max={999} style={{width: 72}}/>
        </Form.Item>
        <div
          style={{
            marginTop: '-56px',
            marginLeft: '234px',
            display: 'flex',
            flexFlow: 'row wrap',
          }}
        >
          <span style={{lineHeight: '32px', float: 'left', padding: '0 8px'}}>分钟</span>
          <Form.Item name="maxPeriod2" label="" style={{float: 'left'}}>
            <InputNumber min={0} max={59} style={{width: 72}} />
          </Form.Item>
          <span style={{lineHeight: '32px', float: 'left', padding: '0 8px'}}>秒</span>
          <Tooltip placement="top" title={<span>相同事件:同一通道的同一类安全事件</span>}>
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
        <Form.Item name="volume" label="广播音量">
          <Slider
            min={0}
            max={100}
            style={{width: 180, marginLeft: 30}}
          />
        </Form.Item>
        <div
          style={{
            marginTop: '-56px',
            marginLeft: '393px',
            display: 'flex',
            flexFlow: 'row wrap',
          }}
        >
          <Iconfont
            type={currentVolume ? 'iconicon-yinliang-kai' : 'iconicon-yinliang-guan'}
            style={{
              lineHeight: '36px',
              marginLeft: '-230px',
              marginRight: '210px',
            }}/>
          <Form.Item name="volume" label="">
            <InputNumber 
              min={0}
              max={100}
              style={{width: 72}}
            />
          </Form.Item>
        </div>
      </Form>
      { error ? <Alert message={error} type="error" /> : <></> }
    </Modal>
  );
}