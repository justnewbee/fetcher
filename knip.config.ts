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
  tags: ['-lintignore']
} satisfies KnipConfig;
