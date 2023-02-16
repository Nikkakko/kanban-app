import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import Header from './Header';
import { openNewColumnModal, toggleSidebar } from '../features/taskSlice';
import iconShowSidebar from '../assets/icon-show-sidebar.svg';
import ColumnContent from './Column';
import DisplayTaskModal from '../modals/taskModal';
import AddnewBoard from '../modals/addNewBoard';
import EmptyContent from './EmptyContent';
import AddNewColumn from '../modals/addNewColumn';
import { darkTheme } from '../styles/defaultTheme';

type styledProps = {
  empty: boolean;
};

const Main = () => {
  const dispatch = useAppDispatch();

  const {
    isSidebarOpen,
    selectedBoardId,
    boards,
    taskModal,
    newColumnModal,
    newBoardModal,
  } = useAppSelector(state => state.task);

  // check if selectedBoard is is empty
  const selectedBoard = boards.find(board => board.id === selectedBoardId);

  return (
    <Wrapper>
      <Header />
      <MainContainer>
        <MainContent empty>
          {boards.map(board => (
            <BoardWrapper key={board.id}>
              {selectedBoardId === board.id && (
                <ColumnWrapper>
                  {board.columns.map((column, i) => (
                    <Column key={i}>
                      <ColumnContent column={column} />
                    </Column>
                  ))}

                  {
                    // if selectedBoard is empty, don't show newColumn
                    selectedBoard?.columns.length !== 0 && (
                      <NewColumn onClick={() => dispatch(openNewColumnModal())}>
                        <h3>+ new Column</h3>
                      </NewColumn>
                    )
                  }
                </ColumnWrapper>
              )}
            </BoardWrapper>
          ))}

          {taskModal && <DisplayTaskModal />}
          {newBoardModal && <AddnewBoard />}
          {newColumnModal && <AddNewColumn />}
        </MainContent>

        {selectedBoard?.columns.length === 0 && (
          <EmptyContent emptyTitle='This board is empty. Create a new column to get started' />
        )}

        {!isSidebarOpen && (
          <RevealSidebar onClick={() => dispatch(toggleSidebar())}>
            <IconShowSidebar src={iconShowSidebar} alt='' />
          </RevealSidebar>
        )}
      </MainContainer>
    </Wrapper>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  @media (max-width: 768px) {
    overflow: auto;
    flex-wrap: wrap;
  }
`;

const MainContent = styled.div<styledProps>`
  display: flex;
  padding: 24px 0 50px 24px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  overflow: hidden;
`;

const BoardWrapper = styled.div`
  /* border: 1px solid green; */

  /* display: flex; */
`;
const ColumnWrapper = styled.div`
  /* border: 1px solid red; */

  display: flex;
  gap: 24px;
`;
const Column = styled.div`
  /* border: 1px solid blue; */

  display: flex;
  flex-direction: column;
`;

const RevealSidebar = styled.div`
  position: absolute;
  width: 56px;
  height: 48px;
  left: 0px;
  top: 944px;
  background: #635fc7;
  border-radius: 0px 100px 100px 0px;

  &:hover {
    background: #a8a4ff;
  }

  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  @media (max-width: 768px) {
  }

  @media (max-width: 425px) {
    display: none;
  }
`;

const IconShowSidebar = styled.img``;

const NewColumn = styled.div`
  background: ${({ theme }) =>
    theme === darkTheme
      ? 'linear-gradient(180deg, rgba(43, 44, 55, 0.25) 0%, rgba(43, 44, 55, 0.125) 100%)'
      : 'linear-gradient(180deg, #e9effa 0%, rgba(233, 239, 250, 0.5) 100%)'};

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 55px;
  margin-top: 2.2rem;
  /* height: 4.5rem; */
  /* border-radius: 0.5rem; */
  /* width: 100%; */

  cursor: pointer;

  &:hover {
    h3 {
      color: #a8a4ff;
    }
  }

  h3 {
    font-weight: 700;
    font-size: 24px;
    line-height: 30px;
    text-align: center;

    /* Medium Grey */

    color: #828fa3;

    text-transform: capitalize;
  }
`;

export default Main;
