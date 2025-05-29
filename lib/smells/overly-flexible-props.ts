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
  Noop, 
  TSTypeParameterDeclaration,
  TSTypeElement
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
    (node.typeParameters.params[1].type === "TSUnknownKeyword" ||
    node.typeParameters.params[1].type === "TSAnyKeyword")
  );
}

const usesIndexSignature = (node: TSTypeElement) =>
  node.type === "TSIndexSignature" &&
  node.parameters[0].typeAnnotation?.type === "TSTypeAnnotation" &&
  node.parameters[0].typeAnnotation?.typeAnnotation.type === "TSStringKeyword" &&
  (node.typeAnnotation?.typeAnnotation.type === "TSUnknownKeyword" ||
  node.typeAnnotation?.typeAnnotation.type === "TSAnyKeyword")

const usesFlexibleType = (typeAnnotation: TSType): boolean => 
  typeAnnotation.type === "TSTypeLiteral" &&
  typeAnnotation.members?.[0]?.type === "TSPropertySignature" &&
  typeAnnotation.members[0]?.typeAnnotation?.typeAnnotation
    ? usesUnknownRecordType(typeAnnotation.members[0].typeAnnotation.typeAnnotation)
    : false;

const isFlexibleElement = (typeAnnotation: TSType) => {
  return (
    typeAnnotation.type === "TSIntersectionType" &&
    typeAnnotation.types.some(usesUnknownRecordType)
  ) || usesUnknownRecordType(typeAnnotation);
};

const isFlexibleMember = (typeAnnotation: TSType) => 
  typeAnnotation.type === "TSTypeLiteral" &&
  typeAnnotation.members.some(usesIndexSignature)

const isFlexibleIntersectionIndexSignature = (typeAnnotation: TSType) =>
  typeAnnotation.type === "TSIntersectionType" &&
  typeAnnotation.types.some((node) => node.type === "TSTypeLiteral" && node.members.some(usesIndexSignature))

const isFlexibleIntersectionTypeParameter = (typeParameters: TSTypeParameterDeclaration) =>
  typeParameters.type === "TSTypeParameterDeclaration" &&
  typeParameters.params.some((node) => 
    node.type === "TSTypeParameter" && 
    node.default?.type === "TSTypeLiteral" &&
    node.default.members.some(usesIndexSignature)
  )

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

const isComponentPropsAnyType = (
  param: Identifier | Pattern | RestElement
) => {
  return (
    param.typeAnnotation?.type === "TSTypeAnnotation" &&
    param.typeAnnotation.typeAnnotation.type === "TSAnyKeyword"
  )
}

const checkComponentPropsUsage = (
  path: NodePath<FunctionDeclaration | ArrowFunctionExpression>,
  propsDefinitions: string[],
  components: SourceLocation[]
) => {
  if (
    isComponentPropsDefitionFlexible(path.node.params[0], propsDefinitions) ||
    isComponentInlinePropsFlexible(path.node.params[0]) ||
    (
      path.node.params.some((node) => 
        node.typeAnnotation?.type === "TSTypeAnnotation" &&
        usesUnknownRecordType(node.typeAnnotation.typeAnnotation) &&
        path.node.body.type === "BlockStatement" &&
        path.node.body.body.some((element) =>
          element.type === "ReturnStatement" &&
          element.argument?.type === "JSXElement"
        )
      )
    ) ||
    (
      path.node.params.some((node) => 
        node.typeAnnotation?.type === "TSTypeAnnotation" &&
        node.typeAnnotation.typeAnnotation.type === "TSAnyKeyword"
      ) &&
      path.node.body.type === "BlockStatement" &&
      path.node.body.body.some((element) =>
        element.type === "ReturnStatement" &&
        element.argument?.type === "JSXElement"
      )
    ) ||
    (
      path.node.params.some((node) => 
        node.typeAnnotation?.type === "TSTypeAnnotation" &&
        node.typeAnnotation.typeAnnotation.type === "TSTypeLiteral" &&
        node.typeAnnotation.typeAnnotation.members.some(usesIndexSignature) &&
        path.node.body.type === "BlockStatement" &&
        path.node.body.body.some((element) =>
          element.type === "ReturnStatement" &&
          element.argument?.type === "JSXElement"
        )
      )
    ) ||
    (
      path.node.params.some((node) =>
        node.typeAnnotation?.type === "TSTypeAnnotation" &&
        node.typeAnnotation.typeAnnotation.type === "TSIntersectionType" &&
        node.typeAnnotation.typeAnnotation.types.some((type) => type.type === "TSTypeLiteral" &&
          type.members.some(usesIndexSignature)
        ) &&
        path.node.body.type === "BlockStatement" &&
        path.node.body.body.some((element) =>
          element.type === "ReturnStatement" &&
          element.argument?.type === "JSXElement"
        )
      )
    )
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
      if (isFlexibleElement(path.node.typeAnnotation) || 
          isFlexibleMember(path.node.typeAnnotation) ||
          isFlexibleIntersectionIndexSignature(path.node.typeAnnotation) ||
          (
            path.node.typeParameters && 
            isFlexibleIntersectionTypeParameter(path.node.typeParameters) &&
            path.node.typeAnnotation.type === "TSIntersectionType" &&
            path.node.typeAnnotation.types.some((node) => 
              node.type === "TSTypeReference" && 
              node.typeName.type === "Identifier"
            )
          )
        ) {
        propsDefinitions.push(path.node.id.name);
      }
    },

    TSInterfaceDeclaration(path) {
      if (
        path.node.extends?.some((extend) =>
          extend.expression.type === "Identifier" &&
          extend.expression.name === "Record" &&
          extend.typeParameters?.params[0].type === "TSStringKeyword" &&
          (extend.typeParameters?.params[1].type === "TSUnknownKeyword" ||
          extend.typeParameters?.params[1].type === "TSAnyKeyword")
        ) ||
        path.node.body.body.some((node) => node.type === "TSIndexSignature" && usesIndexSignature(node))
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