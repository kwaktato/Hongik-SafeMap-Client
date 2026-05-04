import { styled } from 'styled-components';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

export const Toggle = ({ checked, onChange }: ToggleProps) => {
  return (
    <ToggleWrapper onClick={onChange}>
      <ToggleLabel checked={checked}></ToggleLabel>
    </ToggleWrapper>
  );
};

const ToggleWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 55px;
  height: 30px;
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
  border-radius: 15px;
  transition: background-color 0.3s;

  &::before {
    position: absolute;
    content: '';
    height: 26px;
    width: 26px;
    bottom: 2px;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 50%;
    transition: transform 0.3s;
    transform: ${({ checked }) =>
      checked ? 'translateX(27px)' : 'translateX(2px)'};
  }
`;
