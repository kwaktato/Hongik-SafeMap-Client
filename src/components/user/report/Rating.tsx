import styled from 'styled-components';
import { useState } from 'react';
import Helpful from '@/assets/icons/HelpfulS.svg?react';
import Useless from '@/assets/icons/UselessS.svg?react';
import { Button } from '@/components/common/Button';
import { Toast } from '@/components/common/Toast';
import type { ReportEvaluationResponse } from '@/types/Report';
import {
  useDeleteEvaluationMutation,
  useReportAccusationMutation,
  useReportEvaluationMutation,
} from '@/api/report';

interface RatingProps {
  reportId: number;
  evaluation: ReportEvaluationResponse | undefined;
}

export const Rating = ({ reportId, evaluation }: RatingProps) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { mutate: postEvaluation } = useReportEvaluationMutation(reportId);
  const { mutate: deleteEvaluation } = useDeleteEvaluationMutation(reportId);
  const { mutate: postAccusation } = useReportAccusationMutation(reportId);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1500);
  };

  const handleEvaluationClick = (evaluationType: '도움됨' | '도움 안됨') => {
    const isCurrentActive =
      evaluationType === '도움됨'
        ? evaluation?.userEvaluatedHelpful
        : evaluation?.userEvaluatedNotHelpful;

    if (isCurrentActive) {
      deleteEvaluation(undefined, {
        onSuccess: () => showToast('평가가 취소되었습니다.'),
        onError: () => alert('평가 취소에 실패했습니다.'),
      });
    } else {
      postEvaluation(evaluationType, {
        onSuccess: () => showToast(`${evaluationType}으로 평가했습니다.`),
        onError: () => alert('평가 등록에 실패했습니다.'),
      });
    }
  };

  const handleAccusationClick = () =>
    postAccusation(undefined, {
      onSuccess: () => showToast('허위 제보로 신고했습니다.'),
      onError: () => alert('허위 제보에 실패했습니다.'),
    });

  return (
    <RatingWrapper>
      <RatingSection>
        <div>
          <div className="title">이 제보 평가하기</div>
          <div>정확한 평가가 더 나은 재난 정보 공유에 도움이 됩니다.</div>
        </div>
        <div className="buttons">
          <Button
            variant={evaluation?.userEvaluatedHelpful ? 'black' : 'white'}
            onClick={() => handleEvaluationClick('도움됨')}
          >
            <Helpful />
            <span>도움됨</span>
          </Button>
          <Button
            variant={evaluation?.userEvaluatedNotHelpful ? 'black' : 'white'}
            onClick={() => handleEvaluationClick('도움 안됨')}
          >
            <Useless />
            <span>도움 안됨</span>
          </Button>
        </div>
      </RatingSection>

      <ReportSection>
        <Button variant="red" onClick={handleAccusationClick}>
          허위 제보 신고
        </Button>
        <div>명백한 허위 정보나 악의적인 제보만 신고해주세요.</div>
      </ReportSection>

      {toastMessage && <Toast text={toastMessage} />}
    </RatingWrapper>
  );
};

const RatingWrapper = styled.div`
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RatingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  color: ${({ theme }) => theme.colors.gray800};
  font-size: ${({ theme }) => theme.font.fontSize.body14};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  .buttons {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const ReportSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.font.fontSize.body14};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  text-align: center;
`;
