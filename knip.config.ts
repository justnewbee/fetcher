import {
  KnipConfig
} from 'knip';

export default {
  workspaces: {
    '.': {
      entry: [
        'taze.config.ts'
      ]
    }
  },
  tags: ['-lintignore'],
  ignoreBinaries: [
    'cnpm',
    'prepublishOnly'
  ]
} satisfies KnipConfig;
