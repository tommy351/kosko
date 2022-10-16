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
    target: Record<string, unknown>,
    componentName?: string
  ): Record<string, unknown>;
}

export function reduce(
  reducers: readonly Reducer[],
  componentName?: string
): unknown {
  return reducers.reduce(
    (target, reducer) => reducer.reduce(target, componentName),
    {}
  );
}

export async function reduceAsync(
  reducers: readonly Reducer[],
  componentName?: string
): Promise<unknown> {
  let target = {};

  for (const reducer of reducers) {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    target = await reducer.reduce(target, componentName);
  }

  return target;
}
