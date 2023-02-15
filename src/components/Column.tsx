import styled from 'styled-components';

import TaskViewCard from './TaskViewCard';

type ColumnProps = {
  column: {
    name: string;
    tasks: {
      title: string;
      description: string;
      status: string;
      subtasks: {
        title: string;
        isCompleted: boolean;
      }[];
    }[];
  };
};

type styledProps = {
  name: string;
};

const Column = ({ column }: ColumnProps) => {
  return (
    <ColumnContainer>
      <ColumnHeading>
        <Dot name={column.name} />
        <Heading>
          {column.name}({column.tasks.length})
        </Heading>
      </ColumnHeading>
      {column.tasks.map((task, i) => (
        <TaskViewCard key={i} task={task} index={i} />
      ))}
    </ColumnContainer>
  );
};

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColumnHeading = styled.div`
  display: flex;
  gap: 12px;
`;

const Heading = styled.h3`
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 2.4px;

  /* Medium Grey */

  color: #828fa3;
`;

const Dot = styled.div<styledProps>`
  width: 15px;
  height: 15px;
  background: ${({ name }) => {
    if (name === 'Todo') return '#49C4E5';
    if (name === 'Doing') return '#8471F2';
    if (name === 'Done') return '#67E2AE';
  }};
  border-radius: 50%;
`;

export default Column;
