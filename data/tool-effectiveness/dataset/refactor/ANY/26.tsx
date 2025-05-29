"use client"

import { forwardRef, useMemo } from "react"
import {
  type ConditionalValue,
  type HTMLChakraProps,
  type SystemStyleObject,
  chakra,
} from "../../styled-system"
import { mapObject } from "../../utils"

type StyleValue = string | number | undefined;

const mapTopValues: Record<string, StyleValue> = {
  top: undefined,
  middle: "50%",
  bottom: "auto",
};

const mapBottomValues: Record<string, StyleValue> = {
  top: "auto",
  middle: "50%",
  bottom: undefined,
};

const mapStartValues: Record<string, StyleValue> = {
  start: undefined,
  center: "50%",
  end: "auto",
};

const mapEndValues: Record<string, StyleValue> = {
  start: "auto",
  center: "50%",
  end: undefined,
};

const mapTranslateX: Record<string, string> = {
  start: "-50%",
  center: "-50%",
  end: "50%",
};

const mapTranslateY: Record<string, string> = {
  top: "-50%",
  middle: "-50%",
  bottom: "50%",
};

export interface FloatOptions {
  /**
   * The x offset of the indicator
   */
  offsetX?: SystemStyleObject["left"]
  /**
   * The y offset of the indicator
   */
  offsetY?: SystemStyleObject["top"]
  /**
   * The x and y offset of the indicator
   */
  offset?: SystemStyleObject["top"]
  /**
   * The placement of the indicator
   * @default "top-end"
   */
  placement?: ConditionalValue<
    | "bottom-end"
    | "bottom-start"
    | "top-end"
    | "top-start"
    | "bottom-center"
    | "top-center"
    | "middle-center"
    | "middle-end"
    | "middle-start"
  >
}

export interface FloatProps
  extends Omit<HTMLChakraProps<"div">, keyof FloatOptions>,
    FloatOptions {}

export const Float = forwardRef<HTMLDivElement, FloatProps>(
  function Float(props, ref) {
    const {
      offsetX,
      offsetY,
      offset = "0",
      placement = "top-end",
      ...rest
    } = props

    const styles: SystemStyleObject = useMemo(
      () => ({
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        insetBlockStart: mapObject(placement, (v) => {
          const [side] = v.split("-");
          return side === "top" ? offsetY ?? offset : mapTopValues[side];
        }),
        insetBlockEnd: mapObject(placement, (v) => {
          const [side] = v.split("-");
          return side === "bottom" ? offsetY ?? offset : mapBottomValues[side];
        }),
        insetStart: mapObject(placement, (v) => {
          const [, align] = v.split("-");
          return align === "start" ? offsetX ?? offset : mapStartValues[align];
        }),
        insetEnd: mapObject(placement, (v) => {
          const [, align] = v.split("-");
          return align === "end" ? offsetX ?? offset : mapEndValues[align];
        }),
        translate: mapObject(placement, (v) => {
          const [side, align] = v.split("-");
          return `${mapTranslateX[align]} ${mapTranslateY[side]}`;
        }),
      }),
      [offset, offsetX, offsetY, placement],
    );

    return <chakra.div ref={ref} css={styles} {...rest} />
  },
)