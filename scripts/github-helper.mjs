import { Octokit } from '@octokit/rest';

let connectionSettings;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function listRepositories() {
  const octokit = await getGitHubClient();
  const { data } = await octokit.repos.listForAuthenticatedUser({
    sort: 'updated',
    per_page: 10
  });
  
  console.log('\n📚 Your GitHub Repositories:');
  console.log('════════════════════════════════════════\n');
  data.forEach(repo => {
    console.log(`  ${repo.full_name}`);
    console.log(`  └─ ${repo.description || 'No description'}`);
    console.log(`     Private: ${repo.private ? 'Yes' : 'No'} | Updated: ${new Date(repo.updated_at).toLocaleDateString()}\n`);
  });
}

async function checkRepository(owner, repo) {
  const octokit = await getGitHubClient();
  
  console.log(`\n🔍 Checking repository: ${owner}/${repo}`);
  console.log('════════════════════════════════════════\n');
  
  // Get repository info
  const { data: repoData } = await octokit.repos.get({ owner, repo });
  console.log(`  Name: ${repoData.full_name}`);
  console.log(`  Description: ${repoData.description || 'No description'}`);
  console.log(`  Default Branch: ${repoData.default_branch}`);
  console.log(`  Private: ${repoData.private ? 'Yes' : 'No'}`);
  console.log(`  Last Updated: ${new Date(repoData.updated_at).toLocaleString()}\n`);
  
  // Get open issues
  const { data: issues } = await octokit.issues.listForRepo({
    owner,
    repo,
    state: 'open',
    per_page: 5
  });
  
  console.log(`  Open Issues: ${issues.length}`);
  if (issues.length > 0) {
    issues.forEach(issue => {
      console.log(`    #${issue.number}: ${issue.title}`);
    });
  }
  console.log('');
  
  // Get open pull requests
  const { data: prs } = await octokit.pulls.list({
    owner,
    repo,
    state: 'open',
    per_page: 5
  });
  
  console.log(`  Open Pull Requests: ${prs.length}`);
  if (prs.length > 0) {
    prs.forEach(pr => {
      console.log(`    #${pr.number}: ${pr.title}`);
    });
  }
  console.log('');
}

async function main() {
  const command = process.argv[2];
  
  try {
    if (command === 'list') {
      await listRepositories();
    } else if (command === 'check') {
      const owner = process.argv[3] || 'bfnegron';
      const repo = process.argv[4] || 'TheReadyLabrootreplit';
      await checkRepository(owner, repo);
    } else {
      console.log('Usage:');
      console.log('  node scripts/github-helper.mjs list');
      console.log('  node scripts/github-helper.mjs check [owner] [repo]');
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
