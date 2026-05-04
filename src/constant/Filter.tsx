import styled from 'styled-components';
import type { Filter } from '@/types/common';

const Circle = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ theme, color }) => {
    switch (color) {
      case 'red600':
        return theme.colors.red600;
      case 'red400':
        return theme.colors.red400;
      case 'red200':
        return theme.colors.red200;
      case 'gray':
        return theme.colors.gray500;
      default:
        return theme.colors.gray500;
    }
  }};
`;

export const HOME_FILTER: Filter = {
  disasterType: { tabLabel: '재난유형', items: [] },

  riskLevel: {
    tabLabel: '위험도',
    items: [
      { label: '전체' },
      { label: '긴급', icon: <Circle color="red600" /> },
      { label: '높음', icon: <Circle color="red400" /> },
      { label: '보통', icon: <Circle color="red200" /> },
      { label: '낮음', icon: <Circle color="gray" /> },
    ],
  },
};

export const RESOURCE_BOARD_FILTER: Filter = {
  type: {
    tabLabel: '유형',
    items: [{ label: '전체' }, { label: '요청' }, { label: '공급' }],
  },

  category: {
    tabLabel: '카테고리',
    items: [
      { label: '전체' },
      { label: '식량' },
      { label: '식수' },
      { label: '의약품' },
      { label: '대피처' },
      { label: '의류' },
      { label: '도구' },
    ],
  },

  status: {
    tabLabel: '상태',
    items: [
      { label: '전체' },
      { label: '진행 중' },
      { label: '대기 중' },
      { label: '마감' },
    ],
  },
};

export const MISSING_BOARD_FILTER: Filter = {
  category: {
    tabLabel: '카테고리',
    items: [
      { label: '전체' },
      { label: '사람' },
      { label: '반려동물' },
      { label: '소지품' },
    ],
  },

  status: {
    tabLabel: '상태',
    items: [{ label: '전체' }, { label: '찾는 중' }, { label: '발견됨' }],
  },
};
