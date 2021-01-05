import AIList from '../app/AIList';
import AIDetails from '../app/AIDetails';

export const appRoutes = [
  {
    name: '算法管理',
    path: '/list',
    component: AIList,
    icon: 'iconmenu-guangboshebeiguanli'
  },
  {
    name: '算法详情',
    path: '/details/:id/:step',
    component: AIDetails,
    icon: 'iconmenu-guangboshebeiguanli',
    hide: true,
  }
];
