import { Octokit } from "@octokit/rest"
import "dotenv/config";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || ''
})

const MAX_REPOS = 100

type Repo = {
  name: string
  full_name: string
  owner: string
  tsx_files_count?: number
}

async function fetchTopRepos(): Promise<Repo[]> {
  const response = await octokit.rest.search.repos({
    q: "language:TypeScript stars:>1 fork:false",
    sort: "stars",
    order: "desc",
    per_page: MAX_REPOS
  })

  const repos: Repo[] = [];

  for (const repo of response.data.items) {
    if (repo.owner?.login) {
      repos.push({
        name: repo.name,
        full_name: repo.full_name,
        owner: repo.owner.login,
      });
    }
  }

  return repos;
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const countTSXFiles = async (repo: Repo): Promise<number> => {
  const query = `repo:${repo.owner}/${repo.name} extension:TSX`

  try {
    const response = await octokit.request("GET /search/code", {
      q: query,
      headers: {
        accept: "application/vnd.github+json",
      },
    })

    const remaining = Number(response.headers["x-ratelimit-remaining"])
    const reset = Number(response.headers["x-ratelimit-reset"]) * 1000
    const now = Date.now()

    console.log(`${repo.full_name}: ${response.data.total_count} TSX files`)
    console.log(`Rate limit remaining: ${remaining} — Resets at: ${new Date(reset).toLocaleTimeString()}`)

    if (remaining === 0 && reset > now) {
      const waitTime = reset - now + 1000
      console.log(`Rate limit reset in ${Math.ceil(waitTime / 1000)}s`)
      await delay(waitTime)
    } else {
      await delay(2000)
    }

    return response.data.total_count
  } catch (err) {
    if (err.status === 403 && err.response?.headers["x-ratelimit-remaining"] === "0") {
      const reset = Number(err.response.headers["x-ratelimit-reset"]) * 1000
      const waitTime = reset - Date.now() + 1000
      console.log(`Waiting ${Math.ceil(waitTime / 1000)}s to retry`)
      await delay(waitTime)
      return countTSXFiles(repo)
    }

    console.error(`Failed to count TSX files for ${repo.full_name}:`, err.message)
    return 0
  }
}


async function main() {
  const repos = await fetchTopRepos();

  for (const repo of repos) {
    repo.tsx_files_count = await countTSXFiles(repo)
  }
  
  console.log("\nTop repositories:");
  
  repos.forEach((repo, index) => {
    console.log(`${index + 1}. ${repo.full_name}: ${repo.tsx_files_count} TSX files`)
  })
}

main();