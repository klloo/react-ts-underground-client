import React, { useState } from 'react';
import { Form, FormItemDiv } from '../style';
import Input from 'components/Input';
import useInput from 'hooks/useInput';
import useTagInput from 'hooks/useTagInput';
import Button from 'components/Button';
import { isEmpty } from 'lodash';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { CareerDiv, CareerListDiv } from './style';

function CareerInfo() {
  const [career, onChangeCareer, setCareer] = useInput<string>('');
  const [isComposing, setIsComposing] = useState(false);
  const [careers, setCareers, deleteCareer, addCareer, onKeyDownCareer] =
    useTagInput(setCareer, isComposing);
  // Draggable이 Droppable로 드래그 되었을 때 실행되는 이벤트
  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) return;
    const newCareers = [...careers];
    // 기존 아이템을 새로운 위치에 삽입
    const [targetItem] = newCareers.splice(source.index, 1);
    newCareers.splice(destination.index, 0, targetItem);
    setCareers(newCareers);
  };

  return (
    <Form>
      <FormItemDiv>
        <Input
          placeholder="이력을 입력해주세요"
          value={career}
          onChange={onChangeCareer}
          onKeyDown={(e) => {
            onKeyDownCareer(e, career);
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
        />
        <Button
          onClick={(e) => {
            e.preventDefault();
            addCareer(career);
          }}
        >
          추가
        </Button>
      </FormItemDiv>
      {!isEmpty(careers) && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <CareerListDiv
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {careers.map((item, index) => (
                  <Draggable
                    key={`${item}${index}`}
                    draggableId={`${item}${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <CareerDiv
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {careers.length - index}&nbsp;&nbsp;&nbsp;{item}
                        <div
                          onClick={() => {
                            deleteCareer(index);
                          }}
                        >
                          &times;
                        </div>
                      </CareerDiv>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </CareerListDiv>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </Form>
  );
}

export default CareerInfo;