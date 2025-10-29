export async function register(): Promise<void> {
  // Verify config during startup
  await import("@/config");
}
