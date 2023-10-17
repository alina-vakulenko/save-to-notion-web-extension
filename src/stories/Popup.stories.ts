import type { Meta, StoryObj } from "@storybook/react";
import Popup from "../components/Popup";

const meta = {
  title: "Popup",
  component: Popup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    pageData: { title: "Page title", url: "example@gmail.com" },
  },
} satisfies Meta<typeof Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
