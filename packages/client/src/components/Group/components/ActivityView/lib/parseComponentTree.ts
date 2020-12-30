import React from 'react';

import * as components from '../components';

type Children = {
  component: keyof typeof components;
  // eslint-disable-next-line
  properties?: { [key: string]: any };
  id: string;
  children?: Children;
}[];

export default function parseComponentTree(
  payload: Children,
  // eslint-disable-next-line
  extraProps: any,
): ReturnType<typeof React.createElement>[] {
  return payload.map(childNode => {
    const { children, id, properties, component } = childNode;
    return React.createElement(
      components[component],
      { ...properties, ...extraProps, key: id },
      children ? parseComponentTree(children, extraProps) : undefined,
    );
  });
}
