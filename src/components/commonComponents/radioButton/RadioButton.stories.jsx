/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';

import RadioButton from './index';

export default {
  title: 'Components/RadioButton',
  component: RadioButton,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    value: { control: 'text' },
  },
};

export const Default = {
  render: () => {
    const [selected, setSelected] = useState('option1');
    return (
      <RadioButton
        label="Option One"
        name="example"
        value="option1"
        checked={selected === 'option1'}
        onChangeCb={() => setSelected('option1')}
      />
    );
  },
};

export const Checked = {
  args: {
    label: 'Selected option',
    name: 'radio',
    value: 'yes',
    checked: true,
  },
};

export const Unchecked = {
  args: {
    label: 'Unselected option',
    name: 'radio',
    value: 'no',
    checked: false,
  },
};

export const Disabled = {
  args: {
    label: 'Disabled option',
    name: 'radio',
    value: 'disabled',
    checked: false,
    disabled: true,
  },
};

export const DisabledChecked = {
  args: {
    label: 'Disabled & checked',
    name: 'radio',
    value: 'disabledChecked',
    checked: true,
    disabled: true,
  },
};

export const RadioGroup = {
  render: () => {
    const [selected, setSelected] = useState('monthly');
    const options = [
      { label: 'Monthly', value: 'monthly' },
      { label: 'Quarterly', value: 'quarterly' },
      { label: 'Annually', value: 'annually' },
    ];
    return (
      <div className="flex flex-col gap-3 p-4">
        {options.map((opt) => (
          <RadioButton
            key={opt.value}
            label={opt.label}
            name="billing"
            value={opt.value}
            checked={selected === opt.value}
            onChangeCb={() => setSelected(opt.value)}
          />
        ))}
      </div>
    );
  },
};

export const HorizontalGroup = {
  render: () => {
    const [selected, setSelected] = useState('male');
    const options = [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
      { label: 'Other', value: 'other' },
    ];
    return (
      <div className="flex gap-6 p-4">
        {options.map((opt) => (
          <RadioButton
            key={opt.value}
            label={opt.label}
            name="gender"
            value={opt.value}
            checked={selected === opt.value}
            onChangeCb={() => setSelected(opt.value)}
          />
        ))}
      </div>
    );
  },
};
