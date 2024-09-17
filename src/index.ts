import * as core from '@actions/core'
import * as exec from '@actions/exec'

async function run() {
  try {
    const projectId = core.getInput('project-id', { required: true })
    const accessToken = core.getInput('access-token', { required: true })

    try {
      await exec.exec('zerops', ['--version'])
    } catch (error) {
      core.info('Zerops CLI not found. Installing...')
      await exec.exec('curl', [
        '-L',
        'https://github.com/zeropsio/zcli/releases/latest/download/zcli-linux-amd64',
        '-o',
        '/usr/local/bin/zerops'
      ])
      await exec.exec('chmod', ['+x', '/usr/local/bin/zerops'])
    }

    core.exportVariable('ZEROPS_TOKEN', accessToken)

    const deployCommand = `zerops deploy --project-id ${projectId}`
    core.info(`Executing: ${deployCommand}`)

    await exec.exec(deployCommand)

    core.info('Deployment completed successfully.')
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Action failed with error: ${error.message}`)
    } else {
      core.setFailed('Action failed with an unknown error.')
    }
  }
}

run()
