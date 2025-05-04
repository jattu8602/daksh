import { NextResponse } from "next/server";

export function middleware(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/schools/:schoolId/classes/:classId/students/bulk',
};
