import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import ModalClose from '@/assets/icons/Exit.svg?react';
import Plus from '@/assets/icons/PlusS.svg?react';
import {
  useCreatePrivacyPolicy,
  useCreateTerms,
  useUpdatePrivacyPolicy,
  useUpdateTerms,
} from '@/api/term';
import { Button } from '@/components/common/Button';
import { ContentTermSection } from '@/components/admin/settings/Content/Term/ContentTermSection';
import { InputBox } from '@/components/common/InputBox';
import type { Term } from '@/types/Term';

interface ContentTermModalProps {
  onClose: () => void;
  type: string;
  initialTerms: Term | undefined;
}

export const ContentTermModal = ({
  onClose,
  type,
  initialTerms,
}: ContentTermModalProps) => {
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('');
  const [sections, setSections] = useState([
    { id: 0, header: '', content: '' },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTerms) {
      setTitle(initialTerms.title);
      setVersion(initialTerms.version);
      setSections(
        initialTerms.sections.map((section, index) => ({
          id: index,
          header: section.header,
          content: section.content,
        })),
      );
    } else {
      setTitle('');
      setVersion('0.0');
      setSections([{ id: 0, header: '', content: '' }]);
    }
  }, [initialTerms]);

  const { mutate: createTerms } = useCreateTerms();
  const { mutate: updateTerms } = useUpdateTerms();

  const { mutate: createPrivacy } = useCreatePrivacyPolicy();
  const { mutate: updatePrivacy } = useUpdatePrivacyPolicy();

  const handleUpdate = (id: number, header: string, content: string) => {
    setSections((prev) =>
      prev.map((t) => (t.id === id ? { ...t, header, content } : t)),
    );
  };

  const handleDelete = (id: number) => {
    if (sections.length <= 1) return;
    setSections((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAdd = () => {
    const newId =
      sections.length > 0 ? Math.max(...sections.map((t) => t.id)) + 1 : 0;
    setSections([...sections, { id: newId, header: '', content: '' }]);

    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 0);
  };

  const handleSave = () => {
    if (Number(version) < Number(initialTerms?.version))
      return alert('현재 버전보다 큰 숫자를 입력해주세요.');

    const request: Term = {
      version,
      title,
      date: new Date().toISOString().split('T')[0],
      sections: sections.map(({ header, content }) => ({ header, content })),
    };

    if (type === '이용약관') {
      if (version !== initialTerms?.version) {
        createTerms(request, { onSuccess: onClose });
      } else {
        updateTerms(request, { onSuccess: onClose });
      }
    } else {
      if (version !== initialTerms?.version) {
        createPrivacy(request, { onSuccess: onClose });
      } else {
        updatePrivacy(request, { onSuccess: onClose });
      }
    }
  };

  return (
    <ModalWrapper>
      <div className="top">
        <div>{type} 조항 편집</div>
        <ModalClose onClick={onClose} />
      </div>

      <div className="inputs">
        <InputBox
          title="제목"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <InputBox
          title="버전"
          placeholder="버전을 입력하세요(예: 1.0)"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
        />
      </div>

      <div className="terms" ref={scrollRef}>
        {sections?.map((section, index) => (
          <ContentTermSection
            key={section.id}
            term={section}
            canDelete={sections.length > 1}
            onUpdate={(id, header, content) =>
              handleUpdate(id, header, content)
            }
            onDelete={() => handleDelete(section.id)}
            autoFocus={index === sections.length - 1 && section.header === ''}
          />
        ))}
      </div>

      <Button variant="white" style={{ flexShrink: '0' }} onClick={handleAdd}>
        <Plus />
        <span>새로운 조항 추가</span>
      </Button>

      <Button variant="red" style={{ flexShrink: '0' }} onClick={handleSave}>
        저장
      </Button>
    </ModalWrapper>
  );
};

const ModalWrapper = styled.div`
  width: 600px;
  max-height: 75vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 12px;

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title24};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .inputs {
    width: 100%;
    display: flex;
    gap: 16px;

    & > div {
      flex: 1;
    }
  }

  svg {
    cursor: pointer;
  }

  .terms {
    padding-right: 4px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;

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
      border: 4px solid ${({ theme }) => theme.colors.white};
    }

    & {
      scrollbar-gutter: stable; /* 스크롤바가 생겨도 본문이 밀리지 않게 고정 (최신 브라우저) */
    }
  }
`;
