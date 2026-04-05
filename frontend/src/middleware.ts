import { auth } from "@/lib/auth/server";

const authMiddleware = auth.middleware({
  loginUrl: "/auth/login",
});

export default authMiddleware;

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};
