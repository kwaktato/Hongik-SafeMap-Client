import styled from 'styled-components';
import { useEffect, useState } from 'react';
import {
  useAdminSafetyTipsByDisasterType,
  useCreateDisasterTypeMutation,
  useUpdateDisasterTypeMutation,
} from '@/api/admin';
import { Button } from '@/components/common/Button';
import { InputBox } from '@/components/common/InputBox';
import { Toast } from '@/components/common/Toast';
import { ContentGuideAction } from '@/components/admin/settings/Content/Guide/ContentGuideAction';
import { ContentGuideSupply } from '@/components/admin/settings/Content/Guide/ContentGuideSupply';
import { ContentGuideWarning } from '@/components/admin/settings/Content/Guide/ContentGuideWarning';
import { DisasterIconUpload } from '@/components/admin/settings/Content/Guide/DisasterIconUpload';
import { useDisasterIconUpload } from '@/hooks/useDisasterIconUpload';
import type { MediaItem } from '@/types/common';
import type { DisasterTypeRequest } from '@/types/SafetyTips';

interface ContentGuideProps {
  selectedId: number;
  onClose: () => void;
}

export const ContentDetail = ({ selectedId, onClose }: ContentGuideProps) => {
  const initialForm: DisasterTypeRequest = {
    name: '',
    iconUrl: '',
    safetyTip: {
      title: '',
      detail: '',
      supplies: [''],
      warnings: [''],
      actions: [{ title: '', guide: '' }],
    },
  };

  const [form, setForm] = useState<DisasterTypeRequest>(initialForm);
  const [icon, setIcon] = useState<MediaItem | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1500);
  };

  const { data: safetyTip } = useAdminSafetyTipsByDisasterType(selectedId);
  const { uploadToS3 } = useDisasterIconUpload();
  const { mutate: createMutation } = useCreateDisasterTypeMutation();
  const { mutate: updateMutation } = useUpdateDisasterTypeMutation(selectedId);

  useEffect(() => {
    if (selectedId && safetyTip) {
      setForm({
        name: safetyTip.disasterType.name,
        iconUrl: safetyTip.disasterType.iconUrl,
        safetyTip: {
          title: safetyTip.title,
          detail: safetyTip.detail,
          supplies: safetyTip.supplies,
          warnings: safetyTip.warnings,
          actions: safetyTip.actions.map((action) => ({
            title: action.title,
            guide: action.guide || '',
          })),
        },
      });
    } else if (!selectedId) {
      setForm(initialForm);
    }
  }, [safetyTip, selectedId]);

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateSafetyTip = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      safetyTip: { ...prev.safetyTip, [field]: value },
    }));
  };

  const handleSaveClick = async () => {
    let finalIconUrl = form.iconUrl;

    if (icon?.file) {
      try {
        finalIconUrl = await uploadToS3(icon.file);
      } catch (e) {
        alert('이미지 업로드 실패');
        return;
      }
    }

    const finalForm = { ...form, iconUrl: finalIconUrl };

    if (selectedId) {
      updateMutation(finalForm, {
        onSuccess: () => {
          onClose();
          showToast('재난 유형 및 행동 요령을 수정했습니다');
        },
      });
    } else {
      createMutation(finalForm, {
        onSuccess: () => {
          onClose();
          showToast('재난 유형 및 행동 요령이 등록되었습니다');
        },
      });
    }
  };

  return (
    <Container>
      <InfoWrapper>
        <div className="section-title">재난 유형</div>
        <div className="info">
          <DisasterIconUpload
            uploadedFile={icon}
            setUploadedFile={setIcon}
            defaultIcon={safetyTip?.disasterType.iconUrl}
          />

          <InputBox
            title="설명"
            width="220px"
            placeholder="재난의 이름을 입력하세요"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
        </div>
      </InfoWrapper>

      <InfoWrapper>
        <div className="section-title">행동 요령</div>
        <div className="info">
          <InputBox
            title="제목"
            width="280px"
            placeholder="행동요령의 제목을 입력하세요"
            value={form.safetyTip.title}
            onChange={(e) => updateSafetyTip('title', e.target.value)}
          />

          <InputBox
            title="설명"
            width="640px"
            placeholder="행동요령의 설명을 입력하세요"
            value={form.safetyTip.detail}
            onChange={(e) => updateSafetyTip('detail', e.target.value)}
          />
        </div>
      </InfoWrapper>

      <DetailWrapper>
        <ContentGuideAction
          actions={form.safetyTip.actions}
          setActions={(val) => updateSafetyTip('actions', val)}
        />
        <div className="right">
          <ContentGuideSupply
            supplies={form.safetyTip.supplies}
            setSupplies={(val) => updateSafetyTip('supplies', val)}
          />
          <div className="border" />
          <ContentGuideWarning
            warnings={form.safetyTip.warnings}
            setWarnings={(val) => updateSafetyTip('warnings', val)}
          />
        </div>
      </DetailWrapper>

      <Button variant="red" height="60px" onClick={handleSaveClick}>
        행동 요령 저장
      </Button>

      {toastMessage && <Toast text={toastMessage} />}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .section-title {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title24};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .info {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .input {
    color: ${({ theme }) => theme.colors.red600};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }
`;

const DetailWrapper = styled.div`
  display: flex;
  gap: 60px;

  .right {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .border {
    height: 1px;
    background: ${({ theme }) => theme.colors.gray300};
  }
`;
