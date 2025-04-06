import dayjs from 'dayjs';
import { atom } from 'jotai';

export const loadingAtom = atom<boolean>(false);
export const snackbarAtom = atom<string>('');

export const monthFilterAtom = atom<number | 'all'>(dayjs().month());
