export interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    author: string;
    __v: number;
}

export type NewTask = Omit<Task, '_id' | 'author' | '__v'>; 