import styled from 'styled-components';
import Clock from '@/assets/icons/ClockXS.svg?react';
import Position from '@/assets/icons/PositionXS.svg?react';
import Comment from '@/assets/icons/MessageXS.svg?react';
import { Tag } from '@/components/common/Tag';
import type { MissingPost, ResourcePost } from '@/types/Post';
import { formatRelativeTime } from '@/utils/formatDate';
import { formatTextTruncate } from '@/utils/formatText';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';
import type {
  MissingStatus,
  ResourceStatus,
  ResourceType,
} from '@/types/common';

interface TagProps {
  variant: 'red' | 'blue' | 'black';
  label: string;
}

interface PostCardProps {
  post: ResourcePost | MissingPost;
}

export const PostCard = ({ post }: PostCardProps) => {
  const { handleNavigate } = useHandleNavigate();

  const getTagProps = (
    status: ResourceStatus | MissingStatus,
    type?: ResourceType,
    category?: string,
  ): TagProps => {
    if (status === '마감') {
      return { variant: 'black', label: '마감' };
    }
    if (status === '발견됨') {
      return { variant: 'black', label: '해결' };
    }

    if (type) {
      return {
        variant: type === '요청' ? 'red' : 'blue',
        label: type,
      };
    }

    if (status === '찾는 중') {
      let label = '찾는 중';
      if (category === '사람' || category === '반려동물') label = '실종';
      if (category === '소지품') label = '분실';

      return { variant: 'red', label };
    }

    return {
      variant: 'black',
      label: status,
    };
  };

  const isResourcePost = (
    post: ResourcePost | MissingPost,
  ): post is ResourcePost => {
    return 'type' in post;
  };

  const type = isResourcePost(post) ? post.type : undefined;
  const location = isResourcePost(post) ? post.location : post.currentLocation;

  const { variant, label } = getTagProps(post.status, type, post.category);

  return (
    <Container
      onClick={() =>
        handleNavigate(
          `/user/${isResourcePost(post) ? 'resource' : 'missing'}/${post.id}`,
        )
      }
    >
      <ContentWrapper>
        <div className="top">
          <div className="left">
            <div className="first">{post.memberName.slice(0, 1)}</div>
            <div className="info">
              <div className="author">{post.memberName}</div>
              <div className="time">
                <Clock />
                {formatRelativeTime(post.createdAt)}
              </div>
            </div>
          </div>
          <div className="tags">
            <Tag variant="white">{post.category}</Tag>
            <Tag variant={variant}>{label}</Tag>
          </div>
        </div>
        <div className="text">
          <div className="title">{post.title}</div>
          <div className="content">
            {formatTextTruncate(post.description, 60)}
          </div>
        </div>
      </ContentWrapper>

      <div className="border" />

      <InfoWrapper>
        <div className="left">
          <div className="icon">
            <Position />
            {location}
          </div>
          <div className="icon">
            <Comment />
            {post.commentCount ?? 0}
          </div>
        </div>
        <div className="status">
          <Circle status={post.status} />
          {post.status}
        </div>
      </InfoWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.white};
  border: 1.5px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 8px;

  .border {
    height: 1px;
    background: ${({ theme }) => theme.colors.gray300};
  }
`;

const ContentWrapper = styled.div`
  padding: 24px 20px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex: 1;

  .top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .left {
    display: flex;
    gap: 8px;
  }

  .first {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.colors.gray300};
    color: ${({ theme }) => theme.colors.gray900};
    font-size: ${({ theme }) => theme.font.fontSize.body18};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .author {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .time {
    display: flex;
    align-items: center;
    gap: 2px;

    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .tags {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .title {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.title20};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .content {
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const InfoWrapper = styled.div`
  padding: 16px 24px 20px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .icon {
    display: flex;
    align-items: center;
    gap: 2px;

    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .status {
    display: flex;
    align-items: center;
    gap: 6px;

    color: ${({ theme }) => theme.colors.gray900};
    font-size: ${({ theme }) => theme.font.fontSize.body14};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const Circle = styled.div<{ status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case '진행 중':
      case '찾는 중':
        return theme.colors.green600;
      case '대기 중':
        return theme.colors.yellow600;
      case '발견됨':
        return theme.colors.blue600;
      case '마감':
        return theme.colors.gray700;
      default:
        return theme.colors.gray700;
    }
  }};
`;
