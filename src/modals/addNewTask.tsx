import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  createTask,
  closeAddNewTaskModal,
  openTaskModal,
  setIsEditing,
  setIsEditingFalse,
  editTask,
} from '../features/taskSlice';
import InputField from '../components/InputField';
import iconChevronUp from '../assets/icon-chevron-up.svg';
import iconChevronDown from '../assets/icon-chevron-down.svg';
import OutsideClick from '../components/OutsideClick';

type styledProps = {
  isSelectOpen: boolean;
};

type Subtasks = {
  title: string;
  isCompleted: boolean;
};

const AddNewTaskModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { boards, selectedBoardId, isEditing, taskObject } = useAppSelector(
    state => state.task
  );

  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const [inputError, setInputError] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState({
    title: '',
    description: '',
  });

  const [newSubTasks, setNewSubTasks] = useState<Subtasks[]>([
    {
      title: '',
      isCompleted: false,
    },
    {
      title: '',
      isCompleted: false,
    },
  ]);

  const selectedBoard = boards.find(board => board.id === selectedBoardId);

  const { title, description } = inputValue;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValue(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSubTask = () => {
    setNewSubTasks(prev => [
      ...prev,
      {
        title: '',
        isCompleted: false,
      },
    ]);
  };

  const handleRemoveSubTask = (index: number) => {
    let copy = [...newSubTasks];
    copy.splice(index, 1);
    setNewSubTasks(copy);
  };

  const handleSubTaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSubTasks(prev => {
      return prev.map((item, index) => {
        if (index === Number(name)) {
          return {
            ...item,
            title: value,
          };
        }
        return item;
      });
    });
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  const handleTask = () => {
    let taskData = {
      title,
      description,
      subtasks: newSubTasks.filter(item => item.title !== ''),
      status: selectedOption,
    };

    // prevent if title is empty
    if (title === '') {
      return; // do nothing
    }

    if (newSubTasks.filter(item => item.title === '').length > 0) {
      setIsSubmitted(true);
      return;
    }

    if (isEditing) {
      dispatch(editTask(taskData));
    } else {
      dispatch(createTask(taskData));
    }
  };

  useEffect(() => {
    // if newSubTasks is empty, setError to true to show error
    if (
      newSubTasks.filter(item => item.title === '').length > 0 &&
      isSubmitted
    ) {
      setInputError(true);
    } else {
      setInputError(false);
    }
  }, [isSubmitted, newSubTasks]);

  // set taskObj to input values if isEditing is true
  useEffect(() => {
    if (isEditing) {
      setInputValue({
        title: taskObject.title,
        description: taskObject.description,
      });
      setSelectedOption(taskObject.status);
      setNewSubTasks(taskObject.subtasks);
    }
  }, [isEditing]);

  useEffect(() => {
    // set selected option to first option if selected option is empty
    {
      selectedBoard &&
        selectedBoard.columns.map((column, i) =>
          setSelectedOption(column.name)
        );
    }
  }, []);

  return createPortal(
    <Container ref={modalRef}>
      <OutsideClick
        modalRef={modalRef}
        closeTaskModal={() => dispatch(closeAddNewTaskModal())}
        setIsEditingFalse={() => dispatch(setIsEditingFalse())}
      />
      <Wrapper>
        <Heading>
          <HeaderTitle>{isEditing ? 'Edit Task' : 'Add New Task'}</HeaderTitle>
        </Heading>
        <Content>
          <InputField
            type='text'
            value={title}
            placeholder='e.g. Take coffee break'
            label='title'
            name='title'
            onChange={handleChange}
          />

          <InputField
            type='text'
            value={description}
            placeholder={`e.g. It’s always good to take a break. This 15 minute break will 
            recharge the batteries a little.`}
            label='description'
            name='description'
            onChange={handleChange}
          />

          {newSubTasks.map((item, index) => (
            <InputField
              key={index}
              type='text'
              value={item.title}
              placeholder='e.g. Make coffee'
              label={index === 0 ? 'subtasks' : ''}
              name={index.toString()}
              onChange={handleSubTaskChange}
              handleRemoveSubTask={() => handleRemoveSubTask(index)}
              subtasks // this is a boolean prop
              // inputerror only shows if there is an empty subtask
              inputError={inputError && item.title === ''}
            />
          ))}

          <AddSubtask
            onClick={() => {
              handleAddSubTask();
            }}
          >
            + Add new subtask
          </AddSubtask>
          <SelectWrapper>
            {/* 
            
            */}
            <SelectLabel>Status</SelectLabel>
            <Select
              value={selectedOption}
              onChange={handleSelectChange}
              isSelectOpen={isSelectOpen}
              onClick={() => setIsSelectOpen(prev => !prev)}
            >
              {selectedBoard &&
                selectedBoard.columns.map((column, i) => (
                  <Option
                    key={i}
                    value={column.name}
                    onChange={() => handleSelectChange}
                  >
                    {column.name}
                  </Option>
                ))}
            </Select>
          </SelectWrapper>
        </Content>
        <CreateButton
          onClick={handleTask} // this is where we will dispatch the action to create a new task
        >
          {isEditing ? 'Save Changes' : 'Create Task'}
        </CreateButton>
      </Wrapper>
    </Container>,
    document.getElementById('modal-root') as Element
  );
};

const Container = styled.div`
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

  width: 480px;
  height: auto;

  padding: 32px;

  display: flex;
  flex-direction: column;

  @media (max-width: 425px) {
    width: 380px;
  }
`;

const HeaderTitle = styled.h3`
  font-weight: 700;
  font-size: 18px;
  line-height: 23px;
  /* identical to box height */

  /* White */

  color: ${({ theme }) => theme.textColor};
`;

const Heading = styled.div``;
const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const CreateButton = styled.button`
  padding: 8px 0px;
  margin-top: 24px;
  background: #635fc7;
  border-radius: 20px;
  text-align: center;
  text-transform: capitalize;
  color: #ffffff;
  font-weight: 700;
  font-size: 13px;
  line-height: 23px;
  border: none;

  cursor: pointer;

  &:hover {
    background: #a8a4ff;
  }
`;

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;
const AddSubtask = styled(CreateButton)`
  background: ${({ theme }) => theme.subtaskColor};
  color: #635fc7;
  margin-top: 0px;

  &:hover {
    background: #e6e6e6;
  }
`;

const SelectLabel = styled.label`
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;

  /* White */

  color: #ffffff;
`;
const Select = styled.select<styledProps>`
  background: ${({ theme }) => theme.navBarBackground};
  border: 1px solid rgba(130, 143, 163, 0.25);
  border-radius: 4px;
  padding: 8px 16px;
  color: ${({ theme }) => theme.textColor};
  margin-top: 8px;

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
    cursor: pointer;
  }
`;

const Option = styled.option`
  color: #828fa3;
`;

export default AddNewTaskModal;
