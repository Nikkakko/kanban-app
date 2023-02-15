import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { createNewColumn, openNewColumnModal } from '../features/taskSlice';

type EmptyContentProps = {
  emptyTitle: string;
};

const EmptyContent = ({ emptyTitle }: EmptyContentProps) => {
  const dispatch = useAppDispatch();
  const { boards, selectedBoardId } = useAppSelector(state => state.task);

  const boardName = boards?.find(board => board.id === selectedBoardId)?.name;
  console.log(boardName);

  const handleAddNewColumn = () => {
    let newColumn = {
      id: 1,
      name: 'New Column',
      tasks: [],
    };
    dispatch(createNewColumn(boardName));
  };

  return (
    <Container>
      <Title>{emptyTitle}</Title>
      <Button onClick={() => dispatch(openNewColumnModal())}>
        + Add new Column
      </Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  height: 100%;

  @media (max-width: 768px) {
    width: 75%;
  }
`;
const Title = styled.h1`
  font-weight: 700;
  font-size: 18px;
  line-height: 23px;
  /* identical to box height */

  text-align: center;

  /* Medium Grey */

  color: #828fa3;
`;
const Button = styled.button`
  background: #635fc7;
  border-radius: 24px;
  border: none;
  color: ${({ theme }) => theme.textColor};

  font-weight: 700;
  font-size: 15px;
  line-height: 19px;
  /* identical to box height */

  /* White */

  color: #ffffff;

  text-transform: capitalize;

  cursor: pointer;

  padding: 15px 17px;

  &:hover {
    background: #a8a4ff;
  }
`;
export default EmptyContent;
