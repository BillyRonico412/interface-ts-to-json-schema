# INTERFACE TS TO JSON SCHEMA

The syntax of the [JsonSchema](https://json-schema.org/) is very verbose compared to a [TypeScript interface](https://www.typescriptlang.org/docs/handbook/typescript-tooling-in-5-minutes.html#interfaces). (In the end it expresses almost the same thing).

This is then an application to compile a TypeScript interface to JsonSchema.

It is coded in NextJS with the tailwind framework and the [LL](https://www.npmjs.com/package/@ronico.billy/ll) library that I developed to scan and parse it.

## Example
### TypeScript Interface
```ts
{
  first: (number|string[])[];
  second: boolean;
}
```

### JsonSchema
```yaml
{
  "type": "object",
  "required": [
    "first",
    "second"
  ],
  "properties": {
    "first": {
      "type": "array",
      "items": {
        "oneOf": [
          {
            "type": "number"
          },
          {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        ]
      }
    },
    "second": {
      "type": "boolean"
    }
  }
}
```

## Interface grammar
```text
    I -> "{" Decla "}"
    Decla -> Key B Value ; Decla
    Decla -> 
    B -> ":"
    B -> "?:"
    Value -> T E
    T -> C A
    C -> TypeBase
    C -> I
    C -> "(" Value ")"
    E -> | T E
    E -> 
    A -> [] A
    A -> 
```