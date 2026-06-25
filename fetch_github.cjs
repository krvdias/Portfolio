const fs = require('fs');
const https = require('https');

const options = {
  headers: {
    'User-Agent': 'Node.js'
  }
};

https.get('https://api.github.com/users/krvdias', options, (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('github_user.json', data);
    console.log('User data saved');
  });
});

https.get('https://api.github.com/users/krvdias/repos?sort=updated&per_page=10', options, (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    fs.writeFileSync('github_repos.json', data);
    console.log('Repo data saved');
  });
});
