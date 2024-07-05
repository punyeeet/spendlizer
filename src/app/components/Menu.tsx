"use client"
import React, { memo, useEffect, useState } from 'react';
import {
    UserOutlined,
    HomeOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { BiAnalyse } from "react-icons/bi";
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation'

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        label: 'Home',
        key: 'dashboard',
        icon: <HomeOutlined />,
        style: {
            color:'white'
        },
    },
    {
        label: 'Analyze',
        key: 'analysis',
        icon: <BiAnalyse />,
        style: {
            color:'white'
        },
        
    },
    {
        label: 'Settings',
        key: 'profile',
        icon: <UserOutlined />,
        style: {
            color:'white'
        },
        
    },
];

const MenuComponent: React.FC = () => {
    const [current, setCurrent] = useState('dashboard');

    const router = useRouter();

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
        router.push('/'+e.key);
    };

    return (
        <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
            style={{backgroundColor:"#272727",color:'#fff',position:'sticky'}}
        />
    );
};

export const Navbar = memo(MenuComponent);
