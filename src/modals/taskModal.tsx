import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  changeSubtaskStatus,
  closeTaskModal,
  changeTaskStatus,
  deleteTask,
  openTaskModal,
  setIsEditing,
  setIsEditingFalse,
  openDeleteModal,
  closeDeleteModal,
} from '../features/taskSlice';
import verticalEllipsis from '../assets/icon-vertical-ellipsis.svg';
import iconCheckmark from '../assets/icon-check.svg';
import iconChevronUp from '../assets/icon-chevron-up.svg';
import iconChevronDown from '../assets/icon-chevron-down.svg';
import OutsideClick from '../components/OutsideClick';
import AddDeleteModal from '../modals/deleteModal';

type styledProps = {
  isCompleted?: boolean;
  isSelectOpen?: boolean;
};

const DisplayTaskModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const modalRef = useRef<HTMLDivElement>(null);
  const { taskModal, selectedBoardId, boards, taskObject, deleteModal } =
    useAppSelector(state => state.task);
  const { title, description, status, subtasks } = taskObject;
  const [selectedOption, setSelectedOption] = useState<string>(status);
  const [dotsClicked, setDotsClicked] = useState<boolean>(false);
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);

  const subTasksCompleted = subtasks.filter(subtask => subtask.isCompleted);
  const selectedBoard = boards.find(board => board.id === selectedBoardId);

  // get task name from taskObj
  const taskName = taskObject.title;

  const handleSelectChange: React.ChangeEventHandler<HTMLSelectElement> = e => {
    setSelectedOption(e.target.value);
    dispatch(changeTaskStatus({ status: e.target.value }));
  };

  const handleCheckMark: React.ChangeEventHandler<HTMLInputElement> = e => {
    const subtaskTitle = e.target.value;
    dispatch(changeSubtaskStatus({ subtaskTitle }));
  };

  // open dots modal when clicking on the dots
  const handleDotsClick = () => {
    setDotsClicked(prev => !prev);
  };

  // delete task
  const handleDeleteTask = () => {
    dispatch(deleteTask());
    dispatch(closeDeleteModal());
  };

  // open edit task modal when clicking on edit task
  const handleEditTask = () => {
    dispatch(openTaskModal());
    dispatch(closeTaskModal());
    dispatch(setIsEditing());
  };

  // open delete task modal
  const AddOpenDeleteModal = () => {
    dispatch(openDeleteModal());
    // dispatch(closeTaskModal());
    // dispatch(setIsEditing());
    setDotsClicked(false);
  };

  return createPortal(
    <>
      <ModalContainer ref={modalRef}>
        <OutsideClick
          modalRef={modalRef}
          closeTaskModal={() => dispatch(closeTaskModal())}
          setIsEditingFalse={() => dispatch(setIsEditingFalse())}
        />

        {deleteModal && (
          <AddDeleteModal
            handleDelete={handleDeleteTask}
            title='Task'
            taskName={taskName}
          />
        )}
        <Wrapper>
          <Heading>
            <Title>{title}</Title>
            <Dots onClick={() => handleDotsClick()} />
            {dotsClicked && (
              <EditModal>
                <EditWrapper>
                  <EditTask onClick={handleEditTask}>Edit Task</EditTask>
                  <DeleteTask onClick={AddOpenDeleteModal}>
                    Delete Task
                  </DeleteTask>
                </EditWrapper>
              </EditModal>
            )}
          </Heading>
          <Description>{description}</Description>

          <SubTasks>
            <SubTask>
              Subtasks ({subTasksCompleted.length} of {subtasks.length})
            </SubTask>

            {subtasks.map((subtask, i) => (
              <SubtasksCompleted key={i}>
                <CheckMark
                  type='checkbox'
                  checked={subtask.isCompleted}
                  value={subtask.title}
                  onChange={handleCheckMark}
                  isCompleted={subtask.isCompleted}
                />

                <SubTitle isCompleted={subtask.isCompleted}>
                  {subtask.title}
                </SubTitle>
              </SubtasksCompleted>
            ))}
          </SubTasks>

          <CurrentStatus>
            <Status>Current Status</Status>
            <StatusSelect
              value={selectedOption}
              onChange={handleSelectChange}
              isSelectOpen={isSelectOpen}
              onClick={() => setIsSelectOpen(prev => !prev)}
            >
              {selectedBoard &&
                selectedBoard.columns.map((column, i) => (
                  <StatusOptions
                    key={i}
                    value={column.name}
                    onChange={() => handleCheckMark}
                  >
                    {column.name}
                  </StatusOptions>
                ))}
            </StatusSelect>
          </CurrentStatus>
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

  @media (max-width: 425px) {
    width: 380px;
  }
`;

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.h3`
  font-weight: 700;
  font-size: 18px;
  line-height: 23px;

  /* White */

  color: ${({ theme }) => theme.textColor};

  width: 90%; // temporary
`;
const Dots = styled.div`
  background: url(${verticalEllipsis}) no-repeat;
  width: 10px;
  height: 24px;
  margin-left: auto;

  cursor: pointer;
`;

/* Edit and Delete modal */
const EditModal = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.navBarBackground};
  box-shadow: 0px 10px 20px rgba(54, 78, 126, 0.25);
  border-radius: 8px;
  width: 192px;
  height: 94px;

  top: 93px;
  right: -65px;

  z-index: 100;
`;
const EditTask = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 23px;
  /* identical to box height, or 177% */

  /* Medium Grey */

  color: #828fa3;
  cursor: pointer;
`;
const DeleteTask = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 23px;
  /* identical to box height, or 177% */

  /* Red */

  cursor: pointer;
  color: #ea5555;
`;

const EditWrapper = styled.div`
  display: flex;
  text-align: flex-start;
  flex-direction: column;
  gap: 8px;

  padding: 16px;
`;

/* Edit and Delete modal */

const Description = styled.p`
  font-weight: 500;
  font-size: 13px;
  line-height: 23px;
  /* or 177% */

  /* Medium Grey */

  color: #828fa3;
  margin-top: 24px;
`;
const SubTasks = styled.div`
  margin-top: 24px;
`;
const SubTask = styled.p`
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;

  /* White */
  color: ${({ theme }) => theme.textColor};

  margin-bottom: 16px;
`;

const SubtasksCompleted = styled.div`
  background: ${({ theme }) => theme.subTaskCompleted};
  border-radius: 4px;
  width: 100%;
  padding: 13px 0px 13px 12px;

  display: flex;
  flex-direction: column;

  margin-top: 8px;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;

  cursor: pointer;
  position: relative;
  z-index: 0;

  &:hover::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #635fc7;
    opacity: 0.25;
    z-index: -1;
  }

  &:hover {
    p {
      color: #fff;
      opacity: 1;
    }
  }
`;

const CheckMark = styled.input<styledProps>`
  -webkit-appearance: none;
  appearance: none;
  /* creating a custom design */
  width: 20px;
  height: 20px;
  border-radius: 2px;
  border: 1px solid rgba(130, 143, 163, 0.248914);
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  background-color: ${({ isCompleted, theme }) =>
    isCompleted ? '#635FC7' : theme.navBarBackground};
  background-image: ${props => props.isCompleted && `url(${iconCheckmark})`};
  background-repeat: no-repeat;
  background-position: center;
  z-index: 2;
`;

const SubTitle = styled.p<styledProps>`
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;

  /* White */

  color: ${({ theme }) => theme.textColor};
  text-decoration-line: ${props =>
    props.isCompleted ? 'line-through' : 'none'};
  mix-blend-mode: normal;
  opacity: 0.5;
`;

const CurrentStatus = styled.div`
  margin-top: 24px;
`;
const Status = styled.label`
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;

  /* White */

  color: ${({ theme }) => theme.textColor};
`;
const StatusOptions = styled.option`
  font-weight: 500;
  font-size: 13px;
  line-height: 23px;
  /* identical to box height, or 177% */

  /* Medium Grey */

  color: #828fa3;
`;
const StatusSelect = styled.select<styledProps>`
  background: ${({ theme }) => theme.navBarBackground};
  width: 100%;
  margin-top: 8px;

  border: 1px solid rgba(130, 143, 163, 0.25);
  border-radius: 4px;

  padding: 8px 16px;

  font-weight: 500;
  font-size: 13px;
  line-height: 23px;
  /* identical to box height, or 177% */

  /* White */

  color: ${({ theme }) => theme.textColor};

  &:focus {
    outline: none;
  }

  /* Remove default arrow */
  -moz-appearance: none; /* Firefox */
  -webkit-appearance: none; /* Safari and Chrome */
  appearance: none;

  /* Add custom arrow */
  background-image: ${({ isSelectOpen }) =>
    isSelectOpen ? `url(${iconChevronUp})` : `url(${iconChevronDown})`};

  background-repeat: no-repeat;
  background-position: right 0.7em top 50%;

  &:hover {
    border: 1px solid #635fc7;
    border-radius: 4px;
  }

  cursor: pointer;
`;

export default DisplayTaskModal;
