import React from 'react';
import { addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { withDesign } from 'storybook-addon-designs'
import { addParameters } from '@storybook/react';

import SingleColumn from '../src/layouts/SingleColumn';



// Default styles
import "../src/index.scss";

addDecorator(
    storyFn => <SingleColumn>{storyFn()}</SingleColumn>
);

addDecorator(withA11y);

addDecorator(withKnobs);

addDecorator(withDesign);

addParameters({
    backgrounds: [
        {name: 'light', value: '#F4F4F4', default: true},
        {name: 'white', value: '#FFFFFF'},
    ],
});
