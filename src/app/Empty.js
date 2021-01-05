import { Empty } from 'antd';
export default function EmptyPage() {
  return (
    <Empty
      style={{
        position: 'absolute',
        top: '50%',
        bottom: 0,
        left: 0,
        right: 0,
        marginTop: -35,
      }}
      image={Empty.PRESENTED_IMAGE_SIMPLE} 
    />
  );
}