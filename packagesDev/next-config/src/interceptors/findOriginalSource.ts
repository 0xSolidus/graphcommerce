import path from 'path'
import { parseSync } from '@swc/core'
import { ResolveDependency, ResolveDependencyReturn } from '../utils/resolveDependency'
import { PluginConfig, isMethodPluginConfig } from './generateInterceptors'

function parseAndFindExport(
  resolved: ResolveDependencyReturn,
  findExport: string,
  resolve: ResolveDependency,
): ResolveDependencyReturn {
  if (!resolved?.source) return undefined
  const ast = parseSync(resolved.source, { syntax: 'typescript', tsx: true, comments: true })

  for (const node of ast.body) {
    if (node.type === 'ExportDeclaration') {
      switch (node.declaration.type) {
        case 'ClassDeclaration':
        case 'FunctionDeclaration':
          if (node.declaration.identifier.value === findExport) return resolved
          break
        case 'VariableDeclaration':
          for (const declaration of node.declaration.declarations) {
            if (declaration.type === 'VariableDeclarator') {
              if (declaration.id.type === 'Identifier') {
                if (declaration.id.value === findExport) return resolved
              } else {
                console.log(declaration)
              }
            }
          }
          break
      }
    }
  }

  for (const node of ast.body) {
    if (node.type === 'ExportAllDeclaration') {
      const isRelative = node.source.value.startsWith('.')
      if (isRelative) {
        const d =
          resolved.dependency === resolved.denormalized
            ? resolved.dependency.substring(0, resolved.dependency.lastIndexOf('/'))
            : resolved.dependency

        const newPath = path.join(d, node.source.value)

        const resolveResult = resolve(newPath, { includeSources: true })
        // eslint-disable-next-line no-continue
        if (!resolveResult) continue

        const newResolved = parseAndFindExport(resolveResult, findExport, resolve)

        if (newResolved && resolved.dependency !== newResolved.dependency) return newResolved
      }
    }
  }

  return undefined
}

export function findOriginalSource(
  plug: PluginConfig,
  resolved: ResolveDependencyReturn,
  resolve: ResolveDependency,
) {
  if (!resolved?.source) return resolved
  const findExport = isMethodPluginConfig(plug) ? plug.func : plug.component
  const result = parseAndFindExport(resolved, findExport, resolve)

  if (!result) {
    throw new Error(`Could not find original source for ${findExport}`)
  }
  return result
}
