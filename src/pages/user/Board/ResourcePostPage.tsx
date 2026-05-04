import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import Back from '@/assets/icons/ChevronLeft.svg?react';
import { useComments, useResourcePost } from '@/api/board';
import { NavBar } from '@/components/common/NavBar';
import { TitleMainSub } from '@/components/common/TitleHeader';
import { PostPage } from '@/components/user/board/PostPage';
import { useHandleNavigate } from '@/hooks/useHandleNavigate';

export const ResourcePostPage = () => {
  const { handleGoBack } = useHandleNavigate();

  const { id } = useParams<{ id: string }>();
  const postId = Number(id);

  const { data: post } = useResourcePost(postId);
  const { data: comments } = useComments('resource', postId);

  if (!post) {
    return <Container>게시글을 찾을 수 없습니다.</Container>;
  } else if (!comments) {
    return <Container>댓글을 찾을 수 없습니다.</Container>;
  }

  return (
    <Container>
      <NavBar
        left={<Back onClick={handleGoBack} />}
        center={
          <TitleMainSub
            main="현장별 자원 요청/공급 게시판"
            sub="필요한 자원을 요청하거나 제공할 수 있습니다"
            align="center"
          />
        }
      />

      <PostPage
        statusOptions={['진행 중', '대기 중', '마감']}
        post={post}
        comments={comments}
      />
    </Container>
  );
};

const Container = styled.div``;
