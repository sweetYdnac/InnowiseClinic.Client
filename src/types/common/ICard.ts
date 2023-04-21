import { ReactNode } from 'react';

export default interface ICard<T> {
    id: string;
    title: string;
    subtitle: string;
    photo: string;
    content: ReactNode;

    dto?: T;
}
