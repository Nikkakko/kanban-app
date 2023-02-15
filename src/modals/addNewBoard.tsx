import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import InputField from '../components/InputField';
import OutsideClick from '../components/OutsideClick';
import {
  closeNewBoardModal,
  createNewBoard,
  editBoard,
  setIsEditingBoardFalse,
} from '../features/taskSlice';
import { newBoard, newColumn } from '../types/boardType';

const AddnewBoard = () => {
  const dispatch = useAppDispatch();
  const { boards, selectedBoardId, isEditingBoard } = useAppSelector(
    state => state.task
  );
  const modalRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState<string>();
  const [newBoardColumns, setNewBoardColumns] = useState<newColumn[]>([
    {
      name: 'Todo',
      tasks: [],
    },
    {
      name: 'Doing',
      tasks: [],
    },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValue(value);
  };

  const handleBoardColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBoardColumns(prev =>
      prev.map((item, index) => {
        if (index === parseInt(name)) {
          return {
            ...item,
            name: value,
          };
        } else {
          return item;
        }
      })
    );
  };

  const handleAddNewColumn = () => {
    setNewBoardColumns(prev => [
      ...prev,
      {
        name: '',
        tasks: [],
      },
    ]);
  };

  const handleRemoveColumn = (index: number) => {
    setNewBoardColumns(prev => prev.filter((item, i) => i !== index));
  };

  const handleAddnewBoard = () => {
    //  Create new board
    let newBoard = {
      name: inputValue,
      columns: newBoardColumns,
    };

    dispatch(createNewBoard(newBoard as newBoard));
  };

  useEffect(() => {
    if (isEditingBoard) {
      const board = boards.find(board => board.id === selectedBoardId);
      setInputValue(board?.name);
      setNewBoardColumns(board?.columns as newColumn[]);
    }
  }, []);

  const handleEditBoard = () => {
    // create edited board
    let editedBoard = {
      name: inputValue,
      columns: newBoardColumns,
    };

    dispatch(editBoard(editedBoard as newBoard));
  };

  return createPortal(
    <>
      <ModalContainer ref={modalRef}>
        <OutsideClick
          modalRef={modalRef}
          closeTaskModal={() => dispatch(closeNewBoardModal())}
          setIsEditingFalse={() => dispatch(setIsEditingBoardFalse())}
        />
        <Wrapper>
          <Title>{isEditingBoard ? 'Edit Board' : 'Add New Board'}</Title>
          <BoardLabel>Board Name</BoardLabel>
          <InputField
            type='text'
            placeholder='e.g Web Design'
            name='name'
            value={inputValue || ''}
            onChange={handleChange}
          />

          <BoardLabel>Board Columns</BoardLabel>
          {newBoardColumns.map((item, index) => (
            <InputField
              key={index}
              type='text'
              placeholder={index === 0 ? 'e.g. Todo' : 'e.g. Done'}
              name={index.toString()}
              value={item.name || ''}
              onChange={handleBoardColumnChange}
              subtasks
              handleRemoveSubTask={() => handleRemoveColumn(index)}
            />
          ))}
          <AddNewColumnButton onClick={handleAddNewColumn}>
            + Add New Column
          </AddNewColumnButton>
          <CreateNewBoardButton
            onClick={isEditingBoard ? handleEditBoard : handleAddnewBoard}
          >
            {isEditingBoard ? 'Save Changes' : 'Create New Board'}
          </CreateNewBoardButton>
        </Wrapper>
      </ModalContainer>
    </>,
    document.getElementById('modal-root') as Element
  );
};

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px;

  background: ${({ theme }) => theme.navBarBackground};
  border-radius: 6px;

  width: 480px;
  height: auto;

  @media (max-width: 425px) {
    width: 380px;
  }
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 18px;
  line-height: 23px;
  /* identical to box height */

  /* White */

  color: ${({ theme }) => theme.textColor};
`;

const BoardLabel = styled.label`
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;

  /* White */

  color: ${({ theme }) => theme.textColor};

  margin-top: 24px;
  margin-bottom: 8px;
`;

const AddNewColumnButton = styled.button`
  background: ${({ theme }) => theme.subtaskColor};
  border-radius: 20px;

  font-weight: 700;
  font-size: 13px;
  line-height: 23px;
  /* identical to box height, or 177% */

  text-align: center;

  /* Main Purple */

  color: #635fc7;
  border: none;
  padding: 8px;
  cursor: pointer;
`;

const CreateNewBoardButton = styled.button`
  background: #635fc7;
  border-radius: 20px;
  font-weight: 700;
  font-size: 13px;
  line-height: 23px;
  /* identical to box height, or 177% */

  text-align: center;

  /* White */

  color: #ffffff;
  margin-top: 24px;
  border: none;
  padding: 8px;
  cursor: pointer;
`;

export default AddnewBoard;
