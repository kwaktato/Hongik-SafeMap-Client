import styled from 'styled-components';
import { useState } from 'react';
import Close from '@/assets/icons/TextRemove.svg?react';
import Approve from '@/assets/icons/ExactS.svg?react';
import Blind from '@/assets/icons/HideS.svg?react';
import { useUpdateReportStatusMutation } from '@/api/admin';
import { Button } from '@/components/common/Button';
import { Toast } from '@/components/common/Toast';
import type { AdminReport } from '@/types/Admin';
import type { DisasterReportStatus } from '@/types/common';

interface ReviewSectionProps {
  report: AdminReport;
}

export const ReviewSection = ({ report }: ReviewSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const [reviewComment, setReviewComment] = useState('');
  const hasExistingReview = !!report.reviewComment;

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1500);
  };

  const { mutate: updateStatus } = useUpdateReportStatusMutation(
    report.reportId,
  );

  const handleUpdateStatus = (status: DisasterReportStatus) => {
    if (!reviewComment.trim()) {
      alert('검토 의견을 입력해주세요.');
      return;
    }

    updateStatus(
      { status, reviewComment },
      {
        onSuccess: () => {
          setIsEditing(false);
          showToast('검토 처리가 완료되었습니다.');
        },
        onError: () => {
          alert('해당 제보에 대한 검토를 등록하지 못했습니다.');
        },
      },
    );
  };

  const handleCancelEdit = () => {
    setReviewComment(report.reviewComment || '');
    setIsEditing(false);
  };

  return (
    <ReviewBoxWrapper>
      <div className="review-top">
        <div>검토 의견</div>

        <div className="remove">
          {(isEditing || !hasExistingReview) && reviewComment && (
            <Close onClick={() => setReviewComment('')} />
          )}
        </div>

        {isEditing || !hasExistingReview ? (
          <ReviewBox
            id="review"
            typeof="text"
            placeholder="검토 의견을 입력하세요"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          />
        ) : (
          <div className="review">{report.reviewComment}</div>
        )}
      </div>

      {isEditing || !hasExistingReview ? (
        <div className="buttons">
          <Button variant="white" onClick={() => handleUpdateStatus('승인')}>
            <Approve />
            승인
          </Button>
          <Button
            variant="white"
            onClick={() => handleUpdateStatus('블라인드')}
          >
            <Blind />
            블라인드
          </Button>
          {hasExistingReview && (
            <Button variant="black" onClick={handleCancelEdit}>
              취소
            </Button>
          )}
        </div>
      ) : (
        <Button variant="white" onClick={() => setIsEditing(true)}>
          수정하기
        </Button>
      )}

      {toastMessage && <Toast text={toastMessage} />}
    </ReviewBoxWrapper>
  );
};

const ReviewBoxWrapper = styled.div`
  padding: 16px 20px 28px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .review-top {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    position: relative;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .remove {
    position: absolute;
    top: 40px;
    right: 8px;
  }

  .review {
    padding: 10px 16px;
    box-sizing: border-box;
    width: 100%;
    background: ${({ theme }) => theme.colors.gray300};
    border-radius: 8px;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .buttons {
    display: flex;
    gap: 8px;
  }

  svg {
    cursor: pointer;
  }
`;

const ReviewBox = styled.textarea`
  padding: 10px 16px;
  width: 100%;
  height: 120px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.gray300};
  resize: none;
  box-sizing: border-box;
  border: none;
  word-break: break-all;

  color: ${({ theme }) => theme.colors.gray1000};
  font-size: ${({ theme }) => theme.font.fontSize.body16};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray600};
  }

  &:focus {
    outline: none;
  }

  /* 1. 전체 스크롤바 너비 */
  &::-webkit-scrollbar {
    width: 12px;
  }

  /* 2. 스크롤바 트랙 (바탕) */
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* 3. 스크롤바 막대 (움직이는 부분) */
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray500};
    border-radius: 12px;
    border: 4px solid ${({ theme }) => theme.colors.gray300};
  }

  & {
    scrollbar-gutter: stable; /* 스크롤바가 생겨도 본문이 밀리지 않게 고정 (최신 브라우저) */
  }
`;
