import { styled } from 'styled-components';

interface ProgressBarProps {
  percent: number;
}

export const ProgressBar = ({ percent }: ProgressBarProps) => {
  return (
    <ProgressBarWrapper>
      <ProgressBarFill percent={percent}></ProgressBarFill>
    </ProgressBarWrapper>
  );
};

const ProgressBarWrapper = styled.div`
  width: 100%;
  height: 10px;
  background: ${({ theme }) => theme.colors.gray300};
  border-radius: 50%;
`;

const ProgressBarFill = styled.div<{ percent: number }>`
  width: ${({ percent }) => percent}%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.gray1000};
  border-radius: 50%;
  transition: width 0.3s ease-in-out;
`;
