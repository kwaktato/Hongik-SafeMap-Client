import styled from 'styled-components';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Back from '@/assets/icons/ChevronLeft.svg?react';
import { useSafetyTipsByDisasterType } from '@/api/safetyTips';
import { NavBar } from '@/components/common/NavBar';
import { WarningSection } from '@/components/user/guide/WarningSection';
import { SuppliesSection } from '@/components/user/guide/SuppliesSection';
import { ActionSection } from '@/components/user/guide/ActionSection';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';

export const GuideDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { handleGoBack } = useHandleNavigate();

  const { data } = useSafetyTipsByDisasterType(Number(id));

  const [activeTab, setActiveTab] = useState('행동 요령');
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    window.scrollTo(0, 0);
  };

  const tabContent = {
    '행동 요령': <ActionSection guides={data?.actions} />,
    '필수 준비물': <SuppliesSection supplies={data?.supplies} />,
    주의사항: <WarningSection warnings={data?.warnings} />,
  };

  return (
    <Container>
      <NavBar
        left={<Back onClick={handleGoBack} />}
        center={<NavCenter>{data?.title}</NavCenter>}
      />

      <Tabs>
        {['행동 요령', '필수 준비물', '주의사항'].map((tab) => (
          <Tab
            key={tab}
            active={activeTab === tab}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </Tab>
        ))}
      </Tabs>

      {tabContent[activeTab as keyof typeof tabContent]}
    </Container>
  );
};

const Container = styled.div`
  margin: 0px 20px;
  margin-top: 57px;
  position: relative;
`;

const NavCenter = styled.div`
  color: ${({ theme }) => theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.title20};
  font-weight: ${({ theme }) => theme.font.fontWeight.bold};
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
  background: ${({ theme }) => theme.colors.white};

  margin: 0 -20px;
  padding: 0px 20px;
  position: fixed;
  top: 56px;
  left: 0;
  right: 0;
  z-index: 1;
`;

const Tab = styled.div<{ active: boolean }>`
  padding: 8px;
  display: flex;
  justify-content: space-between;
  text-align: center;
  cursor: pointer;
  color: ${({ theme, active }) =>
    active ? theme.colors.red600 : theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.detail12};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  border-bottom: ${({ active }) => (active ? '2px solid #D4182E' : '')};
`;
