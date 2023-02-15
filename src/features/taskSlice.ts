import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import data from '../db/data.json';
import { BoardType, newTask, newBoard, newColumn } from '../types/boardType';

// Define a type for the slice state
interface TaskState {
  boards: BoardType['boards'];
  isSidebarOpen: boolean;

  selectedBoardId: number | string;
  addNewTaskModal: boolean;
  taskModal: boolean;
  taskObject: newTask;
  isEditing: boolean;
  isEditingBoard: boolean;
  newBoardModal: boolean;
  deleteModal: boolean;
  newColumnModal: boolean;
}

// Define the initial state using that type
const initialState: TaskState = {
  boards: data.boards,
  isSidebarOpen: false,
  selectedBoardId: 1,
  addNewTaskModal: false,
  taskModal: false,
  taskObject: { title: '', description: '', status: '', subtasks: [] },
  isEditing: false,
  isEditingBoard: false,
  newBoardModal: false,
  deleteModal: false,
  newColumnModal: false,
};

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    toggleSidebar: state => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },

    openSidebar: state => {
      state.isSidebarOpen = true;
    },

    closeSidebar: state => {
      state.isSidebarOpen = false;
    },
    handleBoardSelect: (state, action: PayloadAction<number | string>) => {
      state.selectedBoardId = action.payload;
    },

    openTaskModal: state => {
      state.addNewTaskModal = true;
    },

    closeAddNewTaskModal: state => {
      state.addNewTaskModal = false;
    },

    // taskModal Close
    closeTaskModal: state => {
      state.taskModal = false;
    },

    // deleteModal Open
    openDeleteModal: state => {
      state.deleteModal = true;
    },

    // deleteModal Close
    closeDeleteModal: state => {
      state.deleteModal = false;
    },

    // taskModal Open
    openTaskCard: (state, action: PayloadAction<newTask>) => {
      state.taskModal = true;
      state.taskObject = action.payload;
    },

    // set isEditing to true
    setIsEditing: state => {
      state.isEditing = true;
    },

    // set isEditing false
    setIsEditingFalse: state => {
      state.isEditing = false;
    },

    // set isEditingBoard to true
    setIsEditingBoard: state => {
      state.isEditingBoard = true;
    },

    // set isEditingBoard false
    setIsEditingBoardFalse: state => {
      state.isEditingBoard = false;
    },

    // open newBoardModal
    openNewBoardModal: state => {
      state.newBoardModal = true;
    },

    // close newBoardModal
    closeNewBoardModal: state => {
      state.newBoardModal = false;
    },

    // open newColumnModal
    openNewColumnModal: state => {
      state.newColumnModal = true;
    },

    // close newColumnModal
    closeNewColumnModal: state => {
      state.newColumnModal = false;
    },

    //create a new task
    createTask: (state, action: PayloadAction<newTask>) => {
      const { title, description, subtasks, status } = action.payload;

      const selectedBoard = state.boards.find(
        board => board.id === state.selectedBoardId
      );

      if (selectedBoard) {
        selectedBoard.columns = selectedBoard.columns.map(column => {
          if (column.name === status) {
            return {
              ...column,
              tasks: [
                ...column.tasks,
                { title, description, subtasks, status },
              ],
            };
          }
          return column;
        });
      }

      state.addNewTaskModal = false;
    },

    // delete a task
    deleteTask: state => {
      const selectedBoard = state.boards.find(
        board => board.id === state.selectedBoardId
      );

      // delete the task from the  taskObject
      if (selectedBoard) {
        selectedBoard.columns = selectedBoard.columns.map(column => {
          if (column.name === state.taskObject.status) {
            return {
              ...column,
              tasks: column.tasks.filter(
                task => task.title !== state.taskObject.title
              ),
            };
          }
          return column;
        });

        // close the taskModal
        state.taskModal = false;
      }
    },

    // create a new board
    createNewBoard: (state, action: PayloadAction<newBoard>) => {
      const { name, columns } = action.payload;

      // create a new board
      const newBoard = {
        id: state.boards.length + 1,
        name,
        columns,
      };

      // check if the board name already exists
      const boardExists = state.boards.find(
        board => board.name.toLowerCase() === name.toLowerCase()
      );

      if (boardExists) {
        return alert('Board with same name already exists');
      }

      // add the new board to the boards array
      state.boards = [...state.boards, newBoard];

      // close the newBoardModal
      state.newBoardModal = false;
    },

    // delete a board
    deleteBoard: (state, action: PayloadAction<number>) => {
      const boardId = action.payload;

      // delete the board from the boards array
      state.boards = state.boards.filter(board => board.id !== boardId);

      // isEditing false
      state.isEditing = false;

      // set the selectedBoardId to the first board
      state.selectedBoardId = state.boards[0].id;
    },

    // edit a board
    editBoard: (state, action: PayloadAction<newBoard>) => {
      const { name, columns } = action.payload;

      // update the board
      state.boards = state.boards.map(board => {
        if (board.id === state.selectedBoardId) {
          return {
            ...board,
            name,
            columns,
          };
        }
        return board;
      });

      // close the newBoardModal
      state.newBoardModal = false;
    },

    // edit a task
    editTask: (state, action: PayloadAction<newTask>) => {
      const { title, description, subtasks, status } = action.payload;

      const selectedBoard = state.boards.find(
        board => board.id === state.selectedBoardId
      );

      if (selectedBoard) {
        selectedBoard.columns = selectedBoard.columns.map(column => {
          return {
            ...column,
            tasks: column.tasks.map(task => {
              if (task.title === state.taskObject.title) {
                return {
                  ...task,
                  title,
                  description,
                  subtasks,
                  status,
                };
              }
              return task;
            }),
          };
        });
      }

      // update the taskObject
      state.taskObject = {
        ...state.taskObject,
        title,
        description,
        subtasks,
        status,
      };

      // close the taskModal
      state.addNewTaskModal = false;
    },

    // move a task

    // change subtask status isCompleted true/false and update the taskObject
    changeSubtaskStatus: (
      state,
      action: PayloadAction<{ subtaskTitle: string }>
    ) => {
      const { subtaskTitle } = action.payload;

      // update the taskObject
      const newTaskObject = state.taskObject.subtasks.map(subtask => {
        if (subtask.title === subtaskTitle) {
          return {
            ...subtask,
            isCompleted: !subtask.isCompleted,
          };
        }
        return subtask;
      });

      // change task status in the board
      const selectedBoard = state.boards.find(
        board => board.id === state.selectedBoardId
      );
      if (selectedBoard) {
        selectedBoard.columns = selectedBoard.columns.map(column => {
          if (column.name === state.taskObject.status) {
            return {
              ...column,
              tasks: column.tasks.map(task => {
                if (task.title === state.taskObject.title) {
                  return {
                    ...task,
                    subtasks: newTaskObject,
                  };
                }
                return task;
              }),
            };
          }
          return column;
        });
      }
      // update the taskObject
      state.taskObject = {
        ...state.taskObject,
        subtasks: newTaskObject,
      };
    },

    // Change current task status in taskObject and update the board
    changeTaskStatus: (state, action: PayloadAction<{ status: string }>) => {
      const { status } = action.payload;

      const selectedBoard = state.boards.find(
        board => board.id === state.selectedBoardId
      );

      if (!selectedBoard) {
        return;
      }

      const { taskObject } = state;

      const newColumns = selectedBoard.columns.map(column => {
        const { name, tasks } = column;

        if (name === taskObject.status) {
          return {
            ...column,
            tasks: tasks.filter(task => task.title !== taskObject.title),
          };
        }

        if (name === status) {
          return { ...column, tasks: [...tasks, { ...taskObject, status }] };
        }

        return column;
      });

      state.boards = state.boards.map(board =>
        board.id === selectedBoard.id
          ? { ...selectedBoard, columns: newColumns }
          : board
      );

      // close the taskModal
      state.taskModal = false;
    },

    createNewColumn: (state, action: PayloadAction<any>) => {
      const { inputValue } = action.payload;
      const selectedBoard = state.boards.find(
        board => board.id === state.selectedBoardId
      );

      if (selectedBoard) {
        selectedBoard.columns = [
          ...selectedBoard.columns,
          { name: inputValue, tasks: [] },
        ];
      }

      // close the newColumnModal
      state.newColumnModal = false;
    },
  },
});

export const {
  toggleSidebar,
  handleBoardSelect,
  openTaskModal,
  closeAddNewTaskModal,
  createTask,
  changeSubtaskStatus,
  changeTaskStatus,
  closeTaskModal,
  openTaskCard,
  deleteTask,
  setIsEditing,
  setIsEditingFalse,
  editTask,
  openNewBoardModal,
  closeNewBoardModal,
  createNewBoard,
  deleteBoard,
  editBoard,
  openDeleteModal,
  closeDeleteModal,
  createNewColumn,
  openNewColumnModal,
  closeNewColumnModal,
  closeSidebar,
  openSidebar,

  setIsEditingBoard,
  setIsEditingBoardFalse,
} = taskSlice.actions;

export default taskSlice.reducer;
