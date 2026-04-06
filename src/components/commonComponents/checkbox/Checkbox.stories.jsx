/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';

import Checkbox from './Checkbox';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'secondary', 'blue'],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
};

export const Default = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        label="Accept terms and conditions"
        name="terms"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    );
  },
};

export const Checked = {
  args: {
    label: 'Already selected',
    name: 'checked',
    checked: true,
  },
};

export const Indeterminate = {
  args: {
    label: 'Partially selected',
    name: 'indeterminate',
    indeterminate: true,
    checked: false,
  },
};

export const Disabled = {
  args: {
    label: 'Disabled option',
    name: 'disabled',
    checked: false,
    disabled: true,
  },
};

export const DisabledChecked = {
  args: {
    label: 'Disabled & checked',
    name: 'disabledChecked',
    checked: true,
    disabled: true,
  },
};

export const PrimaryVariant = {
  args: {
    label: 'Primary',
    name: 'primary',
    variant: 'primary',
    checked: true,
  },
};

export const SecondaryVariant = {
  args: {
    label: 'Secondary',
    name: 'secondary',
    variant: 'secondary',
    checked: true,
  },
};

export const BlueVariant = {
  args: { label: 'Blue', name: 'blue', variant: 'blue', checked: true },
};

export const AllVariants = {
  render: () => {
    const [state, setState] = useState({
      primary: true,
      secondary: true,
      blue: true,
    });
    return (
      <div className="flex flex-col gap-3 p-4">
        {['primary', 'secondary', 'blue'].map((variant) => (
          <Checkbox
            key={variant}
            label={`${variant} variant`}
            name={variant}
            variant={variant}
            checked={state[variant]}
            onChange={(e) =>
              setState((s) => ({ ...s, [variant]: e.target.checked }))
            }
          />
        ))}
      </div>
    );
  },
};

export const SizeOptions = {
  render: () => (
    <div className="flex flex-col gap-3 p-4">
      {['sm', 'md', 'lg'].map((size) => (
        <Checkbox
          key={size}
          label={`Size: ${size}`}
          name={size}
          size={size}
          checked
        />
      ))}
    </div>
  ),
};
