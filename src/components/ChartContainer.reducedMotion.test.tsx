import * as React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { ChartContainer } from "./ChartContainer"

describe("ChartContainer loading skeleton", () => {
  it("disables the shimmer animation under prefers-reduced-motion", () => {
    const html = renderToStaticMarkup(
      <ChartContainer title="Loading" loading>
        <div>Chart</div>
      </ChartContainer>
    )
    expect(html).toContain('class="semiotic-skeleton"')
    expect(html).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{\s*\.semiotic-skeleton \{ animation: none !important; \}/
    )
  })
})
