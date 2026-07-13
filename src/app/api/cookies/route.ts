import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { apiHandler } from '@/lib/utils/api-handler'

export const GET = apiHandler(async (request: NextRequest) => {
  // Option 1: Log from NextRequest
  console.log('--- COOKIES FROM NEXTREQUEST ---')
  console.log(request.cookies.getAll())

  // Option 2: Log from next/headers
  const cookieStore = await cookies()
  console.log('--- COOKIES FROM NEXT/HEADERS ---')
  console.log(cookieStore.getAll())

  const response = NextResponse.json({ success: true, message: 'Cookies logged to server console and better-auth.session_data cleared.' })

  // Clear the session_data cookie from the response
  response.cookies.delete('better-auth.session_data')

  return response
})
