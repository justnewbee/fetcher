import assert from 'assert';

import {
  describe,
  test
} from 'vitest';

import {
  TextDecoder,
  TextEncoder
} from '../src';

const INVALID_SEQUENCES: { name: string; bytes: number[]; expected: string; }[] = [{
  name: 'invalid leading byte',
  bytes: [0xFF],
  expected: '\uFFFD'
}, {
  name: 'overlong 2-byte sequence',
  bytes: [0xC0, 0xAF],
  expected: '\uFFFD\uFFFD'
}, {
  name: 'overlong 3-byte sequence',
  bytes: [0xE0, 0x80],
  expected: '\uFFFD\uFFFD'
}, {
  name: 'truncated 3-byte sequence at the end',
  bytes: [0xE2, 0x82],
  expected: '\uFFFD'
}, {
  name: 'UTF-16 surrogate',
  bytes: [0xED, 0xA0, 0x80],
  expected: '\uFFFD\uFFFD\uFFFD'
}, {
  name: 'code point out of range',
  bytes: [0xF4, 0x90, 0x80, 0x80],
  expected: '\uFFFD\uFFFD\uFFFD\uFFFD'
}, {
  name: 'truncated sequence followed by an ASCII byte',
  bytes: [0xEF, 0xBB, 0x41],
  expected: '\uFFFDA'
}];

interface IDecoderOptions {
  fatal?: boolean;
  ignoreBOM?: boolean;
}

/**
 * The minimal surface shared by the shim and the native implementation.
 */
interface IDecoderLike {
  decode(input?: ArrayBufferLike | ArrayBufferView, options?: { stream?: boolean; }): string;
}

interface IDecodeOutcome {
  ok: boolean;
  value: string;
  error: unknown;
}

const DECODER_OPTIONS: IDecoderOptions[] = [{}, {
  fatal: true
}, {
  ignoreBOM: true
}, {
  fatal: true,
  ignoreBOM: true
}];

const DECODER_FIXTURES: { name: string; bytes: number[]; }[] = [{
  name: 'empty',
  bytes: []
}, {
  name: 'ASCII',
  bytes: [0x41, 0x42]
}, {
  name: '2-byte character',
  bytes: [0xC3, 0xA9]
}, {
  name: '3-byte character',
  bytes: [0xE4, 0xB8, 0xAD]
}, {
  name: '4-byte character',
  bytes: [0xF0, 0x9F, 0x98, 0x80]
}, {
  name: 'mixed characters',
  bytes: [0x41, 0xE4, 0xB8, 0xAD, 0xF0, 0x9F, 0x98, 0x80, 0x42]
}, {
  name: 'BOM at the beginning',
  bytes: [0xEF, 0xBB, 0xBF, 0x41]
}, {
  name: 'BOM only',
  bytes: [0xEF, 0xBB, 0xBF]
}, {
  name: 'BOM in the middle',
  bytes: [0x41, 0xEF, 0xBB, 0xBF, 0x42]
}, {
  name: 'max code point',
  bytes: [0xF4, 0x8F, 0xBF, 0xBF]
}, {
  name: 'invalid leading byte',
  bytes: [0x41, 0xFF, 0x42]
}, {
  name: 'continuation byte without a lead',
  bytes: [0x80, 0xBF]
}, {
  name: 'overlong 2-byte sequence',
  bytes: [0xC0, 0xAF]
}, {
  name: 'overlong 3-byte sequence',
  bytes: [0xE0, 0x80, 0xAF]
}, {
  name: 'overlong 4-byte sequence',
  bytes: [0xF0, 0x80, 0x80, 0xAF]
}, {
  name: 'truncated 2-byte sequence',
  bytes: [0xC3]
}, {
  name: 'truncated 3-byte sequence',
  bytes: [0xE2, 0x82]
}, {
  name: 'truncated 4-byte sequence',
  bytes: [0xF0, 0x9F, 0x98]
}, {
  name: 'UTF-16 surrogate',
  bytes: [0xED, 0xA0, 0x80]
}, {
  name: 'code point out of range',
  bytes: [0xF4, 0x90, 0x80, 0x80]
}, {
  name: 'truncated sequence followed by ASCII',
  bytes: [0xEF, 0xBB, 0x41]
}, {
  name: 'lead byte followed by a truncated lead byte',
  bytes: [0xE2, 0xF0, 0x9F]
}];

const VALID_SEQUENCES: number[][] = [
  [0x41],
  [0xC3, 0xA9],
  [0xE4, 0xB8, 0xAD],
  [0xF0, 0x9F, 0x98, 0x80],
  [0xEF, 0xBB, 0xBF],
  [0xF4, 0x8F, 0xBF, 0xBF]
];

function createRandom(seed: number): () => number {
  let state = seed;
  
  return (): number => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    
    return state;
  };
}

function decodeSafely(decoder: IDecoderLike, input: Uint8Array, stream: boolean): IDecodeOutcome {
  try {
    return {
      ok: true,
      value: decoder.decode(input, {
        stream
      }),
      error: undefined
    };
  } catch (err) {
    return {
      ok: false,
      value: '',
      error: err
    };
  }
}

function decodeChunksSafely(decoder: IDecoderLike, chunks: Uint8Array[]): IDecodeOutcome {
  let value = '';
  
  try {
    for (let index = 0; index < chunks.length; index += 1) {
      value += decoder.decode(chunks[index] ?? new Uint8Array(0), {
        stream: index < chunks.length - 1
      });
    }
    
    return {
      ok: true,
      value,
      error: undefined
    };
  } catch (err) {
    return {
      ok: false,
      value: '',
      error: err
    };
  }
}

function assertSameOutcome(actual: IDecodeOutcome, expected: IDecodeOutcome, message: string): void {
  if (expected.ok) {
    assert(actual.ok, `${message}: the shim threw but the native decoder did not`);
    assert.strictEqual(actual.value, expected.value, message);
    
    return;
  }
  
  assert(!actual.ok, `${message}: the native decoder threw but the shim did not`);
  assert(actual.error instanceof TypeError, `${message}: the shim should throw a TypeError`);
  assert(expected.error instanceof TypeError, `${message}: the native decoder should throw a TypeError`);
}

describe('\'TextDecoder\' class', () => {
  test('should have default configuration', () => {
    const decoder = new TextDecoder();
    
    assert.strictEqual(decoder.encoding, 'utf-8');
    assert.strictEqual(decoder.fatal, false);
    assert.strictEqual(decoder.ignoreBOM, false);
  });
  
  test('should accept the UTF-8 labels', () => {
    for (const label of ['utf-8', 'UTF-8', 'utf8', ' unicode-1-1-utf-8 ']) {
      assert.strictEqual(new TextDecoder(label).encoding, 'utf-8');
    }
  });
  
  test('should throw a RangeError for unsupported labels', () => {
    assert.throws(() => new TextDecoder('utf-16le'), RangeError);
    assert.throws(() => new TextDecoder('gbk'), RangeError);
  });
  
  test('should read the constructor options', () => {
    const decoder = new TextDecoder('utf-8', {
      fatal: true,
      ignoreBOM: true
    });
    
    assert.strictEqual(decoder.fatal, true);
    assert.strictEqual(decoder.ignoreBOM, true);
  });
  
  test('should throw a TypeError if a property is read from a non-TextDecoder object', () => {
    const descriptor = Object.getOwnPropertyDescriptor(TextDecoder.prototype, 'fatal');
    const getter = descriptor?.get;
    
    assert(getter);
    assert.throws(() => getter.call({}), TypeError);
  });
  
  test('should decode an empty input to an empty string', () => {
    assert.strictEqual(new TextDecoder().decode(), '');
    assert.strictEqual(new TextDecoder().decode(new Uint8Array(0)), '');
  });
  
  test('should decode ASCII bytes', () => {
    assert.strictEqual(new TextDecoder().decode(new Uint8Array([0x41, 0x42])), 'AB');
  });
  
  test('should decode multi-byte characters', () => {
    const bytes = new Uint8Array([0xE4, 0xB8, 0xAD, 0xE6, 0x96, 0x87, 0xF0, 0x9F, 0x98, 0x80]);
    
    assert.strictEqual(new TextDecoder().decode(bytes), '中文😀');
  });
  
  test('should decode an ArrayBuffer', () => {
    const bytes = new Uint8Array([0x41, 0x42]);
    
    assert.strictEqual(new TextDecoder().decode(bytes.buffer), 'AB');
  });
  
  test('should decode an ArrayBufferView with byte offset and length', () => {
    const buffer = new Uint8Array([0x00, 0x41, 0x42, 0x00]).buffer;
    
    assert.strictEqual(new TextDecoder().decode(new Uint8Array(buffer, 1, 2)), 'AB');
    assert.strictEqual(new TextDecoder().decode(new DataView(buffer, 1, 2)), 'AB');
  });
  
  test('should round-trip with TextEncoder', () => {
    const text = 'AB中文😀';
    
    assert.strictEqual(new TextDecoder().decode(new TextEncoder().encode(text)), text);
  });
  
  test('should strip the BOM by default', () => {
    assert.strictEqual(new TextDecoder().decode(new Uint8Array([0xEF, 0xBB, 0xBF, 0x41])), 'A');
  });
  
  test('should keep the BOM if ignoreBOM is true', () => {
    const decoder = new TextDecoder('utf-8', {
      ignoreBOM: true
    });
    
    assert.strictEqual(decoder.decode(new Uint8Array([0xEF, 0xBB, 0xBF, 0x41])), '\uFEFFA');
  });
  
  test('should strip the BOM on every non-streaming call', () => {
    const decoder = new TextDecoder();
    const bytes = new Uint8Array([0xEF, 0xBB, 0xBF, 0x41]);
    
    assert.strictEqual(decoder.decode(bytes), 'A');
    assert.strictEqual(decoder.decode(bytes), 'A');
  });
  
  test('should strip the BOM at the beginning of a stream', () => {
    const decoder = new TextDecoder();
    
    assert.strictEqual(decoder.decode(new Uint8Array([0xEF]), {
      stream: true
    }), '');
    assert.strictEqual(decoder.decode(new Uint8Array([0xBB, 0xBF, 0x41]), {
      stream: true
    }), 'A');
  });
  
  test('should not strip a BOM in the middle of the input', () => {
    assert.strictEqual(new TextDecoder().decode(new Uint8Array([0x41, 0xEF, 0xBB, 0xBF, 0x42])), 'A\uFEFFB');
  });
  
  test('should decode a code point split between two streaming chunks', () => {
    const decoder = new TextDecoder();
    
    assert.strictEqual(decoder.decode(new Uint8Array([0xE4]), {
      stream: true
    }), '');
    assert.strictEqual(decoder.decode(new Uint8Array([0xB8, 0xAD]), {
      stream: true
    }), '中');
    assert.strictEqual(decoder.decode(), '');
  });
  
  test('should replace an invalid continuation byte across streaming chunks', () => {
    const decoder = new TextDecoder();
    
    assert.strictEqual(decoder.decode(new Uint8Array([0xE2]), {
      stream: true
    }), '');
    assert.strictEqual(decoder.decode(new Uint8Array([0x41]), {
      stream: true
    }), '\uFFFDA');
    assert.strictEqual(decoder.decode(), '');
  });
  
  test('should complete a pending sequence on a non-streaming call', () => {
    const decoder = new TextDecoder();
    
    assert.strictEqual(decoder.decode(new Uint8Array([0xE2]), {
      stream: true
    }), '');
    assert.strictEqual(decoder.decode(new Uint8Array([0x82, 0xAC])), '€');
  });
  
  test('should flush a pending sequence on a non-streaming call', () => {
    const decoder = new TextDecoder();
    
    assert.strictEqual(decoder.decode(new Uint8Array([0xE2]), {
      stream: true
    }), '');
    assert.strictEqual(decoder.decode(), '\uFFFD');
  });
  
  for (const {
    name,
    bytes,
    expected
  } of INVALID_SEQUENCES) {
    test(`should replace the invalid sequence with U+FFFD: ${name}`, () => {
      assert.strictEqual(new TextDecoder().decode(new Uint8Array(bytes)), expected);
    });
    
    test(`should throw a TypeError for the invalid sequence if fatal: ${name}`, () => {
      assert.throws(() => new TextDecoder('utf-8', {
        fatal: true
      }).decode(new Uint8Array(bytes)), TypeError);
    });
  }
  
  test('should accept valid bytes if fatal', () => {
    const decoder = new TextDecoder('utf-8', {
      fatal: true
    });
    
    assert.strictEqual(decoder.decode(new Uint8Array([0x41, 0xE4, 0xB8, 0xAD])), 'A中');
  });
});

describe('\'TextDecoder\' compared with the native implementation', () => {
  test('should decode the same string as the native TextDecoder', () => {
    for (const fixture of DECODER_FIXTURES) {
      const bytes = new Uint8Array(fixture.bytes);
      
      for (const options of DECODER_OPTIONS) {
        assertSameOutcome(
            decodeSafely(new TextDecoder('utf-8', options), bytes, false),
            decodeSafely(new globalThis.TextDecoder('utf-8', options), bytes, false),
            `fixture: ${fixture.name}, options: ${JSON.stringify(options)}`
        );
      }
    }
  });
  
  test('should decode the same string as the native TextDecoder for every two-chunk split', () => {
    for (const fixture of DECODER_FIXTURES) {
      const bytes = new Uint8Array(fixture.bytes);
      
      for (let split = 0; split <= bytes.length; split += 1) {
        const chunks = [bytes.subarray(0, split), bytes.subarray(split)];
        
        for (const options of DECODER_OPTIONS) {
          assertSameOutcome(
              decodeChunksSafely(new TextDecoder('utf-8', options), chunks),
              decodeChunksSafely(new globalThis.TextDecoder('utf-8', options), chunks),
              `fixture: ${fixture.name}, split: ${split}, options: ${JSON.stringify(options)}`
          );
        }
      }
    }
  });
  
  test('should decode the same string as the native TextDecoder when fed byte by byte', () => {
    for (const fixture of DECODER_FIXTURES) {
      const chunks = fixture.bytes.map(byte => new Uint8Array([byte]));
      
      for (const options of DECODER_OPTIONS) {
        assertSameOutcome(
            decodeChunksSafely(new TextDecoder('utf-8', options), chunks),
            decodeChunksSafely(new globalThis.TextDecoder('utf-8', options), chunks),
            `fixture: ${fixture.name}, options: ${JSON.stringify(options)}`
        );
      }
    }
  });
  
  test('should decode the same string as the native TextDecoder for generated bytes', () => {
    const random = createRandom(0xB5297A4D);
    
    for (let iteration = 0; iteration < 300; iteration += 1) {
      const values: number[] = [];
      const target = random() % 17;
      
      while (values.length < target) {
        if (random() % 2 === 0) {
          values.push(...VALID_SEQUENCES[random() % VALID_SEQUENCES.length] ?? []);
        } else {
          values.push(random() % 256);
        }
      }
      
      const bytes = new Uint8Array(values);
      const message = `bytes: ${JSON.stringify(values)}`;
      
      for (const options of DECODER_OPTIONS) {
        assertSameOutcome(
            decodeSafely(new TextDecoder('utf-8', options), bytes, false),
            decodeSafely(new globalThis.TextDecoder('utf-8', options), bytes, false),
            `${message}, options: ${JSON.stringify(options)}`
        );
      }
      
      for (let split = 0; split <= bytes.length; split += 1) {
        const chunks = [bytes.subarray(0, split), bytes.subarray(split)];
        
        assertSameOutcome(
            decodeChunksSafely(new TextDecoder(), chunks),
            decodeChunksSafely(new globalThis.TextDecoder(), chunks),
            `${message}, split: ${split}`
        );
      }
    }
  });
  
  test('should decode the same string as the native TextDecoder for repeated calls on one instance', () => {
    const shim = new TextDecoder();
    const native = new globalThis.TextDecoder();
    
    for (const fixture of DECODER_FIXTURES) {
      const bytes = new Uint8Array(fixture.bytes);
      
      assertSameOutcome(
          decodeSafely(shim, bytes, false),
          decodeSafely(native, bytes, false),
          `fixture: ${fixture.name}`
      );
    }
  });
  
  test('should keep the same streaming state as the native TextDecoder across repeated calls', () => {
    const shim = new TextDecoder();
    const native = new globalThis.TextDecoder();
    const chunks = [0xE2, 0x41, 0xE4, 0xB8, 0xAD, 0xF0, 0x9F].map(byte => new Uint8Array([byte]));
    
    for (const chunk of chunks) {
      assertSameOutcome(
          decodeSafely(shim, chunk, true),
          decodeSafely(native, chunk, true),
          `chunk: ${JSON.stringify(Array.from(chunk))}`
      );
    }
    
    assertSameOutcome(decodeSafely(shim, new Uint8Array(0), false), decodeSafely(native, new Uint8Array(0), false), 'flush');
  });
});
