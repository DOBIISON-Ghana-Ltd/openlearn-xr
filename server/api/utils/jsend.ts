import { NextResponse } from 'next/server'

export type JSendStatus = 'success' | 'fail' | 'error'

export interface JSendEnvelope<T = any> {
  status: JSendStatus
  data?: T
  message?: string
}

export function jsend<T = any>(
  status: JSendStatus,
  data?: T,
  message?: string,
  statusCode = 200
) {
  const body: JSendEnvelope<T> = { status }
  if (data !== undefined) body.data = data
  if (message !== undefined) body.message = message

  return NextResponse.json(body, { status: statusCode })
}

jsend.success = <T = any>(data?: T, statusCode = 200) => {
  return jsend('success', data, undefined, statusCode)
}

jsend.fail = <T = any>(data?: T, message?: string, statusCode = 400) => {
  return jsend('fail', data, message, statusCode)
}

jsend.error = (message: string, statusCode = 500, data?: any) => {
  return jsend('error', data, message, statusCode)
}
