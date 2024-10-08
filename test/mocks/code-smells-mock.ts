export const mockAnyType = {
  path: 'test/components/Any.tsx',
  content: 'import React from "react";\n' +
    '\n' +
    'type MyType = Array<any>;\n' +
    'type Other = string | any;\n' +
    '\n' +
    'export function Any(props: any) {\n' +
    '  return (\n' +
    '    <div>\n' +
    '      {...props}\n' +
    '    </div>\n' +
    '  )\n' +
    '}'
}

export const mockNonNullAssertions = {
  path: 'test/components/NonNull.tsx',
  content: 'import React from "react";\n' +
    '\n' +
    'interface Data {\n' +
    '  prop1: string;\n' +
    '  prop2: number;\n' +
    '}\n' +
    '\n' +
    'interface Props {\n' +
    '  data: Data | null;\n' +
    '}\n' +
    '\n' +
    'export function Component({ data }: Props): JSX.Element {\n' +
    '  return(\n' +
    '    <div>\n' +
    '      <p>{data!.prop1}</p>\n' +
    '      <p>Teste</p>\n' +
    '      <p>{data!.prop2}</p>\n' +
    '      <h1>Testando</h1>\n' +
    '    </div>\n' +
    '  )\n' +
    '}'
}

export const mockMissingUnionTypeAbstraction = {
  path: 'test/components/MissingUnion.tsx',
  content: 'const ShapeComponent = () => {\n' +
    '  const [current, setCurrent] = \n' +
    "    useState<'circle' | 'square'>('circle');\n" +
    '\n' +
    "  function changeShape(type: 'circle' | 'square') {\n" +
    '    // ...\n' +
    '  }\n' +
    '\n' +
    "  function calculateArea(type: 'circle' | 'square') {\n" +
    '    // ...\n' +
    '  }\n' +
    '}'
}

export const mockEnumImplicitValues = {
  path: 'test/components/Enum.tsx',
  content: 'import React from "react";\n' +
    '\n' +
    'enum Suit {\n' +
    '  Hearts,\n' +
    '  Diamonds,\n' +
    '  Clubs,\n' +
    '  Spades\n' +
    '}\n' +
    '\n' +
    'export function Component() {\n' +
    '  return(\n' +
    '    <div>\n' +
    '    </div>\n' +
    '  )\n' +
    '}'
}

export const mockMultipleBooleansForState = {
  path: 'test/components/MultipleBooleans.tsx',
  content: 'import React from "react";\n' +
    'import { useState } from "react";\n' +
    '\n' +
    'function MultipleBooleans() { \n' +
    '  const [isOpen, setIsOpen] = useState(false);\n' +
    '  const [isLoading, setIsLoading] = useState(false);\n' +
    '  const [hasError, setHasError] = useState(false);\n' +
    '  const [isEditing, setIsEditing] = useState(false);\n' +
    '  const [isSaving, setIsSaving] = useState(false);\n' +
    '  const [isDeleting, setIsDeleting] = useState(false);\n' +
    '\n' +
    '  return (\n' +
    '    <div></div>\n' +
    '  )\n' +
    '}'
}

export const mockOverlyFlexibleProps = {
  path: 'test/components/OverlyFlexible.tsx',
  content: "import React from 'react';\n" +
    '\n' +
    'type InputProps = Record<string, unknown>\n' +
    '\n' +
    'interface ButtonProps extends Record<string, unknown> {\n' +
    '  label: string;\n' +
    '}\n' +
    '\n' +
    'const Input = ({ label, ...rest }: InputProps) => {\n' +
    '  return (\n' +
    '    <>\n' +
    '      <label>{label}</label>\n' +
    '      <input name={label} {...rest} />\n' +
    '    </>\n' +
    '  )\n' +
    '}\n' +
    '\n' +
    'function Button({ label, ...rest }: ButtonProps) {}\n' +
    '\n' +
    'function Component(props: { name: string } & Record<string, unknown>) {}'
}