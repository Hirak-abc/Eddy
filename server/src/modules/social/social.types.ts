// Social module types — Meta / Instagram / Facebook integration.
export interface MetaSignedRequestPayload {
  user_id?: string;
  algorithm?: string;
  issued_at?: number;
  [key: string]: unknown;
}

export type DataDeletionStatus = 'received' | 'in_progress' | 'completed';

export interface DataDeletionRequest {
  confirmationCode: string;
  metaUserId: string | null;
  status: DataDeletionStatus;
  receivedAt: string;
  statusUrl: string;
}
