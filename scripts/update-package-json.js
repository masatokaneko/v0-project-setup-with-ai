const fs = require("fs")
const path = require("path")

// package.jsonのパス
const packageJsonPath = path.join(process.cwd(), "package.json")

try {
  // package.jsonを読み込む
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

  // postinstallスクリプトを追加
  packageJson.scripts = packageJson.scripts || {}
  packageJson.scripts.postinstall = "prisma generate"

  // buildスクリプトを更新
  if (packageJson.scripts.build) {
    packageJson.scripts.build = "prisma generate && " + packageJson.scripts.build
  } else {
    packageJson.scripts.build = "prisma generate && next build"
  }

  // 更新したpackage.jsonを書き込む
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

  console.log("Successfully updated package.json with Prisma scripts")
} catch (error) {
  console.error("Error updating package.json:", error)
}
