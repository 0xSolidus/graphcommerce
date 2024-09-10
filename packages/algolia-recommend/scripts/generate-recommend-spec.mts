import yaml from 'js-yaml'
import { writeFile, readFile } from 'node:fs/promises'
import { OpenAPIV3 } from 'openapi-types'
import prettier from 'prettier'
import conf from '@graphcommerce/prettier-config-pwa'

const response = await fetch(
  'https://raw.githubusercontent.com/algolia/api-clients-automation/main/specs/bundled/recommend.yml',
)

const openApiSchema = yaml.load(await response.text()) as OpenAPIV3.Document

const allMethods = [
  OpenAPIV3.HttpMethods.TRACE,
  OpenAPIV3.HttpMethods.POST,
  OpenAPIV3.HttpMethods.PUT,
  OpenAPIV3.HttpMethods.GET,
  OpenAPIV3.HttpMethods.DELETE,
  OpenAPIV3.HttpMethods.PATCH,
  OpenAPIV3.HttpMethods.OPTIONS,
  OpenAPIV3.HttpMethods.HEAD,
]

const { info, openapi, components, tags, ...rest } = openApiSchema

function filterPaths(
  paths: OpenAPIV3.PathsObject,
  allow: Record<string, OpenAPIV3.HttpMethods[]>,
): OpenAPIV3.PathsObject {
  const allowedEntries = Object.entries(allow)

  return Object.fromEntries(
    Object.entries(paths)
      .map(([path, pathItem]) => {
        if (!pathItem) return [path, pathItem]
        const newValue = pathItem

        const [allowedPath, allowedMethods] =
          allowedEntries.find(([allowedPath]) => allowedPath === path) ?? []

        if (!allowedPath || !allowedMethods) return [path, undefined]

        allMethods
          .filter((method) => !allowedMethods.includes(method))
          .forEach((method) => {
            newValue[method] = undefined
          })

        return [path, newValue]
      })
      .filter(([path, pathItem]) => {
        if (!pathItem) return false
        if (allMethods.every((key) => !pathItem[key])) return false
        return true
      }),
  )
}

function isRef(value: any): value is OpenAPIV3.ReferenceObject {
  return typeof value === 'object' && '$ref' in value
}

const newSchema: OpenAPIV3.Document = {
  openapi,
  info,
  paths: filterPaths(openApiSchema.paths, {
    '/1/indexes/*/recommendations': [OpenAPIV3.HttpMethods.POST],
  }),
  components: {
    ...openApiSchema.components,
    schemas: Object.fromEntries(
      Object.entries(openApiSchema.components?.schemas ?? {}).map(([schemaKey, schema]) => {
        if (isRef(schema) || schemaKey !== 'recommendedForYouQuery') return [schemaKey, schema]

        return [
          schemaKey,
          {
            ...schema,
            oneOf: schema.oneOf?.filter(
              (item) => !isRef(item) || item.$ref !== '#/components/schemas/recommendedForYouQuery',
            ),
          },
        ]
      }),
    ),
  },
}

await writeFile(
  './algolia-recommend-spec.yaml',
  await prettier.format(JSON.stringify(newSchema), {
    parser: 'json',
    ...conf,
  }),
)
