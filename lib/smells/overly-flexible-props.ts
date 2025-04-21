import { ParseResult } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import { 
  File, 
  TSType, 
  Identifier, 
  Pattern, 
  RestElement, 
  ArrowFunctionExpression, 
  FunctionDeclaration, 
  isIdentifier, 
  isTSQualifiedName, 
  TypeAnnotation, 
  TSTypeAnnotation, 
  Noop 
} from "@babel/types";
import { SourceLocation } from "../types";

const usesUnknownRecordType = (node: TSType) => {
  return (
    node.type === "TSTypeReference" &&
    (isIdentifier(node.typeName)
      ? node.typeName.name === "Record"
      : isTSQualifiedName(node.typeName) &&
        isIdentifier(node.typeName.left) &&
        node.typeName.left.name === "Record") &&
    node.typeParameters?.params[0].type === "TSStringKeyword" &&
    node.typeParameters.params[1].type === "TSUnknownKeyword"
  );
}

const isFlexibleElement = (typeAnnotation: TSType) => {
  return (
    typeAnnotation.type === "TSIntersectionType" &&
    typeAnnotation.types.some(usesUnknownRecordType)
  ) || usesUnknownRecordType(typeAnnotation);
};

const nestedTypeAnnotation = (
  typeAnnotation: TypeAnnotation | TSTypeAnnotation | Noop | null | undefined
) =>
  typeAnnotation && 
  'typeAnnotation' in typeAnnotation
    ? typeAnnotation.typeAnnotation
    : null;

const isComponentPropsDefitionFlexible = (
  param: Identifier | Pattern | RestElement,
  propsDefinitions: string[]
) => {
  const typeAnnotation = nestedTypeAnnotation(param?.typeAnnotation);
  
  return (
    typeAnnotation?.type === "TSTypeReference" && 
    (
      (isIdentifier(typeAnnotation.typeName) && 
        propsDefinitions.includes(typeAnnotation.typeName.name)) ||
      (isTSQualifiedName(typeAnnotation.typeName) && 
        propsDefinitions.includes(typeAnnotation.typeName.right.name))
    )
  );
}

const isComponentInlinePropsFlexible = (
  param: Identifier | Pattern | RestElement
) => {
  const typeAnnotation = nestedTypeAnnotation(param?.typeAnnotation)

  return (
    typeAnnotation?.type === "TSIntersectionType" &&
    typeAnnotation.types.some(
      (node: TSType) => node.type === "TSTypeReference" && isFlexibleElement(node)
    )
  );
}

const checkComponentPropsUsage = (
  path: NodePath<FunctionDeclaration | ArrowFunctionExpression>,
  propsDefinitions: string[],
  components: SourceLocation[]
) => {
  if (
    isComponentPropsDefitionFlexible(path.node.params[0], propsDefinitions) ||
    isComponentInlinePropsFlexible(path.node.params[0])
  ) {
    components.push({
      start: path.node.loc?.start.line,
      end: path.node.loc?.end.line
    });
  }
}

export const overlyFlexibleProps = (ast: ParseResult<File>) => {
  const propsDefinitions: string[] = [];
  const components: SourceLocation[] = [];

  traverse(ast, {
    TSTypeAliasDeclaration(path) {
      if (isFlexibleElement(path.node.typeAnnotation)) {
        propsDefinitions.push(path.node.id.name);
      }
    },

    TSInterfaceDeclaration(path) {
      if (
        path.node.extends?.some((extend) =>
          extend.expression.type === "Identifier" &&
          extend.expression.name === "Record" &&
          extend.typeParameters?.params[0].type === "TSStringKeyword" &&
          extend.typeParameters?.params[1].type === "TSUnknownKeyword"
        )
      ) {
        propsDefinitions.push(path.node.id.name);
      }
    },

    FunctionDeclaration(path) {
      checkComponentPropsUsage(path, propsDefinitions, components);
    },

    ArrowFunctionExpression(path) {
      checkComponentPropsUsage(path, propsDefinitions, components);
    },
  });

  return components;
}