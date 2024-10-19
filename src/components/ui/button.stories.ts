import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "./button";

type ButtonVariants = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;

const variants: ButtonVariants[] = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
] as const;

const meta = {
  title: "Example/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: variants },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const stories = Object.fromEntries(
  variants.map((variant) => [
    variant,
    {
      args: {
        variant,
        children: "Button",
      },
    },
  ])
) as Record<ButtonVariants, Story>;

export const Default = stories["default"];
export const Destructive = stories["destructive"];
export const Outline = stories["outline"];
export const Secondary = stories["secondary"];
export const Ghost = stories["ghost"];
export const Link = stories["link"];
