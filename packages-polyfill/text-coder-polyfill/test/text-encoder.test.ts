import assert from 'assert';

import {
  describe,
  test
} from 'vitest';

import {
  TextEncoder
} from '../src';

const NATIVE_TEXT_ENCODER = new globalThis.TextEncoder();

const ENCODER_SAMPLES: string[] = [
  '',
  'A',
  'Hello, world!',
  '\u0000\u007F',
  '\u0080\u07FF',
  '\u0800\uFFFF',
  'é中😀',
  'a😀b',
  '\uD800',
  '\uDC00',
  '\uD800\uD800',
  '\uDC00\uD800',
  '\uD800\uDC00\uD800',
  '\uDBFF\uDFFF',
  '\uFFFD\uFEFF',
  '\uD83D\uDE00\uD83C\uDF89'
];

/**
 * Create a deterministic pseudo-random number generator.
 */
function createRandom(seed: number): () => number {
  let state = seed;
  
  return (): number => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    
    return state;
  };
}

/**
 * Create a random UTF-16 code unit, including lone surrogates.
 */
function createRandomCodeUnit(random: () => number): number {
  const bucket = random() % 5;
  const offset = random();
  
  if (bucket === 0) {
    return offset % 0x80;
  }
  
  if (bucket === 1) {
    return 0x80 + (offset % 0x780);
  }
  
  if (bucket === 2) {
    return 0x800 + (offset % (0xD800 - 0x800));
  }
  
  if (bucket === 3) {
    return 0xD800 + (offset % 0x800);
  }
  
  return 0xE000 + (offset % (0x10000 - 0xE000));
}

describe('\'TextEncoder\' class', () => {
  test('should have \'utf-8\' as the encoding', () => {
    assert.strictEqual(new TextEncoder().encoding, 'utf-8');
  });
  
  test('should encode an empty string to empty bytes', () => {
    assert.deepStrictEqual(Array.from(new TextEncoder().encode('')), []);
    assert.deepStrictEqual(Array.from(new TextEncoder().encode()), []);
  });
  
  test('should encode ASCII characters', () => {
    assert.deepStrictEqual(Array.from(new TextEncoder().encode('AB')), [0x41, 0x42]);
  });
  
  test('should encode 2-byte characters', () => {
    assert.deepStrictEqual(Array.from(new TextEncoder().encode('\u00E9')), [0xC3, 0xA9]);
  });
  
  test('should encode 3-byte characters', () => {
    assert.deepStrictEqual(Array.from(new TextEncoder().encode('中文')), [0xE4, 0xB8, 0xAD, 0xE6, 0x96, 0x87]);
  });
  
  test('should encode 4-byte characters', () => {
    assert.deepStrictEqual(Array.from(new TextEncoder().encode('😀')), [0xF0, 0x9F, 0x98, 0x80]);
  });
  
  test('should replace a lone high surrogate with U+FFFD', () => {
    assert.deepStrictEqual(Array.from(new TextEncoder().encode('\uD800')), [0xEF, 0xBF, 0xBD]);
    assert.deepStrictEqual(Array.from(new TextEncoder().encode('\uD800A')), [0xEF, 0xBF, 0xBD, 0x41]);
  });
  
  test('should replace a lone low surrogate with U+FFFD', () => {
    assert.deepStrictEqual(Array.from(new TextEncoder().encode('\uDC00')), [0xEF, 0xBF, 0xBD]);
  });
  
  test('should encode into the whole destination', () => {
    const destination = new Uint8Array(5);
    const result = new TextEncoder().encodeInto('a😀b', destination);
    
    assert.deepStrictEqual(result, {
      read: 3,
      written: 5
    });
    assert.deepStrictEqual(Array.from(destination), [0x61, 0xF0, 0x9F, 0x98, 0x80]);
  });
  
  test('should stop before the code point which does not fully fit in the destination', () => {
    const destination = new Uint8Array(3);
    const result = new TextEncoder().encodeInto('a😀', destination);
    
    assert.deepStrictEqual(result, {
      read: 1,
      written: 1
    });
    assert.deepStrictEqual(Array.from(destination), [0x61, 0x00, 0x00]);
  });
  
  test('should write nothing if the first code point does not fit in the destination', () => {
    const destination = new Uint8Array(2);
    const result = new TextEncoder().encodeInto('\uD800', destination);
    
    assert.deepStrictEqual(result, {
      read: 0,
      written: 0
    });
  });
  
  test('should encode into an empty destination', () => {
    const result = new TextEncoder().encodeInto('AB', new Uint8Array(0));
    
    assert.deepStrictEqual(result, {
      read: 0,
      written: 0
    });
  });
});

describe('\'TextEncoder\' compared with the native implementation', () => {
  test('should encode the same bytes as the native TextEncoder', () => {
    for (const sample of ENCODER_SAMPLES) {
      const actual = Array.from(new TextEncoder().encode(sample));
      const expected = Array.from(NATIVE_TEXT_ENCODER.encode(sample));
      
      assert.deepStrictEqual(actual, expected, `input: ${JSON.stringify(sample)}`);
    }
  });
  
  test('should encode the same bytes as the native TextEncoder for generated strings', () => {
    const random = createRandom(0x1BADB002);
    
    for (let iteration = 0; iteration < 200; iteration += 1) {
      const length = random() % 13;
      let input = '';
      
      for (let index = 0; index < length; index += 1) {
        input += String.fromCharCode(createRandomCodeUnit(random));
      }
      
      const actual = Array.from(new TextEncoder().encode(input));
      const expected = Array.from(NATIVE_TEXT_ENCODER.encode(input));
      
      assert.deepStrictEqual(actual, expected, `input: ${JSON.stringify(input)}`);
    }
  });
  
  test('should return the same result as the native encodeInto for every destination size', () => {
    for (const sample of ENCODER_SAMPLES) {
      const byteLength = NATIVE_TEXT_ENCODER.encode(sample).length;
      
      for (let size = 0; size <= byteLength + 1; size += 1) {
        const actualDestination = new Uint8Array(size);
        const expectedDestination = new Uint8Array(size);
        const actual = new TextEncoder().encodeInto(sample, actualDestination);
        const expected = NATIVE_TEXT_ENCODER.encodeInto(sample, expectedDestination);
        
        assert.deepStrictEqual(actual, expected, `input: ${JSON.stringify(sample)}, size: ${size}`);
        assert.deepStrictEqual(Array.from(actualDestination), Array.from(expectedDestination), `input: ${JSON.stringify(sample)}, size: ${size}`);
      }
    }
  });
});
