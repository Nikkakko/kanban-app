import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import InputField from '../components/InputField';
import OutsideClick from '../components/OutsideClick';
import { closeNewColumnModal, createNewColumn } from '../features/taskSlice';

const addNewColumn = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();

  const handleAddNewColumn = () => {
    dispatch(createNewColumn({ inputValue }));
    setInputValue('');
  };

  const handleCancel = () => {
    dispatch(closeNewColumnModal());
  };
  return createPortal(
    <>
      <ModalContainer ref={modalRef}>
        <OutsideClick
          modalRef={modalRef}
          closeTaskModal={handleCancel}
          setIsEditingFalse={closeNewColumnModal}
        />
        <Wrapper>
          <Title>Add a new column</Title>
          <InputField
            placeholder='Enter column title...'
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            name='columnTitle'
            type='text'
          />

          <Buttons>
            <CancelButton onClick={handleAddNewColumn}>
              Add new column
            </CancelButton>
            <DeleteButton onClick={handleCancel}>Cancel</DeleteButton>
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

  @media (max-width: 768px) {
    width: 400px;
    // center the modal
    left: 43%;
    transform: translateX(-50%);
  }

  @media (max-width: 425px) {
    width: 380px;
    // center the modal
    left: 43%;
    transform: translateX(-50%);
  }
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 18px;
  line-height: 23px;

  /* White */

  color: #ffffff;

  text-transform: capitalize;
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
  text-transform: capitalize;
`;
const CancelButton = styled(DeleteButton)`
  background: ${({ theme }) => theme.subtaskColor};
  color: #635fc7;
`;
export default addNewColumn;
