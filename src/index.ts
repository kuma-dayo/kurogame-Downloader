import data from "./data.json"
import * as fs from "fs"
import * as https from "https"
import * as path from "path"

const baseUrl = "https://prod-cn-alicdn-gamestarter.kurogame.com/pcstarter/prod/game/G152/0.7.0/flsaxwdbqerujify/zip"

const downloadResource = async (resource) => {
  const dir =
    "data" +
    resource.dest
      .split("/")
      .filter((data) => !data.includes("."))
      .join("/")
  const url = `${baseUrl}${resource.dest}`

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(path.join(process.cwd(), dir), { recursive: true })
  }

  const fileStream = fs.createWriteStream("data" + resource.dest)
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      res.pipe(fileStream)
      fileStream.on("finish", () => {
        console.log("download success", resource.dest)
        resolve("success")
      })
      fileStream.on("error", (err) => {
        reject(err)
      })
    })
  })
}

const downloadResources = async () => {
  const promises = data.resource.map(downloadResource)
  await Promise.all(promises)
}

downloadResources()
