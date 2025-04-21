# React and TypeScript Code Smells

> Identifying and analyzing the most common code smells in development with React and TypeScript.

---

## Summary

[Code smells](#code-smells) <br>
  - [TypeScript-specific smells](#typescript-smells)
    - [Any Type](#any-type)
    - [Non-Null Assertions](#non-null-assertions)
    - [Missing Union Type Abstraction](#missing-union-type-abstraction)
    - [Enum Implicit Values](#enum-implicit-values)
  - [TypeScript and React-specific smells](#react-and-typescript-smells)
    - [Multiple Booleans for State](#multiple-booleans-for-state)
    - [Overly Flexible Props](#overly-flexible-props)
---

## Code Smells

### TypeScript-specific smells

#### Any Type
TypeScript allows type checking and type inference for variables, objects, functions, etc. By defining the type ``any`` for an element in the code, the developer is disabling type checking and allowing manipulation of these entities without verification.

```tsx
import React, { useState } from 'react';

const MyComponent = () => {
  const [data, setData] = useState<any>(null);

  // ...
};

export default MyComponent;
```

---

## Non-Null Assertions
It is common practice for developers to use the non-null operator to indicate that a property will not be null or undefined in cases where type checking cannot deduce this. In the following example, the interface ``DataProps`` infers that ``data`` can be of type null. Due to this circumstance, the developer employs the non-null operator to guarantee TypeScript that ``data`` will not be null. Consequently, due to the lack of type checking, runtime errors may occur.

```tsx
function Component({ data }: { data: { prop1: string; prop2: number } | null }) {
  return(
      <div>
        <p>{data!.prop1}</p>
        <p>{data!.prop2}</p>
      </div>
  )
}
```

---

## Missing Union Type Abstraction
Type aliases facilitate code maintenance, reusability, and code readability. The following example demonstrates a component where the union type `'circle' | 'square'` is repeated in many locations. These unions may increase the probability of inconsistency, as any modifications to them requires that you make changes to multiple points.

```tsx
const ShapeComponent = () => {
  const [current, setCurrent] = useState<'circle' | 'square'>('circle');

  function changeShape(type: 'circle' | 'square') {
    // ...
  }

  function calculateArea(type: 'circle' | 'square') {
    // ...
  }
}
```

---

## Enum Implicit Values
Enums are a way to define constants and facilitate code maintenance and readability. However, in TypeScript, it is a bad practice to use enums without defining explicit values for them. In the following example, the constants ``Pending``, ``Processing`` and ``Completed`` are without constant values. Consequently, if the developer adds a new member at the top, ``Failed``, the following members will be auto-incremented from one to three, changing the value of them. If something depends on these values, it causes inconsistencies at runtime.

```tsx
enum PaymentStatus {
  Pending,
  Processing,
  Completed,
}
```

---

### TypeScript and React-specific smells

## Multiple Booleans for State
Developers commonly use many boolean-type states to define the component's state. This increases complexity and makes the code difficult to maintain as the number of states and typing increases. In the example, the component has some ``useState`` of boolean type, which can be replaced with better typing alternatives.

```tsx
function Component() {
    const [isActive, setIsActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    // ...
}
```

---

## Overly Flexible Props
If the component uses, for example, `Record<string, unknown>`, in the props definition, then component will dynamically accept any props. This makes it difficult to comprehend the component's functionality.

```tsx
type InputProps = {
  label: string;
} & Record<string, unknown>;

const Input = ({ label, ...rest }: InputProps) => {
  return (
    <>
      <label>{label}</label>
      <input {...rest} />
    </>
  );
}
```

---