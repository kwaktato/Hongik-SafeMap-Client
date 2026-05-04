import styled from 'styled-components';
import { ActionCard } from '@/components/user/guide/ActionCard';
import type { Actions } from '@/types/SafetyTips';

interface ActionSectionProps {
  guides: Actions[] | undefined;
}

export const ActionSection = ({ guides }: ActionSectionProps) => {
  if (!guides || guides.length === 0) {
    return null;
  }

  return (
    <SectionWrapper>
      {guides?.map((guide, index) => (
        <ActionCard key={index} index={index} guide={guide} />
      ))}
    </SectionWrapper>
  );
};

const SectionWrapper = styled.div`
  margin: 20px 0px;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;
