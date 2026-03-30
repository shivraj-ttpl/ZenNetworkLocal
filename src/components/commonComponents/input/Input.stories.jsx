import { useState } from "react";
import Input from "./Input";

export default {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "tel"],
    },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    touched: { control: "boolean" },
    label: { control: "text" },
    placeholder: { control: "text" },
    error: { control: "text" },
  },
};

export const Default = {
  args: {
    label: "Full Name",
    name: "fullName",
    placeholder: "Enter your full name",
  },
};

export const WithValue = {
  render: () => {
    const [value, setValue] = useState("John Doe");
    return (
      <Input
        label="Full Name"
        name="fullName"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter your full name"
      />
    );
  },
};

export const Required = {
  args: {
    label: "Email Address",
    name: "email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
};

export const Password = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    );
  },
};

export const WithError = {
  args: {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "Enter your email",
    value: "invalid-email",
    error: "Please enter a valid email address",
    touched: true,
  },
};

export const Disabled = {
  args: {
    label: "Username",
    name: "username",
    value: "johndoe",
    disabled: true,
  },
};

export const NoLabel = {
  args: {
    name: "search",
    placeholder: "Search...",
  },
};
