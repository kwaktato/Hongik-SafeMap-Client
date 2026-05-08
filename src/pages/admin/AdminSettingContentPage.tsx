import styled from 'styled-components';
import Warning from '@/assets/icons/Warning.svg?react';
import Information from '@/assets/icons/Information.svg?react';
import { SettingSection } from '@/components/admin/settings/SettingSection';
import { ContentTerm } from '@/components/admin/settings/Content/Term/ContentTerm';
import { ContentSection } from '@/components/admin/settings/Content/Guide/ContentSection';

export const AdminSettingContentPage = () => {
  return (
    <Container>
      <SettingSection
        icon={<Warning />}
        title="재난 유형 관리"
        description="앱에서 다루는 재난 유형 추가 및 수정"
      >
        <ContentSection />
      </SettingSection>

      <div className="border" />

      <SettingSection
        icon={<Information />}
        title="약관 및 정책 관리"
        description="이용약관 및 개인정보 처리방침 편집"
      >
        <ContentTerm />
      </SettingSection>
    </Container>
  );
};

const Container = styled.div`
  padding-top: 28px;
  display: flex;
  flex-direction: column;
  justify-content: spcae-between;
  gap: 48px;
  border-top: 1px solid ${({ theme }) => theme.colors.gray400};

  .border {
    height: 1px;
    background: ${({ theme }) => theme.colors.gray400};
  }
`;
