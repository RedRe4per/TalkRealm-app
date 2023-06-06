import React from 'react';
import Button from '@/components/buttons';
import type { StoryFn, StoryObj } from '@storybook/react';

export default {
  title: 'Example/Button',
  component: Button,
} as StoryObj<typeof Button>;

const Template: StoryFn = (args: any) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Button',
};



