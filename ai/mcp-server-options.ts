/**
 * Network defaults for the MCP HTTP transport.
 *
 * A host is intentionally resolved separately from the server setup so the
 * safety-critical default can be exercised without starting the full MCP
 * process (and its native rendering dependencies).
 */
export const DEFAULT_HTTP_HOST = "127.0.0.1"

function getFlagValue(args: readonly string[], flag: string): string | undefined {
  const inlinePrefix = `${flag}=`
  for (let index = 0; index < args.length; index++) {
    const argument = args[index]
    if (argument.startsWith(inlinePrefix)) return argument.slice(inlinePrefix.length)
    if (argument !== flag) continue

    const next = args[index + 1]
    return next && !next.startsWith("--") ? next : undefined
  }
  return undefined
}

/**
 * Resolve the HTTP bind host. Node's `server.listen(port)` binds to an
 * unspecified address (typically all interfaces), so callers must always pass
 * this result to `listen`. A non-loopback address is possible only through an
 * explicit CLI flag or `MCP_HOST` environment variable.
 */
export function resolveHTTPListenHost(
  args: readonly string[],
  env: { MCP_HOST?: string | undefined } = process.env,
): string {
  return getFlagValue(args, "--host")?.trim() || env.MCP_HOST?.trim() || DEFAULT_HTTP_HOST
}

export type McpToolProfile = "public" | "developer"

/**
 * Resolve the MCP tool profile. The default is `developer` only when no value
 * was supplied; any supplied value other than `public` or `developer` throws
 * so a typo can never silently expose the developer tool surface.
 */
export function resolveToolProfile(
  args: readonly string[],
  env: { MCP_TOOL_PROFILE?: string | undefined } = process.env,
): McpToolProfile {
  const flagPresent = args.some((argument) => argument === "--profile" || argument.startsWith("--profile="))
  const requested = flagPresent ? getFlagValue(args, "--profile")?.trim() ?? "" : env.MCP_TOOL_PROFILE?.trim()
  if (!flagPresent && !requested) return "developer"
  if (requested === "public" || requested === "developer") return requested
  throw new Error(
    `Invalid MCP tool profile ${JSON.stringify(requested)}: expected "public" or "developer"`,
  )
}

/** Resolve the HTTP port from `--port <n>` or `--port=<n>`, defaulting to 3001. */
export function resolveHTTPPort(args: readonly string[]): number {
  const parsed = parseInt(getFlagValue(args, "--port") ?? "", 10)
  return Number.isFinite(parsed) ? parsed : 3001
}
