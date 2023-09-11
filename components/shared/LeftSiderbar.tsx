"use client"
import React from 'react'
import { UserSwitchOutlined,UsergroupAddOutlined,SelectOutlined,HeartOutlined,SearchOutlined,HomeOutlined} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Router from 'next/router'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import style from './Top.module.css'
import { Menu, ConfigProvider } from 'antd';
import { SignOutButton, SignedIn,useAuth } from '@clerk/nextjs';
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}


const LeftSiderbar: React.FC = () => {
  const router=useRouter();
  const {userId}=useAuth();
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e.key);
    router.push(e.key)
  };
  const items: MenuProps['items'] = [
    getItem('Home', '/', <HomeOutlined />),
  
    getItem('Search', '/search', <SearchOutlined />),
    getItem('Activity', '/activity', <HeartOutlined />),
    getItem('Create Thread', '/create-thread', <SelectOutlined />),
    getItem('Community', '/communities', <UsergroupAddOutlined />),
    
    { type: 'divider' },
    getItem('Profile', `/profile/${userId}`, <UserSwitchOutlined />),
  ];
  return (
    <ConfigProvider
    theme={{
      token: {
        // Seed Token，影响范围大
        colorPrimary: 'rgb(135,125,251)',
        borderRadius: 2,

        // 派生变量，影响范围小
        colorBgContainer: '#f6ffed',
      },
    }}
    
  >
    <div>
    <Menu
    onClick={onClick}
    style={{ width:'13vw',height:'93%',backgroundColor: 'rgba(19,20,23)' }}
    defaultSelectedKeys={['1']}
    defaultOpenKeys={['sub1']}
    mode="inline"
    items={items}
    theme="dark"
  />
  <div className={style.signout}>
<SignedIn>
  <SignOutButton 
  signOutCallback={()=>{
  router.push('/sign-in')
  }
  }
  >
    <div className={style.outmain}>
    <Image alt='signout' src='/assets/goout.png' width={20} height={20}/>
<p className={style.outfont}>
sign out
</p>
    </div>

  </SignOutButton>
</SignedIn>
  </div>
  </div>
 
   </ConfigProvider>
  )
}

export default LeftSiderbar