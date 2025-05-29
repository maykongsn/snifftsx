"use client"

import { forwardRef } from "react"
import {
  type ConditionalValue,
  type SystemStyleObject,
  chakra,
} from "../../styled-system"
import { compact, mapObject } from "../../utils"
import type { BoxProps } from "../box/box"

type GridSpanValue = ConditionalValue<number | "auto">

export interface GridItemProps extends BoxProps {
  area?: SystemStyleObject["gridArea"]
  colSpan?: GridSpanValue
  colStart?: GridSpanValue
  colEnd?: GridSpanValue
  rowStart?: GridSpanValue
  rowEnd?: GridSpanValue
  rowSpan?: GridSpanValue
}

function spanFn(span?: GridSpanValue) {
  return mapObject(span, (value) =>
    value === "auto" ? "auto" : `span ${value}/span ${value}`,
  )
}

export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  function GridItem(props, ref) {
    const {
      area,
      colSpan,
      colStart,
      colEnd,
      rowEnd,
      rowSpan,
      rowStart,
      ...rest
    } = props

    const styles = compact({
      gridArea: area,
      gridColumn: spanFn(colSpan),
      gridRow: spanFn(rowSpan),
      gridColumnStart: colStart,
      gridColumnEnd: colEnd,
      gridRowStart: rowStart,
      gridRowEnd: rowEnd,
    })

    return <chakra.div ref={ref} css={styles} {...rest} />
  },
)