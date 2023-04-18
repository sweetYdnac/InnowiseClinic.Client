import { ReactNode } from 'react';

export default interface ICard {
    id: string;
    title: string;
    subtitle: string;
    photo: string;
    content: ReactNode;
}
