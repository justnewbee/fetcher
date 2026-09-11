import {
  describe,
  test,
  expect
} from 'vitest';

import decodeTextIntoSseChunks from '../src/helper/fundamental/decode-text-into-sse-chunks';

function encode(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

describe('decodeTextIntoSseChunks', () => {
  test('extracts a single data line', () => {
    const input = encode('data:hello');

    expect(decodeTextIntoSseChunks(input)).toEqual(['hello']);
  });

  test('extracts multiple data lines', () => {
    const input = encode('data:hello\ndata:world');

    expect(decodeTextIntoSseChunks(input)).toEqual(['hello', 'world']);
  });

  test('strips data: prefix preserving content after it', () => {
    const input = encode('data: {"type":"msg","content":"hi"}');

    expect(decodeTextIntoSseChunks(input)).toEqual([' {"type":"msg","content":"hi"}']);
  });

  test('filters out retry lines', () => {
    const input = encode('retry:3000\ndata:hello');

    expect(decodeTextIntoSseChunks(input)).toEqual(['hello']);
  });

  test('filters out data:retry: lines', () => {
    const input = encode('data:retry:3000\ndata:hello');

    expect(decodeTextIntoSseChunks(input)).toEqual(['hello']);
  });

  test('filters out empty lines', () => {
    const input = encode('data:hello\n\ndata:world');

    expect(decodeTextIntoSseChunks(input)).toEqual(['hello', 'world']);
  });

  test('keeps lines without data: prefix as-is', () => {
    const input = encode('data:hello\nevent: message\ndata:world');

    expect(decodeTextIntoSseChunks(input)).toEqual(['hello', 'event: message', 'world']);
  });

  test('returns empty array for empty input', () => {
    const input = encode('');

    expect(decodeTextIntoSseChunks(input)).toEqual([]);
  });

  test('returns empty array for only empty lines', () => {
    const input = encode('\n\n\n');

    expect(decodeTextIntoSseChunks(input)).toEqual([]);
  });

  test('returns empty array for only retry lines', () => {
    const input = encode('retry:1000\nretry:2000');

    expect(decodeTextIntoSseChunks(input)).toEqual([]);
  });

  test('accepts ArrayBuffer input', () => {
    const input = encode('data:buffer').buffer;

    expect(decodeTextIntoSseChunks(input)).toEqual(['buffer']);
  });

  test('filters out data: lines with only whitespace content', () => {
    const input = encode('data:\ndata:hello');

    expect(decodeTextIntoSseChunks(input)).toEqual(['hello']);
  });

  test('preserves data: content with leading space', () => {
    const input = encode('data: hello\ndata: world');

    expect(decodeTextIntoSseChunks(input)).toEqual([' hello', ' world']);
  });

  test('handles mixed SSE fields and data lines', () => {
    const input = encode('event: message\nid: 1\ndata:payload\nretry:5000\ndata:done');

    expect(decodeTextIntoSseChunks(input)).toEqual(['event: message', 'id: 1', 'payload', 'done']);
  });
});
