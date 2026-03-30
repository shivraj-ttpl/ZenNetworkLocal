import { useState } from "react";
import { Formik } from "formik";
import TextArea from "./index";

// TextArea uses Formik's ErrorMessage internally — wrap with Formik context
const FormikDecorator = (Story) => (
  <Formik initialValues={{ notes: "", description: "" }} onSubmit={() => {}}>
    <Story />
  </Formik>
);

export default {
  title: "Components/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  decorators: [FormikDecorator],
  argTypes: {
    rows: { control: "number" },
    disabled: { control: "boolean" },
    isRequired: { control: "boolean" },
    shadow: { control: "boolean" },
    enforceMaxRows: { control: "boolean" },
    label: { control: "text" },
    placeholder: { control: "text" },
  },
};

export const Default = {
  args: {
    label: "Notes",
    name: "notes",
    placeholder: "Type here",
    rows: "4",
  },
};

export const WithValue = {
  render: () => {
    const [value, setValue] = useState("This is some pre-filled text.");
    return (
      <Formik initialValues={{ notes: "" }} onSubmit={() => {}}>
        <TextArea
          label="Notes"
          name="notes"
          value={value}
          onChangeCb={(e) => setValue(e.target.value)}
          rows="4"
        />
      </Formik>
    );
  },
};

export const Required = {
  args: {
    label: "Description",
    name: "description",
    placeholder: "Enter description...",
    isRequired: true,
    rows: "4",
  },
};

export const Disabled = {
  args: {
    label: "Notes",
    name: "notes",
    value: "Read-only content that cannot be edited.",
    disabled: true,
    rows: "4",
  },
};

export const WithShadow = {
  args: {
    label: "Comments",
    name: "notes",
    placeholder: "Add a comment...",
    shadow: true,
    rows: "3",
  },
};

export const TallRows = {
  args: {
    label: "Long Description",
    name: "description",
    placeholder: "Enter a detailed description...",
    rows: "8",
  },
};
