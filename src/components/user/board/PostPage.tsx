import styled from 'styled-components';
import { useState } from 'react';
import Clock from '@/assets/icons/ClockXS.svg?react';
import Position from '@/assets/icons/PositionXS.svg?react';
import Pencil from '@/assets/icons/WriteS.svg?react';
import SendIcon from '@/assets/icons/Send.svg?react';
import {
  useCreateCommentMutation,
  useUpdatePostStatusMutation,
} from '@/api/board';
import { Tag } from '@/components/common/Tag';
import { DropdownStatus } from '@/components/common/DropdownStatus';
import { Button } from '@/components/common/Button';
import { InputBox } from '@/components/common/InputBox';
import type { CommentResponse, MissingPost, ResourcePost } from '@/types/Post';
import { formatRelativeTime } from '@/utils/formatDate';
import { formatTextTruncate } from '@/utils/formatText';
import type {
  MissingStatus,
  ResourceStatus,
  ResourceType,
} from '@/types/common';
import { DropdownBoard } from '@/components/common/DropdownBoard';

interface TagProps {
  variant: 'red' | 'blue' | 'black';
  label: string;
}

interface PostCardProps {
  statusOptions: string[];
  post: ResourcePost | MissingPost;
  comments: CommentResponse;
}

export const PostPage = ({ statusOptions, post, comments }: PostCardProps) => {
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

  const isMissingPost = (
    post: ResourcePost | MissingPost,
  ): post is MissingPost => {
    return 'age' in post;
  };

  const [comment, setComment] = useState('');

  const type = isMissingPost(post) ? undefined : post.type;
  const location = isMissingPost(post) ? post.currentLocation : post.location;

  const { variant, label } = getTagProps(post.status, type, post.category);

  const { mutate: updateStatus } = useUpdatePostStatusMutation(
    isMissingPost(post) ? 'missing' : 'resource',
    post.id,
  );

  const { mutate: postComment } = useCreateCommentMutation(
    isMissingPost(post) ? 'missing' : 'resource',
    post.id,
  );

  const handleCommentClick = async () => {
    if (comment.length > 0) {
      postComment(
        { content: comment },
        {
          onSuccess: () => {
            setComment('');
          },
        },
      );
    }
  };

  return (
    <Container>
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

        {post.isAuthor && (
          <MyPost>
            <DropdownStatus
              title="상태"
              options={statusOptions}
              selectedOption={post.status}
              setSelectedOption={(option: string) => {
                if (option !== post.status) {
                  updateStatus({ status: option });
                }
              }}
            />

            <DropdownBoard
              path={isMissingPost(post) ? 'missing' : 'resource'}
            />
          </MyPost>
        )}

        <div className="text">
          <div className="title">{post.title}</div>
          <div className="content">
            {formatTextTruncate(post.description, 60)}
          </div>
        </div>

        {post.fileUrls && (
          <Photos>
            {post.fileUrls.map((url) => (
              <img src={url} alt={url} />
            ))}
          </Photos>
        )}

        {isMissingPost(post) && (
          <MissingWrapper>
            <div className="info">
              <div className="left">나이/연령</div>
              <div className="right">{post.age}</div>
            </div>
            <div className="info">
              <div className="left">특징</div>
              <div className="right">{post.characteristic}</div>
            </div>
            <div className="info">
              <div className="left">마지막 목격 장소</div>
              <div className="right">{post.lastSeen}</div>
            </div>
          </MissingWrapper>
        )}

        <div className="bottom">
          <div className="icon">
            <Position />
            {location}
          </div>
          {!post.isAuthor && (
            <div className="status">
              <Circle status={post.status} />
              {post.status}
            </div>
          )}
        </div>
      </ContentWrapper>

      <CommentWrapper>
        <div className="count">댓글 {comments.totalCount}건</div>
        {comments.totalCount === 0 ? (
          <div className="empty">
            <div>
              아직 댓글이 없습니다.
              <br />첫 댓글을 작성해보세요!
            </div>
            <Button variant="white">
              <Pencil />
              <span>댓글 쓰기</span>
            </Button>
          </div>
        ) : (
          comments.comments.map((comment) => (
            <div className="comment" key={comment.id}>
              <div className="circle">{comment.memberName.slice(0, 1)}</div>
              <div className="content">
                <div className="top">
                  <div className="author">{comment.memberName}</div>
                  <Clock />
                  <div className="time">
                    {formatRelativeTime(comment.createdAt)}
                  </div>
                </div>
                <div className="content">{comment.content}</div>
              </div>
            </div>
          ))
        )}
      </CommentWrapper>

      <Bottom>
        <InputBox
          placeholder="댓글을 입력하세요"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          icon={<Send isActive={comment.length > 0} />}
          iconBottom="16px"
          iconRight="18px"
          onClick={handleCommentClick}
        />
      </Bottom>
    </Container>
  );
};

const Container = styled.div`
  padding: 56px 0px 68px 0px;
  min-height: calc(100vh - 124px);
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${({ theme }) => theme.colors.gray200};
`;

const ContentWrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  background: ${({ theme }) => theme.colors.white};

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
    gap: 1px;
  }

  .author {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .time {
    margin-left: -3px;
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
    gap: 12px;
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

  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .icon {
    display: flex;
    align-items: center;
    gap: 2px;

    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
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

const MyPost = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const Photos = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  overflow-x: scroll;
  overflow-y: hidden;
  flex-wrap: nowrap;

  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  img,
  video {
    width: 320px;
    aspect-ratio: 62 / 41;
  }
`;

const MissingWrapper = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: ${({ theme }) => theme.colors.gray100};
  border-radius: 8px;

  font-size: ${({ theme }) => theme.font.fontSize.detail12};
  font-weight: ${({ theme }) => theme.font.fontWeight.medium};

  .info {
    display: flex;
    flex-direction: row;
    gap: 11px;
  }

  .left {
    width: 80px;
    color: ${({ theme }) => theme.colors.gray700};
  }

  .right {
    color: ${({ theme }) => theme.colors.gray900};
  }
`;

const CommentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.white};

  .count {
    padding: 12px 20px 8px 20px;
    display: flex;
    align-items: center;
    gap: 4px;
    color: ${({ theme }) => theme.colors.gray800};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .empty {
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    text-align: center;
    color: ${({ theme }) => theme.colors.gray600};
    font-size: ${({ theme }) => theme.font.fontSize.body16};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .comment {
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .circle {
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

  .contents {
    display: flex;
    flex-direction: colmn;
  }

  .top {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .author {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body14};
    font-weight: ${({ theme }) => theme.font.fontWeight.bold};
  }

  .time {
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.font.fontSize.detail12};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }

  .content {
    color: ${({ theme }) => theme.colors.gray1000};
    font-size: ${({ theme }) => theme.font.fontSize.body14};
    font-weight: ${({ theme }) => theme.font.fontWeight.medium};
  }
`;

const Bottom = styled.div`
  padding: 12px 20px;
  background: ${({ theme }) => theme.colors.white};
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Send = styled(SendIcon)<{ isActive: boolean }>`
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.red600 : theme.colors.gray1000};
`;
