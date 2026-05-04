import Map from '@/assets/icons/Map.svg?react';
import Products from '@/assets/icons/Products.svg?react';
import Search from '@/assets/icons/Search.svg?react';
import Guide from '@/assets/icons/Guide.svg?react';

import Gragh from '@/assets/icons/GraghS.svg?react';
import Warning from '@/assets/icons/WarningS.svg?react';
import Fire from '@/assets/icons/FireS.svg?react';
import Setting from '@/assets/icons/SettingS.svg?react';

export const USER_TABS = [
  {
    key: 'home',
    path: '/user',
    label: '실시간 지도',
    icon: <Map />,
    end: true,
  },
  {
    key: 'resource',
    path: '/user/resource',
    label: '자원 게시판',
    icon: <Products />,
  },
  {
    key: 'missing',
    path: '/user/missing',
    label: '실종 찾기',
    icon: <Search />,
  },
  {
    key: 'guide',
    path: '/user/guide',
    label: '행동요령',
    icon: <Guide />,
  },
];

export const ADMIN_SIDE_BAR = [
  {
    key: 'dashboard',
    path: '/admin/dashboard',
    label: '대시보드',
    title: '시스템 현황',
    description: '전체 제보 및 사용자 관리 현황을 확인할 수 있습니다.',
    icon: <Gragh />,
    end: true,
  },
  {
    key: 'reports',
    path: '/admin/reports',
    label: '제보 검토',
    title: '제보 검토',
    description: '신고되거나 의심스러운 제보를 검토하고 조치할 수 있습니다',
    icon: <Warning />,
  },
  {
    key: 'statistics',
    path: '/admin/statistics',
    label: '재난 통계',
    title: '재난 통계 및 아카이브',
    description: '과거 재난 기록을 검색하고 통계 데이터를 확인할 수 있습니다',
    icon: <Fire />,
  },
  {
    key: 'settings',
    path: '/admin/settings',
    label: '설정',
    title: '시스템 설정',
    description: '시스템 운영, 콘텐츠, 보안 설정을 관리할 수 있습니다',
    icon: <Setting />,
    children: [
      {
        key: 'system',
        path: '/admin/settings/system',
        label: '시스템 운영',
      },
      {
        key: 'contents',
        path: '/admin/settings/contents',
        label: '콘텐츠 관리',
      },
      {
        key: 'account',
        path: '/admin/settings/account',
        label: '계정 관리',
      },
    ],
  },
];
