import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renders initials when no image is provided", () => {
    render(<Avatar name="Alex Morgan" />);
    expect(screen.getByRole("img", { name: "Alex Morgan" })).toHaveTextContent("AM");
  });

  it("renders an image when src is provided", () => {
    render(<Avatar name="Alex Morgan" src="https://example.com/avatar.png" />);
    expect(screen.getByRole("img", { name: "Alex Morgan" }).querySelector("img")).toHaveAttribute(
      "src",
      "https://example.com/avatar.png",
    );
  });
});
