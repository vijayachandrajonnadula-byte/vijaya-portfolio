import type { ComponentType } from 'react';
import Art1 from './Art1';
import Art2 from './Art2';
import Art3 from './Art3';
import Art4 from './Art4';
import Art5 from './Art5';
import Art6 from './Art6';
import Art7 from './Art7';
import type { ArtProps } from './types';

/** Principle number (1..7) -> its art component. Each ArtN.tsx has one owner. */
export const ARTS: Record<number, ComponentType<ArtProps>> = { 1: Art1, 2: Art2, 3: Art3, 4: Art4, 5: Art5, 6: Art6, 7: Art7 };