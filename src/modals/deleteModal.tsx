import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import OutsideClick from '../components/OutsideClick';
import {
  closeDeleteModal,
  closeNewBoardModal,
  setIsEditingBoardFalse,
} from '../features/taskSlice';

type Props = {
  title: string;
  boardName?: string;
  taskName?: string;
  handleDelete: () => void;
};

const deleteModal = ({ title, boardName, taskName, handleDelete }: Props) => {
  const { selectedBoardId, boards } = useAppSelector(state => state.task);
  const dispatch = useAppDispatch();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCancel = () => {
    dispatch(closeDeleteModal());
    dispatch(setIsEditingBoardFalse());
  };

  return createPortal(
    <>
      <ModalContainer ref={modalRef}>
        <OutsideClick
          modalRef={modalRef}
          closeTaskModal={handleCancel}
          setIsEditingFalse={() => dispatch(setIsEditingBoardFalse())}
        />
        <Wrapper>
          <Title> Delete this {title}?</Title>
          <Desc>
            {boardName &&
              `Are you sure you want to delete the '${boardName}' board? This action will remove all columns and tasks and cannot be reversed.`}
            {taskName &&
              `Are you sure you want to delete the '${taskName}' task and its subtasks? This action cannot be reversed.`}
          </Desc>
          <Buttons>
            <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
            <CancelButton onClick={handleCancel}>Cancel</CancelButton>
          </Buttons>
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
  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 100;
`;

const Wrapper = styled.div`
  background: ${({ theme }) => theme.navBarBackground};
  border-radius: 6px;
  position: relative;

  width: 480px;
  height: auto;

  padding: 32px;

  display: flex;
  flex-direction: column;

  gap: 24px;

  @media (max-width: 425px) {
    width: 380px;
  }
`;
const Title = styled.h1`
  font-weight: 700;
  font-size: 18px;
  line-height: 23px;
  /* identical to box height */

  /* Red */

  color: #ea5555;
`;

const Desc = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 23px;
  /* or 177% */

  /* Medium Grey */

  color: #828fa3;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
`;
const DeleteButton = styled.button`
  background: #ea5555;
  border-radius: 20px;

  font-weight: 700;
  font-size: 13px;
  line-height: 23px;
  /* identical to box height, or 177% */

  text-align: center;

  /* White */

  color: #ffffff;
  border: none;

  cursor: pointer;

  width: 100%;
  padding: 8px;
`;
const CancelButton = styled(DeleteButton)`
  background: ${({ theme }) => theme.subtaskColor};
  color: #635fc7;
`;
export default deleteModal;
