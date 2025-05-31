/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom/vitest';
import ResizeObserver from 'resize-observer-polyfill';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

global.ResizeObserver = ResizeObserver;
declare global {
  let __AUTH_STATE_CHANGE_CALLBACK__:
    | ((event: string, session: any) => void)
    | undefined;
}

afterEach(() => {
  cleanup();
});
