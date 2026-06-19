import { NextResponse } from "next/server";

export const JSend = {
  success: <T>(data: T, status = 200) => 
    NextResponse.json({ status: "success", data }, { status }),
  
  error: (message: string, status = 500, code?: number) => 
    NextResponse.json({ status: "error", message, code }, { status }),
};