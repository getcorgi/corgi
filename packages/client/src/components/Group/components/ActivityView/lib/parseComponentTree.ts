import React from 'react';

import * as components from '../components';

type Children = {
  component: keyof typeof components;
  properties?: { [key: string]: any };
  id: string;
  children?: Children;
}[];

export default function parseComponentTree(
  payload: Children,
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
