import {
  Mock
} from 'vitest';

export interface ICreateMockResponseOptions {
  hang?: boolean;
  readerCancel?: Mock<() => Promise<void>>;
}

export interface ICreateMockResponseResult extends Response {
  done: Promise<void>;
  readerCancel: Mock<(reason?: unknown) => void>;
}
