import React from 'react';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import './index.css';
import { Link } from "react-router-dom";
import Iconfont from '../../components/Iconfont';
const { Header, Content } = Layout;
export default class MainFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: ['#/list'],
      collapsed: false,
    };
  }
  componentDidMount() {
    //路由对应Menu高亮部分
    this.setState({
      selectedKeys: [ window.location.hash || '#/list' ],
    });
  }
  handleClick = (e) => {
    this.setState({ selectedKeys: [e.key] });
  };
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  selectedMenuName() {
    let menu = this.props.menuData.find(i => `#${i.path}` === this.state.selectedKeys[0]);
    if (menu) {
      return menu.name;
    }
    return ;
  }

  render() {
    const { menuData = [] } = this.props;
    return (
      <Layout className="site-layout-app">
        <Header className="site-layout-background">
          <div className="logo" title="回到桌面"><a href="../"><img alt="logo" src={process.env.PUBLIC_URL + "/images/logo.png"}/></a></div>
          <div className="menu-wrap">
            <Menu mode="horizontal">
              <Menu.Item key="/stereo"><a href="#/stereo">{this.props.title}</a></Menu.Item>
            </Menu>
          </div>
        </Header>
        <div
          style={{
            minHeight: 'calc(100vh - 48px)',
            position: 'absolute',
            top: 48,
            left: 0,
            background: '#2F3753',
            width: this.state.collapsed ? 'auto' : 224,
            padding: 10,
            boxShadow: '2px 0px 6px 0px rgba(0, 21, 41, 0.35)'
          }}
        >
          <Menu
            selectedKeys={['#/list']}
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['#/list']}
            inlineCollapsed={this.state.collapsed}
          >
            {
              menuData.filter(menu => !menu.hide).map(menu => 
                <Menu.Item key={`#${menu.path}`} icon={<Iconfont type={menu.icon} />} onClick={this.handleClick}>
                  <Link to={menu.path}>{menu.name}</Link>
                </Menu.Item>  
              )
            }
          </Menu>
          <span onClick={this.toggleCollapsed} style={{ position: 'absolute', left: 24, bottom: 16, color: '#fff', cursor: 'pointer' }}>
            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
          </span>
        </div>
        <Content
          className="site-layout-background app-content"
          style={{ marginLeft: this.state.collapsed ? 100 : 224 }}
        >
          {this.props.children}
        </Content>
      </Layout>
    );
  }
}
