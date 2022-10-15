/**
 * Describes a step in the variables overriding chain.
 *
 * @public
 */
export interface Reducer {
  /**
   * Name of the reducer.
   */
  name: string;

  /**
   * Overrides variables for the specified component.
   * If component name is not specified then overrides only
   * global variables.
   */
  reduce(
    target: Record<string, any>,
    componentName?: string
  ): Record<string, any>;
}

export function reduce(
  reducers: readonly Reducer[],
  componentName?: string
): any {
  return reducers.reduce(
    (target, reducer) => reducer.reduce(target, componentName),
    {}
  );
}

export async function reduceAsync(
  reducers: readonly Reducer[],
  componentName?: string
): Promise<any> {
  let target = {};

  for (const reducer of reducers) {
    target = await reducer.reduce(target, componentName);
  }

  return target;
}
