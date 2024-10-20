import { composeStories } from "@storybook/react";
import { render, screen } from "@testing-library/react";
import { expect } from "vitest";

import { Button } from "./button";
import * as stories from "./button.stories";

const { Default } = composeStories(stories);

describe("Button", () => {
  it("should render a button", () => {
    render(<Button />);
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("should render a default button", () => {
    render(<Default />);
    expect(screen.getByRole("button")).toBeDefined();
  });
});
