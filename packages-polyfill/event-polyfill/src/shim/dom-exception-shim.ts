import {
  IErrorCapture
} from '../types';

const INDEX_SIZE_ERR = 1;
const DOMSTRING_SIZE_ERR = 2;
const HIERARCHY_REQUEST_ERR = 3;
const WRONG_DOCUMENT_ERR = 4;
const INVALID_CHARACTER_ERR = 5;
const NO_DATA_ALLOWED_ERR = 6;
const NO_MODIFICATION_ALLOWED_ERR = 7;
const NOT_FOUND_ERR = 8;
const NOT_SUPPORTED_ERR = 9;
const INUSE_ATTRIBUTE_ERR = 10;
const INVALID_STATE_ERR = 11;
const SYNTAX_ERR = 12;
const INVALID_MODIFICATION_ERR = 13;
const NAMESPACE_ERR = 14;
const INVALID_ACCESS_ERR = 15;
const VALIDATION_ERR = 16;
const TYPE_MISMATCH_ERR = 17;
const SECURITY_ERR = 18;
const NETWORK_ERR = 19;
const ABORT_ERR = 20;
const URL_MISMATCH_ERR = 21;
const QUOTA_EXCEEDED_ERR = 22;
const TIMEOUT_ERR = 23;
const INVALID_NODE_TYPE_ERR = 24;
const DATA_CLONE_ERR = 25;

const NAME_TO_CODE: Record<string, number> = {
  IndexSizeError: INDEX_SIZE_ERR,
  DomstringSizeError: DOMSTRING_SIZE_ERR,
  HierarchyRequestError: HIERARCHY_REQUEST_ERR,
  WrongDocumentError: WRONG_DOCUMENT_ERR,
  InvalidCharacterError: INVALID_CHARACTER_ERR,
  NoDataAllowedError: NO_DATA_ALLOWED_ERR,
  NoModificationAllowedError: NO_MODIFICATION_ALLOWED_ERR,
  NotFoundError: NOT_FOUND_ERR,
  NotSupportedError: NOT_SUPPORTED_ERR,
  InuseAttributeError: INUSE_ATTRIBUTE_ERR,
  InvalidStateError: INVALID_STATE_ERR,
  SyntaxError: SYNTAX_ERR,
  InvalidModificationError: INVALID_MODIFICATION_ERR,
  NamespaceError: NAMESPACE_ERR,
  InvalidAccessError: INVALID_ACCESS_ERR,
  ValidationError: VALIDATION_ERR,
  TypeMismatchError: TYPE_MISMATCH_ERR,
  SecurityError: SECURITY_ERR,
  NetworkError: NETWORK_ERR,
  AbortError: ABORT_ERR,
  UrlMismatchError: URL_MISMATCH_ERR,
  QuotaExceededError: QUOTA_EXCEEDED_ERR,
  TimeoutError: TIMEOUT_ERR,
  InvalidNodeTypeError: INVALID_NODE_TYPE_ERR,
  DataCloneError: DATA_CLONE_ERR
};

/**
 * A `DOMException` shim for environments that don't provide one.
 *
 * @see https://dom.spec.whatwg.org/#dom-domexception-domexception
 */
export default class DOMExceptionShim extends Error { // eslint-disable-line @typescript-eslint/naming-convention
  static readonly INDEX_SIZE_ERR = INDEX_SIZE_ERR;
  static readonly DOMSTRING_SIZE_ERR = DOMSTRING_SIZE_ERR;
  static readonly HIERARCHY_REQUEST_ERR = HIERARCHY_REQUEST_ERR;
  static readonly WRONG_DOCUMENT_ERR = WRONG_DOCUMENT_ERR;
  static readonly INVALID_CHARACTER_ERR = INVALID_CHARACTER_ERR;
  static readonly NO_DATA_ALLOWED_ERR = NO_DATA_ALLOWED_ERR;
  static readonly NO_MODIFICATION_ALLOWED_ERR = NO_MODIFICATION_ALLOWED_ERR;
  static readonly NOT_FOUND_ERR = NOT_FOUND_ERR;
  static readonly NOT_SUPPORTED_ERR = NOT_SUPPORTED_ERR;
  static readonly INUSE_ATTRIBUTE_ERR = INUSE_ATTRIBUTE_ERR;
  static readonly INVALID_STATE_ERR = INVALID_STATE_ERR;
  static readonly SYNTAX_ERR = SYNTAX_ERR;
  static readonly INVALID_MODIFICATION_ERR = INVALID_MODIFICATION_ERR;
  static readonly NAMESPACE_ERR = NAMESPACE_ERR;
  static readonly INVALID_ACCESS_ERR = INVALID_ACCESS_ERR;
  static readonly VALIDATION_ERR = VALIDATION_ERR;
  static readonly TYPE_MISMATCH_ERR = TYPE_MISMATCH_ERR;
  static readonly SECURITY_ERR = SECURITY_ERR;
  static readonly NETWORK_ERR = NETWORK_ERR;
  static readonly ABORT_ERR = ABORT_ERR;
  static readonly URL_MISMATCH_ERR = URL_MISMATCH_ERR;
  static readonly QUOTA_EXCEEDED_ERR = QUOTA_EXCEEDED_ERR;
  static readonly TIMEOUT_ERR = TIMEOUT_ERR;
  static readonly INVALID_NODE_TYPE_ERR = INVALID_NODE_TYPE_ERR;
  static readonly DATA_CLONE_ERR = DATA_CLONE_ERR;
  
  readonly INDEX_SIZE_ERR = INDEX_SIZE_ERR;
  readonly DOMSTRING_SIZE_ERR = DOMSTRING_SIZE_ERR;
  readonly HIERARCHY_REQUEST_ERR = HIERARCHY_REQUEST_ERR;
  readonly WRONG_DOCUMENT_ERR = WRONG_DOCUMENT_ERR;
  readonly INVALID_CHARACTER_ERR = INVALID_CHARACTER_ERR;
  readonly NO_DATA_ALLOWED_ERR = NO_DATA_ALLOWED_ERR;
  readonly NO_MODIFICATION_ALLOWED_ERR = NO_MODIFICATION_ALLOWED_ERR;
  readonly NOT_FOUND_ERR = NOT_FOUND_ERR;
  readonly NOT_SUPPORTED_ERR = NOT_SUPPORTED_ERR;
  readonly INUSE_ATTRIBUTE_ERR = INUSE_ATTRIBUTE_ERR;
  readonly INVALID_STATE_ERR = INVALID_STATE_ERR;
  readonly SYNTAX_ERR = SYNTAX_ERR;
  readonly INVALID_MODIFICATION_ERR = INVALID_MODIFICATION_ERR;
  readonly NAMESPACE_ERR = NAMESPACE_ERR;
  readonly INVALID_ACCESS_ERR = INVALID_ACCESS_ERR;
  readonly VALIDATION_ERR = VALIDATION_ERR;
  readonly TYPE_MISMATCH_ERR = TYPE_MISMATCH_ERR;
  readonly SECURITY_ERR = SECURITY_ERR;
  readonly NETWORK_ERR = NETWORK_ERR;
  readonly ABORT_ERR = ABORT_ERR;
  readonly URL_MISMATCH_ERR = URL_MISMATCH_ERR;
  readonly QUOTA_EXCEEDED_ERR = QUOTA_EXCEEDED_ERR;
  readonly TIMEOUT_ERR = TIMEOUT_ERR;
  readonly INVALID_NODE_TYPE_ERR = INVALID_NODE_TYPE_ERR;
  readonly DATA_CLONE_ERR = DATA_CLONE_ERR;
  
  code = 0;
  
  constructor(message?: string, name = 'Error') {
    super(message);
    
    this.name = name;
    this.code = NAME_TO_CODE[name] ?? 0;
    
    (Error as IErrorCapture).captureStackTrace?.(this, DOMExceptionShim);
  }
}
