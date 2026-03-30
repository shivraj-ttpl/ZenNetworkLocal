import { useState } from "react";
import Drawer from "./Drawer";
import Button from "@/components/commonComponents/button/Button";

export default {
  title: "Components/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export const Default = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <Drawer
          title="Drawer Title"
          open={open}
          close={() => setOpen(false)}
        >
          <p className="text-sm text-neutral-600">
            This is the drawer body content. You can put any content here.
          </p>
        </Drawer>
      </div>
    );
  },
};

export const WithSubtitle = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open with Subtitle</Button>
        <Drawer
          title="Patient Details"
          subtitle="View patient information"
          open={open}
          close={() => setOpen(false)}
        >
          <p className="text-sm text-neutral-600">Patient details go here.</p>
        </Drawer>
      </div>
    );
  },
};

export const WithFooter = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open with Footer</Button>
        <Drawer
          title="Edit Record"
          open={open}
          close={() => setOpen(false)}
          footerButton={
            <div className="flex gap-2 p-3">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primaryBlue" onClick={() => setOpen(false)}>
                Save Changes
              </Button>
            </div>
          }
        >
          <p className="text-sm text-neutral-600">
            Edit form fields would go here.
          </p>
        </Drawer>
      </div>
    );
  },
};

export const WideDrawer = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Wide Drawer</Button>
        <Drawer
          title="Wide Drawer"
          open={open}
          close={() => setOpen(false)}
          width="w-[600px]"
        >
          <p className="text-sm text-neutral-600">
            This drawer is wider — useful for forms or detail views.
          </p>
        </Drawer>
      </div>
    );
  },
};

export const LeftPosition = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>Open Left Drawer</Button>
        <Drawer
          title="Left Drawer"
          open={open}
          close={() => setOpen(false)}
          position="left"
        >
          <p className="text-sm text-neutral-600">
            This drawer slides in from the left side.
          </p>
        </Drawer>
      </div>
    );
  },
};
