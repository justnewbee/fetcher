import {
  KnipConfig
} from 'knip';

export default {
  workspaces: {
    'packages-*/*': {
      entry: [
        'src/index.{ts,tsx}'
      ],
      project: [
        'src/**/*.{ts,tsx}',
        'stories/**/*.{ts,tsx}'
      ]
    }
  },
  tags: ['-lintignore']
} satisfies KnipConfig;
