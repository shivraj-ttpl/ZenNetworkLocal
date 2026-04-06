/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';

import Button from '@/components/commonComponents/button/Button';

import ModalComponent from './ModalComponent';

export default {
  title: 'Components/ModalComponent',
  component: ModalComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export const Default = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <ModalComponent
          title="Modal Title"
          open={open}
          close={() => setOpen(false)}
          customClasses="w-[480px]"
        >
          <p className="text-sm text-neutral-600">
            This is the modal body content. You can put any content here.
          </p>
        </ModalComponent>
      </>
    );
  },
};

export const WithSubtitle = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal with Subtitle</Button>
        <ModalComponent
          title="Patient Details"
          subtitle="View and manage patient information"
          open={open}
          close={() => setOpen(false)}
          customClasses="w-[520px]"
        >
          <p className="text-sm text-neutral-600">Patient details go here.</p>
        </ModalComponent>
      </>
    );
  },
};

export const WithFooterButtons = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal with Footer</Button>
        <ModalComponent
          title="Confirm Action"
          open={open}
          close={() => setOpen(false)}
          customClasses="w-[440px]"
          footerButton={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primaryBlue" onClick={() => setOpen(false)}>
                Confirm
              </Button>
            </>
          }
        >
          <p className="text-sm text-neutral-600">
            Are you sure you want to proceed with this action? This cannot be
            undone.
          </p>
        </ModalComponent>
      </>
    );
  },
};

export const WithEditAndDelete = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open with Edit & Delete</Button>
        <ModalComponent
          title="Record Details"
          open={open}
          close={() => setOpen(false)}
          customClasses="w-[480px]"
          showEditIcon
          edit={() => alert('Edit clicked')}
          showDeleteIcon
          deleteClick={() => alert('Delete clicked')}
        >
          <p className="text-sm text-neutral-600">Record content goes here.</p>
        </ModalComponent>
      </>
    );
  },
};

export const NoCloseIcon = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open (No Close Icon)</Button>
        <ModalComponent
          title="Important Notice"
          open={open}
          close={() => setOpen(false)}
          showIcon={false}
          customClasses="w-[400px]"
          footerButton={
            <Button variant="primaryBlue" onClick={() => setOpen(false)}>
              Acknowledge
            </Button>
          }
        >
          <p className="text-sm text-neutral-600">
            You must click the button below to dismiss this modal.
          </p>
        </ModalComponent>
      </>
    );
  },
};
