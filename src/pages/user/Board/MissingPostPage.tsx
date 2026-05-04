import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import Back from '@/assets/icons/ChevronLeft.svg?react';
import { useComments, useMissingPost } from '@/api/board';
import { NavBar } from '@/components/common/NavBar';
import { TitleMainSub } from '@/components/common/TitleHeader';
import { PostPage } from '@/components/user/board/PostPage';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';

export const MissingPostPage = () => {
  const { handleGoBack } = useHandleNavigate();

  const { id } = useParams<{ id: string }>();
  const postId = Number(id);

  const { data: post } = useMissingPost(postId);
  const { data: comments } = useComments('missing', postId);

  if (!post || !comments) {
    return <Container>게시글을 찾을 수 없습니다.</Container>;
  }

  return (
    <Container>
      <NavBar
        left={<Back onClick={handleGoBack} />}
        center={
          <TitleMainSub
            main="잃어버린 가족/반려동물/소지품 찾기"
            sub="실종자 및 분실물 정보를 등록하고 제보받을 수 있습니다"
            align="center"
          />
        }
      />

      <PostPage
        statusOptions={['찾는 중', '발견됨']}
        post={post}
        comments={comments}
      />
    </Container>
  );
};

const Container = styled.div``;
