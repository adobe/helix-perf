module.exports = {
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    ['@semantic-release/changelog', {
      'changelogFile': 'CHANGELOG.md',
    }],
    ['@semantic-release/exec', {
      'prepareCmd': 'npm run semantic-prepare ${nextRelease.version}',
      'publishCmd': 'npm run deploy'
    }],
    ['@semantic-release/git', {
      'assets': ['package.json', 'package-lock.json', 'CHANGELOG.md'],
      'message': 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
    }],
    ['@semantic-release/github', {}]
  ],
  'branch': 'master'
};