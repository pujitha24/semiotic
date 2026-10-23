import { DEFAULT_HTTP_HOST, resolveHTTPListenHost, resolveHTTPPort, resolveToolProfile } from "./mcp-server-options"

describe("MCP HTTP listen host", () => {
  it("uses loopback when neither a CLI flag nor environment override is present", () => {
    expect(resolveHTTPListenHost([], {})).toBe(DEFAULT_HTTP_HOST)
  })

  it("allows a deliberate environment override", () => {
    expect(resolveHTTPListenHost([], { MCP_HOST: "0.0.0.0" })).toBe("0.0.0.0")
  })

  it("gives an explicit --host flag precedence over MCP_HOST", () => {
    expect(resolveHTTPListenHost(["--host", "0.0.0.0"], { MCP_HOST: "127.0.0.1" })).toBe("0.0.0.0")
    expect(resolveHTTPListenHost(["--host=::1"], { MCP_HOST: "0.0.0.0" })).toBe("::1")
  })

  it("does not turn a missing or blank --host value into a public bind", () => {
    expect(resolveHTTPListenHost(["--host"], {})).toBe(DEFAULT_HTTP_HOST)
    expect(resolveHTTPListenHost(["--host", "   "], {})).toBe(DEFAULT_HTTP_HOST)
  })
})

describe("MCP tool profile", () => {
  it("defaults to developer when nothing is supplied", () => {
    expect(resolveToolProfile([], {})).toBe("developer")
  })

  it("accepts both flag forms and the environment variable", () => {
    expect(resolveToolProfile(["--profile=public"], {})).toBe("public")
    expect(resolveToolProfile(["--profile", "public"], {})).toBe("public")
    expect(resolveToolProfile([], { MCP_TOOL_PROFILE: "public" })).toBe("public")
    expect(resolveToolProfile(["--profile", "developer"], { MCP_TOOL_PROFILE: "public" })).toBe("developer")
  })

  it("fails closed on unknown, miscased, or valueless profiles", () => {
    expect(() => resolveToolProfile(["--profile", "pubic"], {})).toThrow(/Invalid MCP tool profile/)
    expect(() => resolveToolProfile(["--profile=Public"], {})).toThrow()
    expect(() => resolveToolProfile(["--profile"], {})).toThrow()
    expect(() => resolveToolProfile(["--profile="], {})).toThrow()
    expect(() => resolveToolProfile([], { MCP_TOOL_PROFILE: "pubic" })).toThrow()
  })
})

describe("MCP HTTP port", () => {
  it("parses both flag forms and defaults to 3001", () => {
    expect(resolveHTTPPort(["--port=4000"])).toBe(4000)
    expect(resolveHTTPPort(["--port", "4000"])).toBe(4000)
    expect(resolveHTTPPort([])).toBe(3001)
  })
})
