import Layout from 'layouts/Layout';
import PageContent from 'layouts/PageContent';
import React, { useState, useCallback } from 'react';
import {
  Container,
  TitleDiv,
  RequestForm,
  FormItemDiv,
  Label,
  RequestButton,
  DirectorListDiv,
} from './style';
import Input from 'components/Input';
import Button from 'components/Button';
import useInput from 'hooks/useInput';
import { isEmpty } from 'lodash';
import useRequest from 'hooks/useRequest';
import { requestMovie } from 'api/movie';
import { IRequestMovie } from 'types/db';
import useTagInput from 'hooks/useTagInput';
import InputTagList from 'components/InputTagList';

function Request() {
  const [title, onChangeTitle, setTitle] = useInput('');
  const [director, onChangeDirector, setDirector] = useInput('');
  const [isComposing, setIsComposing] = useState(false);

  // 해당 인덱스의 감독 삭제
  const [
    directorList,
    setDirectorList,
    deleteDirector,
    addDirectorList,
    onKeyDownDirector,
  ] = useTagInput(setDirector, isComposing);

  // 유효성 검사
  const validate = useCallback(() => {
    if (!title.trim()) {
      return false;
    }
    if (isEmpty(directorList)) {
      return false;
    }
    return true;
  }, [title, directorList]);

  // 영화 요청
  const requsetRequestMovie = useRequest<boolean>(requestMovie);
  const requsetProc = useCallback(() => {
    if (!validate()) return;
    const movie: IRequestMovie = {
      movTitle: title,
      directors: directorList.join(','),
    };
    requsetRequestMovie(movie)
      .then(() => {
        setTitle('');
        setDirectorList([]);
        alert('영화를 요청하였습니다.');
      })
      .catch((e) => {
        console.error(e.message);
      });
  }, [title, directorList]);

  return (
    <Layout>
      <PageContent>
        <Container>
          <TitleDiv>영화 요청</TitleDiv>
          <RequestForm>
            <FormItemDiv>
              <Label>제목</Label>
              <Input
                placeholder="영화 제목을 입력해주세요"
                value={title}
                onChange={onChangeTitle}
              />
            </FormItemDiv>
            <FormItemDiv>
              <Label>감독</Label>
              <>
                <Input
                  placeholder="감독 이름을 입력해주세요"
                  value={director}
                  onChange={onChangeDirector}
                  onKeyDown={(e) => {
                    onKeyDownDirector(e, director);
                  }}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                />
                <Button
                  onClick={() => {
                    addDirectorList(director);
                  }}
                >
                  추가
                </Button>
              </>
              <DirectorListDiv>
                <InputTagList
                  tagList={directorList}
                  deleteTag={deleteDirector}
                />
              </DirectorListDiv>
            </FormItemDiv>
          </RequestForm>
          <RequestButton onClick={requsetProc}>요청</RequestButton>
        </Container>
      </PageContent>
    </Layout>
  );
}

export default Request;
