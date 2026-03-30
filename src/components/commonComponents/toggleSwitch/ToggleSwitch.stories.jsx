import { useState } from "react";
import ToggleSwitch from "./ToggleSwitch";

export default {
  title: "Components/ToggleSwitch",
  component: ToggleSwitch,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    showLabel: { control: "boolean" },
    activeLabel: { control: "text" },
    inactiveLabel: { control: "text" },
    title: { control: "text" },
  },
};

export const Default = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <ToggleSwitch
        name="status"
        checked={checked}
        onChangeCb={setChecked}
        title="Toggle status"
      />
    );
  },
};

export const Active = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <ToggleSwitch
        name="status"
        checked={checked}
        onChangeCb={setChecked}
        title="Status"
      />
    );
  },
};

export const Disabled = {
  args: {
    name: "status",
    checked: false,
    disabled: true,
    title: "Disabled toggle",
  },
};

export const DisabledActive = {
  args: {
    name: "status",
    checked: true,
    disabled: true,
    title: "Disabled active toggle",
  },
};

export const CustomLabels = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <ToggleSwitch
        name="publish"
        checked={checked}
        onChangeCb={setChecked}
        activeLabel="ON"
        inactiveLabel="OFF"
        title="Publish status"
      />
    );
  },
};

export const NoLabel = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <ToggleSwitch
        name="status"
        checked={checked}
        onChangeCb={setChecked}
        showLabel={false}
        title="Toggle"
      />
    );
  },
};
