export type Component = unknown | ComponentArray | FunctionComponent;
export type ComponentArray = Component[];
export type FunctionComponent = () => Promise<Component>;
