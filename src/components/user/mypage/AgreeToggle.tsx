import { styled } from 'styled-components';

interface AgreeToggleProps {
  checked: boolean;
  onChange: () => void;
}

export const AgreeToggle = ({ checked, onChange }: AgreeToggleProps) => {
  return (
    <ToggleWrapper onClick={onChange}>
      <ToggleLabel checked={checked}></ToggleLabel>
    </ToggleWrapper>
  );
};

const ToggleWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 28px;
  height: 16px;
  cursor: pointer;
`;

const ToggleLabel = styled.div<{ checked: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme, checked }) =>
    checked ? theme.colors.gray900 : theme.colors.gray400};
  border-radius: 8px;
  transition: background-color 0.3s;

  &::before {
    position: absolute;
    content: '';
    height: 12px;
    width: 12px;
    top: 2px;
    left: 2px;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 50%;
    transition: transform 0.3s;
    transform: ${({ checked }) =>
      checked ? 'translateX(12px)' : 'translateX(0)'};
  }
`;
