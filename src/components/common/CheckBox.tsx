import styled from 'styled-components';

interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  color?: string;
}

export const CheckBox = ({
  label,
  width = '24px',
  height = '24px',
  borderRadius = '6px',
  color = '',
  ...props
}: CheckBoxProps) => {
  return (
    <CheckBoxWrapper>
      <CheckHidden type="checkbox" {...props} />
      <CheckIcon
        width={width}
        height={height}
        color={color}
        borderRadius={borderRadius}
      />
      {label && <div className="label">{label}</div>}
    </CheckBoxWrapper>
  );
};

const CheckBoxWrapper = styled.label`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  position: relative;

  // 마우스가 체크박스를 눌러도 부모가 클릭된 것처럼 패스(드롭다운)
  &[readonly],
  input[readonly] ~ * {
    pointer-events: none;
  }
`;

const CheckHidden = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
`;

const CheckIcon = styled.span<{
  width: string;
  height: string;
  color: string;
  borderRadius: string;
}>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  // display: flex;
  // align-items: center;
  // justify-content: center;
  border-radius: ${({ borderRadius }) => borderRadius};
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};
  transition: all 0.2s ease-in-out;
  position: relative;

  &::before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    width: 30%;
    height: 55%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -65%) rotateZ(45deg);
    transition: opacity 0.2s ease-in-out;
    border-right: 2px solid ${({ theme }) => theme.colors.gray600};
    border-bottom: 2px solid ${({ theme }) => theme.colors.gray600};
    border-bottom-right-radius: 1.5px;
  }

  ${CheckHidden}:checked + & {
    background-color: ${({ theme, color }) =>
      color === 'black' ? theme.colors.gray900 : theme.colors.red600};
    border-color: ${({ theme, color }) =>
      color === 'black' ? theme.colors.gray900 : theme.colors.red600};

    &::before {
      opacity: 1;
      border-color: ${({ theme }) => theme.colors.white};
    }
  }
`;
