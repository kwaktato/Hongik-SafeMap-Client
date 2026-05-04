import styled from 'styled-components';

interface NavbarProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
}

export const NavBar = ({ left, center, right }: NavbarProps) => {
  return (
    <NavbarWrapper>
      <NavLeft>{left}</NavLeft>
      <NavCenter>{center}</NavCenter>
      <NavRight>{right}</NavRight>
    </NavbarWrapper>
  );
};

const NavbarWrapper = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
  z-index: 1;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
`;

const NavLeft = styled.div`
  padding-left: 20px;
  flex: 1;
  display: flex;
  justify-content: flex-start;
`;

const NavCenter = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  white-space: nowrap;

  color: ${({ theme }) => theme.colors.gray900};
  font-size: ${({ theme }) => theme.font.fontSize.title20};
  font-weight: ${({ theme }) => theme.font.fontWeight.bold};
`;

const NavRight = styled.div`
  padding-right: 20px;
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;
