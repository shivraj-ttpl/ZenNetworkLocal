import { useState } from "react";
import SelectDropdown from "./SelectDropdown";

const FRUIT_OPTIONS = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Grape", value: "grape" },
  { label: "Mango", value: "mango" },
  { label: "Orange", value: "orange" },
  { label: "Strawberry", value: "strawberry" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
];

export default {
  title: "Components/SelectDropdown",
  component: SelectDropdown,
  tags: ["autodocs"],
  argTypes: {
    isMulti: { control: "boolean" },
    isSearchable: { control: "boolean" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    selectAll: { control: "boolean" },
    label: { control: "text" },
    placeholder: { control: "text" },
    error: { control: "text" },
    touched: { control: "boolean" },
  },
};

export const Default = {
  render: () => {
    const [value, setValue] = useState(null);
    return (
      <div className="w-72">
        <SelectDropdown
          label="Fruit"
          name="fruit"
          options={FRUIT_OPTIONS}
          value={value}
          onChange={setValue}
          placeholder="Select a fruit..."
        />
      </div>
    );
  },
};

export const WithPreselectedValue = {
  render: () => {
    const [value, setValue] = useState({ label: "Mango", value: "mango" });
    return (
      <div className="w-72">
        <SelectDropdown
          label="Fruit"
          name="fruit"
          options={FRUIT_OPTIONS}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

export const Searchable = {
  render: () => {
    const [value, setValue] = useState(null);
    return (
      <div className="w-72">
        <SelectDropdown
          label="Status"
          name="status"
          options={STATUS_OPTIONS}
          value={value}
          onChange={setValue}
          isSearchable
          placeholder="Search status..."
        />
      </div>
    );
  },
};

export const MultiSelect = {
  render: () => {
    const [value, setValue] = useState([]);
    return (
      <div className="w-72">
        <SelectDropdown
          label="Fruits"
          name="fruits"
          options={FRUIT_OPTIONS}
          value={value}
          onChange={setValue}
          isMulti
          placeholder="Select fruits..."
        />
      </div>
    );
  },
};

export const MultiSelectWithSelectAll = {
  render: () => {
    const [value, setValue] = useState([]);
    return (
      <div className="w-72">
        <SelectDropdown
          label="Fruits"
          name="fruits"
          options={FRUIT_OPTIONS}
          value={value}
          onChange={setValue}
          isMulti
          selectAll
          placeholder="Select fruits..."
        />
      </div>
    );
  },
};

export const Required = {
  render: () => {
    const [value, setValue] = useState(null);
    return (
      <div className="w-72">
        <SelectDropdown
          label="Status"
          name="status"
          options={STATUS_OPTIONS}
          value={value}
          onChange={setValue}
          required
          placeholder="Select status..."
        />
      </div>
    );
  },
};

export const WithError = {
  render: () => {
    const [value, setValue] = useState(null);
    return (
      <div className="w-72">
        <SelectDropdown
          label="Status"
          name="status"
          options={STATUS_OPTIONS}
          value={value}
          onChange={setValue}
          required
          error="This field is required"
          touched
          placeholder="Select status..."
        />
      </div>
    );
  },
};

export const Disabled = {
  render: () => (
    <div className="w-72">
      <SelectDropdown
        label="Status"
        name="status"
        options={STATUS_OPTIONS}
        value={{ label: "Active", value: "active" }}
        onChange={() => {}}
        disabled
      />
    </div>
  ),
};

export const StringOptions = {
  render: () => {
    const [value, setValue] = useState(null);
    return (
      <div className="w-72">
        <SelectDropdown
          label="Priority"
          name="priority"
          options={["Low", "Medium", "High", "Critical"]}
          value={value}
          onChange={setValue}
          placeholder="Select priority..."
        />
      </div>
    );
  },
};
