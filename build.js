const { exec } = require("child_process")
const { join } = require("path")
const { cwd } = require("process")

process.env["PKG_CACHE_PATH"] = join(cwd(), "cache")
process.env["MAKE_JOB_COUNT"] = 8

/**
 * Execute command
 * @param {string} cmd
 * @param {boolean} slient
 * @returns {Promise<string>}
 */
function execCommand(cmd, slient = false) {
  return new Promise((res, rej) => {
    const cp = exec(cmd, { env: process.env, cwd: cwd() })

    if (!slient) cp.stdout.pipe(process.stdout)
    cp.on("exit", () => res())
    cp.on("error", (err) => rej(err))
  })
}

;(async () => {
  console.log("Building development...")
  await execCommand("tsc --incremental")

  console.log("Resolving alias...")
  await execCommand("tsc-alias")

  console.log("Build complete.")
})()
