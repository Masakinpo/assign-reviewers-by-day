import { safeLoad } from 'js-yaml'
import { Octokit } from "@octokit/rest"

export async function fetchConfigurationFile(octokit: Octokit, options: any) {
  const { owner, repo, path, ref } = options
  const result = await octokit.repos.getContents({
    owner,
    repo,
    path,
    ref,
  })

  const data: any = result.data

  if (!data.content) {
    throw new Error('the configuration file is not found')
  }

  const configString = Buffer.from(data.content, 'base64').toString()
  const config = safeLoad(configString)

  return config
}
