import React from 'react';
import { Layout, Menu, Dropdown } from 'antd';
import { API_ROOT_PORTAL } from '../../api';
import {
  QrcodeOutlined,
  DownOutlined,
} from '@ant-design/icons';
import Iconfont from '../../components/Iconfont';
import './index.css';
import { Link } from "react-router-dom";
const { Header, Content } = Layout;
export default class MainFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: []
    };
  }
  componentDidMount() {
    //路由对应Menu高亮部分
    this.setState({
      selectedKeys: [ window.location.pathname ],
    });
  }
  handleClick = (e) => {
    this.setState({ selectedKeys: [e.key] });
  };

  render() {
    const { menuData = [] } = this.props;
    return (
      <Layout className="site-layout-app">
        <Header className="site-layout-background">
          <div className="logo" title="回到桌面"><a href="/"><img src={process.env.PUBLIC_URL + "/images/logo.png"}/></a></div>
          <div className="menu-wrap">
            <Menu mode="horizontal" selectedKeys={this.state.selectedKeys}>
              <Menu.Item key="/settings"><a href="/settings">{this.props.title}</a></Menu.Item>
            </Menu>
          </div>
        </Header>
        <Content
          className="site-layout-background app-content"
        >
          <div style={{height: '100%' }}>{this.props.children}</div>
        </Content>
      </Layout>
    );
  }
}