export interface PiWindow extends Window {
  Pi: {
    init: (config: PiConfig) => Promise<void>
    authenticate: (scopes: string[], callbacks?: PiCallbacks) => Promise<PiAuthResult>
    createPayment: (
      payment: PiPayment,
      callbacks?: PiCallbacks
    ) => Promise<PiPaymentResult>
    openShareDialog: (data: PiShareData) => Promise<void>
  }
}

export interface PiConfig {
  version: string
  sandbox: boolean
  appId: string
  network?: string
}

export interface PiCallbacks {
  onReadyForServerApproval?: (paymentId: string) => void
  onReadyForServerCompletion?: (paymentId: string, txid: string) => void
  onCancel?: (paymentId: string) => void
  onError?: (error: Error, payment?: PiPayment) => void
  onIncompletePaymentFound?: (payment: any) => void
}

export interface PiAuthResult {
  user: {
    uid: string
    username: string
  }
  accessToken: string
}

export interface PiPayment {
  amount: number
  memo: string
  metadata?: Record<string, any>
  uid?: string
}

export interface PiPaymentResult {
  identifier: string
  transactionId?: string
}

export interface PiShareData {
  title: string
  description?: string
  media?: string[]
}

declare global {
  interface Window extends PiWindow {}
}
