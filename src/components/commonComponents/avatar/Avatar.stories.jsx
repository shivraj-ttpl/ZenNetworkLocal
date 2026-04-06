import Avatar from './Avatar';

export default {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '4xl', '6xl'],
    },
    variant: {
      control: 'radio',
      options: ['circle', 'square'],
    },
    online: {
      control: 'select',
      options: [undefined, true, false],
    },
    name: { control: 'text' },
    src: { control: 'text' },
  },
};

export const WithInitials = {
  args: {
    name: 'John Doe',
    size: 'md',
  },
};

export const WithImage = {
  args: {
    src: 'https://i.pravatar.cc/150?img=3',
    name: 'Jane Smith',
    size: 'md',
  },
};

export const OnlineStatus = {
  args: {
    name: 'Alice Walker',
    size: 'md',
    online: true,
  },
};

export const OfflineStatus = {
  args: {
    name: 'Bob Martin',
    size: 'md',
    online: false,
  },
};

export const SquareVariant = {
  args: {
    name: 'Tom Clark',
    size: 'md',
    variant: 'square',
  },
};

export const SingleInitial = {
  args: {
    name: 'Marcus',
    size: 'md',
  },
};

export const NoName = {
  args: {
    size: 'md',
  },
};

export const AllSizes = {
  render: () => (
    <div className="flex items-end gap-4 p-4">
      {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map((size) => (
        <div key={size} className="flex flex-col items-center gap-1">
          <Avatar name="John Doe" size={size} />
          <span className="text-xs text-neutral-500">{size}</span>
        </div>
      ))}
    </div>
  ),
};
