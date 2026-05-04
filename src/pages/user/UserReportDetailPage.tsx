import styled from 'styled-components';
import Back from '@/assets/icons/ChevronLeft.svg?react';
import { NavBar } from '@/components/common/NavBar';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';
import { Statistics } from '@/components/user/report/Statistics';
import { Rating } from '@/components/user/report/Rating';
import { Description } from '@/components/user/report/Description';
import { useReportDetail, useReportEvaluation } from '@/api/report';
import { useParams } from 'react-router-dom';
import { ReportImage } from '@/components/user/report/ReportImage';
import { Trust } from '@/components/user/report/Trust';

export const UserReportDetailPage = () => {
  const { handleGoBack } = useHandleNavigate();

  const { id } = useParams<{ id: string }>();
  const reportId = Number(id);

  const { data: report } = useReportDetail(reportId);
  const { data: evaluation } = useReportEvaluation(reportId);

  const people =
    (evaluation?.helpfulCount ?? 0) + (evaluation?.notHelpfulCount ?? 0);

  return (
    <Container>
      <NavBar left={<Back onClick={handleGoBack} />} />

      <ReportWrapper>
        <Description report={report} />

        <ImageWrapper>
          {report?.fileUrls &&
            report.fileUrls.map((url, index) => (
              <ReportImage key={index} url={url} />
            ))}
        </ImageWrapper>

        <div className="border" />

        <SectionWrapper>
          <div className="title">평가 통계</div>
          <Statistics evaluation={evaluation} />
          <div className="gray">{people}명의 사용자 평가 기반</div>
        </SectionWrapper>

        <div className="border" />

        <SectionWrapper>
          <div className="title">신뢰도 점수</div>
          <Trust trustScore={report?.trustScore} />
        </SectionWrapper>
      </ReportWrapper>

      <Border />

      <Rating reportId={reportId} evaluation={evaluation} />
    </Container>
  );
};

const Container = styled.div`
  // margin: 56px 20px 0px 20px;
  margin-top: 56px;

  .title {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }
`;

const ReportWrapper = styled.div`
  padding: 0px 20px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  .border {
    height: 1px;
    background: ${({ theme }) => theme.colors.gray300};
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  overflow-x: scroll;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Border = styled.div`
  height: 12px;
  background: ${({ theme }) => theme.colors.gray300};
`;
