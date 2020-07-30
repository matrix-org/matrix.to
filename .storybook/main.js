module.exports = {
    stories: ['../src/**/*.stories.tsx'],
    addons: [
        '@storybook/preset-create-react-app',
        '@storybook/addon-actions',
        '@storybook/addon-links',
        '@storybook/addon-storysource',
        '@storybook/addon-viewport/register',
        '@storybook/addon-a11y/register',
        '@storybook/addon-knobs/register',
        '@storybook/addon-actions/register',
        'storybook-addon-designs',
        '@storybook/addon-backgrounds/register',
    ],
};
