import { styled } from 'styled-components';

interface PlayBarProps {
  percent: number;
}

export const PlayBar = ({ percent }: PlayBarProps) => {
  return (
    <PlayBarWrapper>
      <PlayBarFill percent={percent}>
        <Dot />
      </PlayBarFill>
    </PlayBarWrapper>
  );
};

const PlayBarWrapper = styled.div`
  width: 100%;
  height: 10px;
  background: ${({ theme }) => theme.colors.gray300};
  border-radius: 50%;
  position: relative;
`;

const PlayBarFill = styled.div<{ percent: number }>`
  width: ${({ percent }) => percent}%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.red600};
  border-radius: 50%;
  transition: width 0.3s ease-in-out;
`;

const Dot = styled.div`
  width: 26px;
  height: 26px;
  background-color: ${({ theme }) => theme.colors.red600};
  border-radius: 50%;

  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(50%, -50%);
`;
