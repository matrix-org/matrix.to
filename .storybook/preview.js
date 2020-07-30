import React from 'react';
import { addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { withDesign } from 'storybook-addon-designs'
import { addParameters } from '@storybook/react';



// Default styles
import "../src/index.scss";

addDecorator(
  storyFn => <div style={{ textAlign: 'center' }}>{storyFn()}</div>
);

addDecorator(withA11y);

addDecorator(withKnobs);

addDecorator(withDesign);

addParameters({
  backgrounds: [
    {name: 'light', value: '#F4F4F4'},
    {name: 'white', value: '#FFFFFF', default: true},
  ]
});
