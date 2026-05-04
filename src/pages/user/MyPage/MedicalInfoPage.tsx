import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import Exit from '@/assets/icons/Exit.svg?react';
import HideIcon from '@/assets/icons/HideS.svg?react';
import ShowIcon from '@/assets/icons/ShowS.svg?react';
import MedicalIcon from '@/assets/icons/Medical.svg?react';
import Safe from '@/assets/icons/SafeS.svg?react';
import { useMedicalInfo, useUpdateMedicalInfoMutation } from '@/api/mypage';
import { NavBar } from '@/components/common/NavBar';
import { TitleMainSub } from '@/components/common/TitleHeader';
import { Button } from '@/components/common/Button';
import { InputBox } from '@/components/common/InputBox';
import { Dropdown } from '@/components/common/Dropdown';
import { Toast } from '@/components/common/Toast';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';
import type { MedicalInfoRequest, MedicalInfoResponse } from '@/types/Mypage';
import { Tag } from '@/components/common/Tag';

export const MedicalInfoPage = () => {
  const { handleGoBack } = useHandleNavigate();

  const [isMedicalOpen, setIsMedicalOpen] = useState(false);
  const [sensitiveInfo, setSensitiveInfo] = useState<MedicalInfoResponse>();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1500);
  };

  const { data } = useMedicalInfo();

  useEffect(() => {
    if (data) {
      setSensitiveInfo(data);
    }
  }, [data]);

  const { mutate: updateMedicalInfo } = useUpdateMedicalInfoMutation();

  const handleMedicalChange = useCallback(
    (
      field: keyof Omit<MedicalInfoResponse, 'sensitiveInfoId'>,
      value: string,
    ) => {
      setSensitiveInfo((prev) => {
        const base = prev || {
          sensitiveInfoId: 0,
          bloodType: '',
          allergies: '',
          chronicDiseases: '',
          medications: '',
        };
        return { ...base, [field]: value };
      });
    },
    [],
  );

  const handleEditMedical = () => {
    const request: MedicalInfoRequest = {
      bloodType: sensitiveInfo?.bloodType || 'A+',
      allergies: sensitiveInfo?.allergies || '',
      chronicDiseases: sensitiveInfo?.chronicDiseases || '',
      medications: sensitiveInfo?.medications || '',
    };

    updateMedicalInfo(request, {
      onSuccess: () => showToast('의료 정보가 수정되었습니다.'),
      onError: () => alert('의료 정보 수정을 실패했습니다.'),
    });
  };

  return (
    <Container>
      <NavBar
        center={
          <TitleMainSub
            main="의료 정보"
            sub="긴급 구조 시 필요한 의료 정보입니다"
            align="center"
          />
        }
        right={<Exit onClick={handleGoBack} />}
      />

      <Tag
        variant={isMedicalOpen ? 'black' : 'white'}
        iconTag={true}
        onClick={() => setIsMedicalOpen((prev) => !prev)}
        style={{
          width: '92px',
        }}
      >
        {isMedicalOpen ? <HideIcon /> : <ShowIcon />}의료 정보 보기
      </Tag>

      <Medical isMedicalOpen={isMedicalOpen}>
        {isMedicalOpen ? (
          <Show>
            <div className="dropdown">
              <div className="blood">혈액형</div>
              <Dropdown
                title="혈액형"
                options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
                selectedOption={sensitiveInfo?.bloodType || 'A+'}
                setSelectedOption={(option: string) => {
                  handleMedicalChange('bloodType', option);
                }}
              />
            </div>
            <InputBox
              title="알레르기"
              placeholder="예) 페니실린"
              value={sensitiveInfo?.allergies}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleMedicalChange('allergies', e.target.value)
              }
            />
            <InputBox
              title="기저 질환"
              placeholder="예) 고혈압"
              value={sensitiveInfo?.chronicDiseases}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleMedicalChange('chronicDiseases', e.target.value)
              }
            />
            <InputBox
              title="복용 약물"
              placeholder="예) 혈압약"
              value={sensitiveInfo?.medications}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleMedicalChange('medications', e.target.value)
              }
            />
          </Show>
        ) : (
          <Hide>
            <MedicalIcon />
            <div>
              의료 정보가 숨겨져 있습니다
              <br />
              좌측 상단의 눈 아이콘을 클릭하여 정보를 확인하세요
            </div>
          </Hide>
        )}
      </Medical>

      <Bottom>
        <Guide>
          <Safe />
          <span>
            작성하신 정보는 긴급 상황에서만 사용되며 암호화되어 안전하게
            보관됩니다.
          </span>
        </Guide>

        <Button variant="red" onClick={handleEditMedical}>
          의료 정보 저장
        </Button>
      </Bottom>

      {toastMessage && <Toast text={toastMessage} />}
    </Container>
  );
};

const Container = styled.div`
  padding: 76px 20px 144px 20px;

  min-height: 100dvh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const Medical = styled.div<{ isMedicalOpen: boolean }>`
  padding: 20px 0px;

  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: ${({ isMedicalOpen }) =>
    isMedicalOpen ? 'flex-start' : 'center'};
`;

const Show = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;

  .dropdown {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .blood {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const Hide = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.font.fontSize.body14};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};
`;

const Guide = styled.div`
  padding: 8px 12px;
  display: flex;
  gap: 4px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.blue100};
  color: ${({ theme }) => theme.colors.blue600};
  font-size: ${({ theme }) => theme.font.fontSize.detail12};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  span {
    padding-top: 4px;
  }
`;

const Bottom = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
`;
