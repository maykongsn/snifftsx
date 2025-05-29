import type { HTMLAttributes, PropsWithChildren, ReactNode } from 'react';

import * as styles from './paper.css';

export interface SegmentProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
  index: number;
  level?: number;
  direction?: 'up' | 'down';
  segmentContent: ReactNode;

  isTop?: boolean;
  isBottom?: boolean;
}

export function Segment({
  children,
  index,
  direction,
  segmentContent,
  level,
  isTop,
  isBottom,
  ...attrs
}: SegmentProps) {
  const style = { '--index': index } as React.CSSProperties;
  return (
    <div
      className={styles.segment}
      data-direction={direction}
      data-level={level}
      data-bottom={(direction === 'down' && level === 1) || isBottom}
      data-top={(direction === 'up' && level === 1) || isTop}
      {...attrs}
    >
      <div className={styles.contentWrapper} style={style}>
        <div className={styles.content}>{segmentContent}</div>
      </div>
      {children}
    </div>
  );
}