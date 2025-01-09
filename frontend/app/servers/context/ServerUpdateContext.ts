'use client';
import {createContext} from 'react';

export const ServerUpdateContext = createContext<() => void>(() => {});
