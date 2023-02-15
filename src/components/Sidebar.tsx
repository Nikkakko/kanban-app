import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import logoDark from '../assets/logo-dark.svg';
import logoLight from '../assets/logo-light.svg';
import boardLogo from '../assets/icon-board.svg';
import iconDark from '../assets/icon-dark-theme.svg';
import iconLight from '../assets/icon-light-theme.svg';
import iconHideSidebar from '../assets/icon-hide-sidebar.svg';
import { darkTheme } from '../styles/defaultTheme';
import Switch from 'react-switch';
import {
  closeSidebar,
  handleBoardSelect,
  openNewBoardModal,
  toggleSidebar,
} from '../features/taskSlice';
import { useState } from 'react';

type SidebarProps = {
  toggleTheme: () => void;
  theme: any;
};

type styledProps = {
  isActive: boolean;
};

const Sidebar = ({ toggleTheme, theme }: SidebarProps) => {
  const dispatch = useAppDispatch();
  const { boards, selectedBoardId, isSidebarOpen } = useAppSelector(
    state => state.task
  );

  const handleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const createNewBoard = () => {
    dispatch(openNewBoardModal());
  };

  const isActiveSidebar = () => {
    if (window.innerWidth <= 425) {
      dispatch(toggleSidebar());
    }
  };

  return (
    <SideBarContainer isActive={false}>
      <TopContent>
        <Logo>
          <LogoImg
            src={theme === darkTheme ? logoLight : logoDark}
            alt='logo'
          />
        </Logo>

        <Lists>
          <AllBoards>all boards ({boards.length})</AllBoards>
          <UnlistedItems>
            {boards.map(board => (
              <ListItems
                key={board.id}
                onClick={() => {
                  dispatch(handleBoardSelect(board.id));
                  isActiveSidebar();
                }}
                isActive={board.id === selectedBoardId}
              >
                <BoardLogo src={boardLogo} alt='board logo' />
                {board.name}
              </ListItems>
            ))}
            <ListItems isActive={false} onClick={() => createNewBoard()}>
              <BoardLogo src={boardLogo} alt='board logo' />
              <NewBoard>+ Create New Board</NewBoard>
            </ListItems>
          </UnlistedItems>
        </Lists>
      </TopContent>
      <Bottom>
        <ThemeChange>
          <img src={iconLight} alt='icon' />
          <Switch
            onChange={toggleTheme}
            checked={theme === darkTheme}
            checkedIcon={false}
            uncheckedIcon={false}
            height={20}
            width={40}
            offColor='#635FC7'
            onColor='#635FC7'
            handleDiameter={14}
          />
          <img src={iconDark} alt='icon' />
        </ThemeChange>
        <HideSidebar onClick={handleSidebar} isActive={false}>
          <img src={iconHideSidebar} alt='hideSidebar' />
          <span>Hide Sidebar</span>
        </HideSidebar>
      </Bottom>
    </SideBarContainer>
  );
};

const SideBarContainer = styled.div<styledProps>`
  background-color: ${({ theme }) => theme.navBarBackground};

  // set border-right based on theme === darkTheme
  border-right: ${({ theme }) =>
    theme === darkTheme ? '1px solid #3e3f4e' : '1px solid ##E4EBFA'};

  width: 300px;
  /* height: 100vh; */

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 0 0 auto;

  padding: 32px 34px;
  z-index: 1;

  @media (max-width: 768px) {
    width: 260px;
    padding: 32px 24px;
  }

  @media (max-width: 425px) {
    /* display: none; */

    position: absolute;

    width: 264px;
    height: auto;

    top: 80px;
    left: 54px;

    border: none;
    box-shadow: 0px 10px 20px rgba(54, 78, 126, 0.25);
    border-radius: 8px;

    padding: 24px 24px;
  }
`;

const Logo = styled.div`
  @media (max-width: 425px) {
    display: none;
  }
`;
const LogoImg = styled.img``;

const Lists = styled.div`
  margin-top: 54px;
  ul {
    list-style: none;
    margin-top: 19px;
  }

  @media (max-width: 425px) {
    margin-top: 0px;
  }
`;
const ThemeChange = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 23px;
  padding: 14px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.background};
`;
const HideSidebar = styled.div<styledProps>`
  display: flex;
  align-items: center;
  margin-top: 22px;
  gap: 15px;

  cursor: pointer;

  span {
    font-weight: 700;
    font-size: 15px;
    line-height: 19px;
    /* identical to box height */

    /* Medium Grey */

    color: #828fa3;

    transition: all 0.3s ease-in-out;
  }
  @media (max-width: 425px) {
    display: none;
  }

  &:hover {
    span {
      color: ${({ theme }) => (theme ? '#635FC7' : '#635FC7')};
    }
  }

  &::before {
    content: '';
    position: absolute;
    width: 246px;
    height: 48px;
    border-radius: ${({ theme }) => (theme ? '0px 100px 100px 0px;' : 'none')};
    left: 0;
    z-index: -1;
    transition: all 0.3s ease-in-out;
  }

  &:hover::before {
    background: ${({ theme }) =>
      theme === darkTheme ? '#fff' : 'rgba(99, 95, 199, 0.1)'};

    border-radius: 0px 100px 100px 0px;
  }
`;

const TopContent = styled.div`
  /* display: flex; */
`;
const Bottom = styled.div`
  /* display: flex; */
  /* flex-direction: column; */
`;

const AllBoards = styled.span`
  font-weight: 700;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 2.4px;
  text-transform: uppercase;

  /* Medium Grey */

  color: #828fa3;
`;

const UnlistedItems = styled.ul``;

const ListItems = styled.li<styledProps>`
  display: flex;
  align-items: center;
  gap: 16px;
  /* margin-top: 14px; */
  padding: 14px 0px;
  color: ${({ isActive }) => (isActive ? '#fff' : '#828fa3')};

  &:hover {
    color: ${({ isActive }) => (isActive ? '#fff' : '#635FC7')};
  }

  &::before {
    content: '';
    position: absolute;
    width: 276px;
    height: 48px;
    background: ${({ isActive }) => (isActive ? '#635FC7' : 'none')};
    border-radius: ${({ isActive }) =>
      isActive ? '0px 100px 100px 0px;' : 'none'};
    left: 0;
    z-index: -1;

    transition: all 0.3s ease-in-out;

    @media (max-width: 768px) {
      width: 240px;
    }
  }

  &:hover::before {
    background: ${({ isActive, theme }) =>
      isActive
        ? '#635FC7'
        : theme === darkTheme
        ? '#fff'
        : 'rgba(99, 95, 199, 0.1)'};
    border-radius: 0px 100px 100px 0px;
  }

  @media (max-width: 768px) {
    font-weight: 700;
    font-size: 15px;
    line-height: 19px;
    /* identical to box height */

    /* White */

    /* color: #ffffff; */
  }

  font-weight: 700;
  font-size: 15px;
  line-height: 19px;
  /* identical to box height */

  /* White */

  cursor: pointer;
`;

const BoardLogo = styled.img``;

const NewBoard = styled.span`
  font-weight: 700;
  font-size: 15px;
  line-height: 19px;
  /* identical to box height */

  /* Main Purple */

  color: #635fc7;
`;

export default Sidebar;
