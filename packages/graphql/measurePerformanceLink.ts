/* eslint-disable no-console */
import { ApolloLink } from '@apollo/client/core'
import type { TracingFormat } from 'apollo-tracing'

const slowOperationThreshold = 1000
const slowResolverThreshold = 300

export const measurePerformanceLink = new ApolloLink((operation, forward) => {
  if (typeof global.window !== 'undefined') {
    return forward(operation)
  }
  // Called before operation is sent to server
  operation.setContext({ measurePerformanceLinkStart: new Date().valueOf() })
  return forward(operation).map((data) => {
    // Called after server responds
    const time: number =
      new Date().valueOf() - (operation.getContext().measurePerformanceLinkStart as number)
    let vars =
      Object.keys(operation.variables).length > 0 ? `(${JSON.stringify(operation.variables)})` : ''
    if (vars.length > 100) {
      vars = `${vars.substr(0, 100)}…`
    }

    if (data.extensions?.tracing && time > slowOperationThreshold) {
      const tracing = data.extensions?.tracing as TracingFormat

      const duration = Math.round(tracing.duration / (1000 * 1000))

      console.group(`[slow] ${operation.operationName}${vars}`)
      console.info(`operations ${duration}ms, mesh: ${time - duration}ms`)

      tracing.execution.resolvers
        .filter((resolver) => resolver.duration > slowResolverThreshold * 1000 * 1000)
        .forEach((resolver) =>
          console.info(
            `${operation.operationName}.${resolver.path.join('.')}[${Math.round(
              resolver.duration / (1000 * 1000),
            )}ms]`,
          ),
        )
      console.groupEnd()
    }

    return data
  })
})
