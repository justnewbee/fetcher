/**
 * The flags of listeners.
 */
export const enum EListenerFlags {
  None = 0,
  Capture = 0x01,
  Passive = 0x02,
  Once = 0x04,
  Removed = 0x08
}
