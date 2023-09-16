import { BuildOptions, build } from "esbuild"
import { emptyDir, emptyDirSync, ensureDir, ensureDirSync, rmSync } from "fs-extra"

import { resolve } from "node:path"
import { execSync } from "node:child_process"
const main =async ()=>{
  await ensureDirs([
    libDir,distDir,typeDir
  ])
  await emptyDirs([
    libDir,distDir
  ])
  for (const [name, option] of Object.entries(options)) {
    build({
      entryPoints: [entryPoint],
      entryNames: `bellman`,
      ...option
    })
  }
  execSync("tsc -p tsconfig.default.json", {
    stdio: "inherit"
  })
}
const libDir = resolve(__dirname, "../lib")
const typeDir = resolve(__dirname, "../types")
const distDir = resolve(__dirname, "../dist")
const entryPoint = resolve(__dirname, "../src/bellman.ts")
const options: Record<string, BuildOptions> = {
  esm: {
    format: "esm",
    outExtension: { '.js': '.mjs' },
    outdir:libDir
  },
  cjs: {
    format: "cjs",
    outdir:libDir
  },
  if:{
    outdir:distDir,
    format:"iife"
  }
}


const batFac = <Param,Return>(
  syncFunc:(param:Param)=>Return,
  asyncFunc:(param:Param)=>Promise<Return>
)=>async (dirs:Param[],queue= false)=>{
  if(queue){
    const results = []
    for( const dir of dirs ){
      results.push(syncFunc(dir))
    }
    return results;
  }
  const tasks:Promise<Return>[] = []
  for( const dir of dirs ){

    tasks.push(asyncFunc(dir))
  }
  return await Promise.all(tasks);
} 

const ensureDirs = batFac<string,void>(ensureDirSync,ensureDir)
const emptyDirs = batFac<string,void>(emptyDirSync,emptyDir);

main()

