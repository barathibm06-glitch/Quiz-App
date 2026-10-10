// Only allow redirects to paths inside this app (prevents open redirects).
export function safeNextPath(next?: string | null) {
  if (
    !next ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    next.startsWith("/\\")
  ) {
    return "/dashboard";
  }
  return next;
}
