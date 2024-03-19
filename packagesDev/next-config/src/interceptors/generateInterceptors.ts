import path from 'node:path'
import { GraphCommerceDebugConfig } from '../generated/config'
import { ResolveDependency, ResolveDependencyReturn } from '../utils/resolveDependency'
import { findOriginalSource } from './findOriginalSource'
import { removeExports } from './removeExports'

type PluginBaseConfig = {
  type: 'component' | 'method' | 'replace'
  module: string
  exportString: string
  plugin: string
  enabled: boolean
  ifConfig?: string
}

export function isPluginBaseConfig(plugin: Partial<PluginBaseConfig>): plugin is PluginBaseConfig {
  return (
    typeof plugin.exported === 'string' &&
    typeof plugin.plugin === 'string' &&
    typeof plugin.enabled === 'boolean' &&
    typeof plugin.exportString === 'string'
  )
}

type ReactPluginConfig = PluginBaseConfig & { pluginType: 'component' }
type MethodPluginConfig = PluginBaseConfig & { pluginType: 'method' }
type ReplacePluginConfig = PluginBaseConfig & { pluginType: 'replace' }

export function isReactPluginConfig(
  plugin: Partial<PluginBaseConfig>,
): plugin is ReactPluginConfig {
  if (!isPluginBaseConfig(plugin)) return false
  return plugin.exportString !== undefined
}

export function isMethodPluginConfig(
  plugin: Partial<PluginBaseConfig>,
): plugin is MethodPluginConfig {
  if (!isPluginBaseConfig(plugin)) return false
  return plugin.exportString !== undefined
}

export function isReplacePluginConfig(
  plugin: Partial<PluginBaseConfig>,
): plugin is ReactPluginConfig {
  if (!isPluginBaseConfig(plugin)) return false
  return plugin.exportString !== undefined
}

export type PluginConfig = ReactPluginConfig | MethodPluginConfig | ReplacePluginConfig

export function isPluginConfig(plugin: Partial<PluginConfig>): plugin is PluginConfig {
  return isPluginBaseConfig(plugin)
}

type Interceptor = ResolveDependencyReturn & {
  components: Record<string, ReactPluginConfig[]>
  funcs: Record<string, MethodPluginConfig[]>
  replaces: Record<string, ReplacePluginConfig[]>
  target: string
  source: string
  template?: string
}

export type MaterializedPlugin = Interceptor & { template: string }

function moveRelativeDown(plugins: PluginConfig[]) {
  return [...plugins].sort((a, b) => {
    if (a.plugin.startsWith('.') && !b.plugin.startsWith('.')) return 1
    if (!a.plugin.startsWith('.') && b.plugin.startsWith('.')) return -1
    return 0
  })
}

export function generateInterceptor(
  interceptor: Interceptor,
  config: GraphCommerceDebugConfig,
): MaterializedPlugin {
  const { dependency, components, funcs, source } = interceptor

  const pluginConfigs = [...Object.entries(components), ...Object.entries(funcs)]
    .map(([, plugins]) => plugins)
    .flat()

  const duplicateImports = new Set()

  const pluginImports = moveRelativeDown(
    [...pluginConfigs].sort((a, b) => a.plugin.localeCompare(b.plugin)),
  )
    .map((plugin) => {
      const { plugin: p } = plugin
      if (isReactPluginConfig(plugin))
        return `import { Plugin as ${p.split('/')[p.split('/').length - 1]} } from '${p}'`
      return `import { plugin as ${p.split('/')[p.split('/').length - 1]} } from '${p}'`
    })
    .filter((str) => {
      if (duplicateImports.has(str)) return false
      duplicateImports.add(str)
      return true
    })
    .join('\n')

  const ogSuffix = '_original'
  const icSuffix = 'Prev'
  const replaceCandidates = [...Object.keys(components), ...Object.keys(funcs)]

  const originalSource = removeExports(source, replaceCandidates, ogSuffix)

  const entries: [string, PluginConfig[]][] = [
    ...Object.entries(components),
    ...Object.entries(funcs),
  ]
  const pluginExports = entries
    .map(([base, plugins]) => {
      const duplicateInterceptors = new Set()
      const name = (p: PluginConfig) => p.plugin.split('/')[p.plugin.split('/').length - 1]

      const filterNoDuplicate = (p: PluginConfig) => {
        if (duplicateInterceptors.has(name(p))) return false
        duplicateInterceptors.add(name(p))
        return true
      }

      let carry = `${base}${ogSuffix}`

      const pluginStr = plugins
        .reverse()
        .filter(filterNoDuplicate)
        .map((p, i) => {
          let result

          const definition =
            i === plugins.length - 1 ? `export const ${base}` : `const ${name(p)}${icSuffix}`

          if (isReactPluginConfig(p)) {
            const wrapChain = plugins
              .reverse()
              .map((pl) => `<${name(pl)}/>`)
              .join(' wrapping ')

            const body = config.pluginStatus
              ? `{
  logInterceptor(\`🔌 Rendering ${base} with plugin(s): ${wrapChain} wrapping <${base}/>\`)
  return <${name(p)} {...props} Prev={${carry}} />
}`
              : `(
  <${name(p)} {...props} Prev={${carry}} />
)`

            result = `${definition} = (props: InterceptorProps<typeof ${name(p)}>) => ${body}`
          } else {
            const wrapChain = plugins
              .reverse()
              .map((pl) => `${name(pl)}()`)
              .join(' wrapping ')

            const body = config.pluginStatus
              ? `{
  logInterceptor(
    \`🔌 Calling ${base} with plugin(s): ${wrapChain} wrapping ${base}()\`
  )
  return ${name(p)}(${carry}, ...args)
}`
              : `
${name(p)}(${carry}, ...args)`

            result = `${definition}: typeof ${carry} = (...args) => ${body}
`
          }

          carry = `${name(p)}${icSuffix}`
          return result
        })
        .join('\n')

      const isComponent = plugins.every((p) => isReactPluginConfig(p))
      if (isComponent && plugins.some((p) => isMethodPluginConfig(p))) {
        throw new Error(`Cannot mix React and Method plugins for ${base} in ${dependency}.`)
      }

      return `
/**
 * Interceptor for \`${isComponent ? `<${base}/>` : `${base}()`}\` with these plugins:
 * 
${plugins.map((p) => ` * - \`${p.plugin}\``).join('\n')}
 */
${pluginStr}`
    })
    .join('\n')

  const logOnce = config.pluginStatus
    ? `
const logged: Set<string> = new Set();
const logInterceptor = (log: string, ...additional: unknown[]) => {
  if (logged.has(log)) return
  logged.add(log)
  console.log(log, ...additional)
}
`
    : ''

  const template = `// eslint-disable
/* This file is automatically generated for ${dependency} */

import type { InterceptorProps } from '@graphcommerce/next-config'
${pluginImports}

/** ❗️ Original (modified) source starts here: */
${originalSource}
/** ❗️ Original (modified) source ends here **/
${logOnce}${pluginExports}
`

  return { ...interceptor, template }
}

export type GenerateInterceptorsReturn = Record<string, MaterializedPlugin>

export function generateInterceptors(
  plugins: PluginConfig[],
  resolve: ResolveDependency,
  config?: GraphCommerceDebugConfig | null | undefined,
): GenerateInterceptorsReturn {
  // todo: Do not use reduce as we're passing the accumulator to the next iteration
  const byExportedComponent = moveRelativeDown(plugins).reduce<Record<string, Interceptor>>(
    (acc, plug) => {
      let { exported, plugin, exportString } = plug
      if (!isPluginConfig(plug) || !plug.enabled) return acc

      const result = resolve(exported, { includeSources: true })
      const resolved = findOriginalSource(plug, result, resolve)

      if (!resolved) throw Error(`Could not resolve ${exported}`)

      const { fromRoot } = resolved

      if (plugin.startsWith('.')) {
        const resolvedPlugin = resolve(plugin)
        if (resolvedPlugin) {
          plugin = path.relative(
            resolved.fromRoot.split('/').slice(0, -1).join('/'),
            resolvedPlugin.fromRoot,
          )
        }
      }

      if (!acc[resolved.fromRoot]) {
        acc[resolved.fromRoot] = {
          ...resolved,
          target: `${resolved.fromRoot}.interceptor`,
          components: {},
          funcs: {},
          replaces: {},
        } as Interceptor
      }

      switch (plug.pluginType) {
        case 'component':
          if (!acc[fromRoot].components[exportString]) acc[fromRoot].components[exportString] = []
          acc[fromRoot].components[exportString].push({ ...plug, plugin })
          break
        case 'method':
          if (!acc[fromRoot].funcs[exportString]) acc[fromRoot].funcs[exportString] = []
          acc[fromRoot].funcs[exportString].push({ ...plug, plugin })
          break
        case 'replace':
          if (!acc[fromRoot].replaces[exportString]) acc[fromRoot].replaces[exportString] = []
          acc[fromRoot].replaces[exportString].push({ ...plug, plugin })
          break
      }
      return acc
    },
    {},
  )

  return Object.fromEntries(
    Object.entries(byExportedComponent).map(([target, interceptor]) => [
      target,
      generateInterceptor(interceptor, config ?? {}),
    ]),
  )
}
