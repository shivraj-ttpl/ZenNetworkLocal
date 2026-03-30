import Button from "./Button";

export default {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "link", "primaryBlue", "outlineBlue", "brandPrimary"],
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
    children: { control: "text" },
  },
};

export const Primary = {
  args: {
    children: "Primary Button",
    variant: "primary",
    size: "md",
  },
};

export const Secondary = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
    size: "md",
  },
};

export const Outline = {
  args: {
    children: "Outline Button",
    variant: "outline",
    size: "md",
  },
};

export const Ghost = {
  args: {
    children: "Ghost Button",
    variant: "ghost",
    size: "md",
  },
};

export const Link = {
  args: {
    children: "Link Button",
    variant: "link",
    size: "md",
  },
};

export const PrimaryBlue = {
  args: {
    children: "Primary Blue",
    variant: "primaryBlue",
    size: "md",
  },
};

export const OutlineBlue = {
  args: {
    children: "Outline Blue",
    variant: "outlineBlue",
    size: "md",
  },
};

export const Loading = {
  args: {
    children: "Saving...",
    variant: "primary",
    loading: true,
  },
};

export const Disabled = {
  args: {
    children: "Disabled",
    variant: "primary",
    disabled: true,
  },
};

export const SmallSize = {
  args: {
    children: "Small",
    variant: "primary",
    size: "sm",
  },
};

export const LargeSize = {
  args: {
    children: "Large",
    variant: "primary",
    size: "lg",
  },
};

export const FullWidth = {
  args: {
    children: "Full Width Button",
    variant: "primary",
    fullWidth: true,
  },
};

export const AllVariants = {
  render: () => (
    <div className="flex flex-wrap gap-3 p-4">
      {["primary", "secondary", "outline", "ghost", "link", "primaryBlue", "outlineBlue", "brandPrimary"].map(
        (variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        )
      )}
    </div>
  ),
};
