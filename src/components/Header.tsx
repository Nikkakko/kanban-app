import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import iconVerticalDots from '../assets/icon-vertical-ellipsis.svg';
import {
  deleteBoard,
  openNewBoardModal,
  openTaskModal,
  setIsEditingBoard,
  setIsEditingBoardFalse,
  setIsEditingFalse,
  openDeleteModal,
  closeDeleteModal,
  toggleSidebar,
} from '../features/taskSlice';
import AddNewTaskModal from '../modals/addNewTask';
import AddDeleteModal from '../modals/deleteModal';
import iconAddTaskMobile from '../assets/icon-add-task-mobile.svg';
import logoMobile from '../assets/logo-mobile.svg';
import iconChevronDown from '../assets/icon-chevron-down.svg';
import iconChevronUp from '../assets/icon-chevron-up.svg';

type styledProps = {
  isBoardEmpty?:
    | {
        id: number;
        name: string;
        columns: {
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
        }[];
      }
    | undefined;
};

const Header = () => {
  const dispatch = useAppDispatch();

  const {
    boards,
    selectedBoardId,
    addNewTaskModal,
    isEditingBoard,
    deleteModal,
    isSidebarOpen,
  } = useAppSelector(state => state.task);

  const handleAddTaskModal = () => {
    dispatch(openTaskModal());
    dispatch(setIsEditingFalse());
  };

  const openEditModal = () => {
    if (isEditingBoard) {
      dispatch(setIsEditingBoardFalse());
    } else {
      dispatch(setIsEditingBoard());
    }
  };

  const handleEditBoard = () => {
    dispatch(openNewBoardModal());
  };

  const handleDeleteBoard = () => {
    dispatch(deleteBoard(selectedBoardId as number));
    dispatch(closeDeleteModal());
    dispatch(setIsEditingBoardFalse());
  };

  const AddOpenDeleteModal = () => {
    dispatch(openDeleteModal());
  };

  // find board name by id
  const boardName = boards.find(board => board.id === selectedBoardId)?.name;

  // find if selectedboard column is empty
  const isBoardEmpty = boards.find(
    board => board.id === selectedBoardId && board.columns.length === 0
  );

  return (
    <HeaderContainer>
      <MobileWrapper>
        <LogoMobile src={logoMobile} alt='logo' />
        {boards.map(
          (board, i) =>
            selectedBoardId === board.id && (
              <HeaderInfo key={i}>{board.name}</HeaderInfo>
            )
        )}

        <IconImg
          src={isSidebarOpen ? iconChevronUp : iconChevronDown}
          alt='icon-chevron-down'
          onClick={() => dispatch(toggleSidebar())}
        />
      </MobileWrapper>

      <AddNewTask>
        <AddButton
          onClick={() => handleAddTaskModal()}
          disabled={isBoardEmpty ? true : false}
          isBoardEmpty={isBoardEmpty}
        >
          <span>+ Add new task</span>
          <IconMobileTask src={iconAddTaskMobile} />
        </AddButton>
        {addNewTaskModal && <AddNewTaskModal />}
        {deleteModal && (
          <AddDeleteModal
            title='board'
            boardName={boardName}
            handleDelete={handleDeleteBoard}
          />
        )}

        <VerticalDots
          src={iconVerticalDots}
          alt=''
          onClick={() => openEditModal()}
        />

        {isEditingBoard && (
          <EditModal>
            <EditModalContent onClick={() => handleEditBoard()}>
              Edit board
            </EditModalContent>
            <DeleteBoard onClick={() => AddOpenDeleteModal()}>
              Delete board
            </DeleteBoard>
          </EditModal>
        )}
      </AddNewTask>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  background: ${({ theme }) => theme.navBarBackground};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 96px;
  width: 100%;
  padding: 29px 32px 37px 24px;

  @media (max-width: 768px) {
    height: 80px;
    width: 100%;
    padding: 28px 24px 27px 24px;
  }

  @media (max-width: 425px) {
    height: 64px;

    padding: 20px 16px 20px 16px;

    /* justify-content: start; */
    /* justify-content: center; */
  }
`;

const MobileWrapper = styled.div`
  @media (max-width: 425px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
`;

const IconImg = styled.img`
  display: none;

  @media (max-width: 425px) {
    display: block;
  }
`;

const HeaderInfo = styled.h3`
  color: ${({ theme }) => theme.textColor};
  font-weight: 700;
  font-size: 24px;
  line-height: 30px;

  @media (max-width: 768px) {
    font-size: 20px;
    line-height: 25px;
  }

  @media (max-width: 425px) {
  }
`;

const LogoMobile = styled.img`
  display: none;

  @media (max-width: 425px) {
    display: block;
  }
`;

const AddNewTask = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const AddButton = styled.button<styledProps>`
  background: #635fc7;
  border-radius: 24px;

  padding: 15px 25px;
  border: none;
  color: #fff;

  font-weight: 700;
  font-size: 15px;
  line-height: 19px;

  text-transform: capitalize;

  cursor: pointer;

  &:hover {
    background: #a8a4ff;
  }

  &:disabled {
    background: #635fc7;
    opacity: 0.3;
    cursor: not-allowed;
  }

  img {
    display: none;
  }

  // second span display none
  @media (max-width: 768px) {
  }

  @media (max-width: 425px) {
    span {
      display: none;
    }
    img {
      display: block;
    }

    padding: 10px 18px;
  }
`;

const IconMobileTask = styled.img``;

const VerticalDots = styled.img`
  cursor: pointer;
`;

const EditModal = styled.div`
  position: absolute;
  top: 85px;
  right: 24px;

  background: ${({ theme }) => theme.navBarBackground};
  box-shadow: 0px 10px 20px rgba(54, 78, 126, 0.25);
  border-radius: 8px;

  width: 192px;
  height: 94px;

  display: flex;
  flex-direction: column;
  /* justify-content: space-evenly; */

  padding: 16px;
  gap: 16px;
`;

const EditModalContent = styled.p`
  cursor: pointer;
  font-weight: 500;
  font-size: 13px;
  line-height: 23px;
  /* identical to box height, or 177% */

  /* Medium Grey */

  color: #828fa3;
`;

const DeleteBoard = styled.p`
  cursor: pointer;

  font-weight: 500;
  font-size: 13px;
  line-height: 23px;
  /* identical to box height, or 177% */

  /* Red */

  color: #ea5555;
`;
export default Header;
