export interface BoardType {
  boards: {
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
  }[];
}

export interface newTask {
  title: string;
  description: string;
  status: string;
  subtasks: {
    title: string;
    isCompleted: boolean;
  }[];
}

export interface newColumn {
  name?: string;
  tasks?: [];
}

export interface newBoard extends newColumn {
  id?: number;
  name: string;
  columns: {
    name: string;
    tasks: {
      title: string;
      description: string;
      status: string;
      subtasks: { title: string; isCompleted: boolean }[];
    }[];
  }[];
}
