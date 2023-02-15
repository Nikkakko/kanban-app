import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { closeTaskModal, openTaskCard } from '../features/taskSlice';

import { newTask } from '../types/boardType';

type TasksProps = {
  task: {
    title: string;
    description: string;
    status: string;
    subtasks: {
      title: string;
      isCompleted: boolean;
    }[];
  };

  index?: number;
};

const TaskViewCard = ({ task, index }: TasksProps) => {
  const dispatch = useAppDispatch();
  const { taskModal } = useAppSelector(state => state.task);
  // completed tasks
  const completedTasks = task.subtasks.filter(subtask => subtask.isCompleted);
  // total tasks
  const totalTasks = task.subtasks.length;

  // open task modal by clicking on item
  const handleOpenTaskModal = (task: newTask) => {
    dispatch(openTaskCard(task));
  };

  return (
    <TasksContainer
      onClick={() => {
        handleOpenTaskModal(task);
      }}
    >
      <Text>
        <TaskHeading>{task.title}</TaskHeading>
        <SubTasks>
          {completedTasks.length} of {totalTasks} subtasks
        </SubTasks>
      </Text>
    </TasksContainer>
  );
};

const TasksContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 20px;
  /* border: 1px solid green; */

  background: ${({ theme }) => theme.navBarBackground};
  box-shadow: 0px 4px 6px rgba(54, 78, 126, 0.101545);
  border-radius: 8px;

  width: 280px;

  cursor: pointer;

  &:hover {
    h3 {
      color: #635fc7;
    }
  }
`;

const TaskHeading = styled.h3`
  color: ${({ theme }) => theme.textColor};
  font-weight: 700;
  font-size: 15px;
  line-height: 19px;

  text-align: start;
`;

const SubTasks = styled.span`
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  /* letter-spacing: 2.4px; */

  /* Medium Grey */

  color: #828fa3;
`;

const Text = styled.div`
  padding: 23px 16px;
  /* gap: 10px; */
`;
export default TaskViewCard;
