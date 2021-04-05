/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { ReactNode } from 'react';
declare type ExtractInterpolatePlaceholders<Str extends string> = string;
declare type InterpolateValues<Str extends string, Value extends ReactNode> = Record<ExtractInterpolatePlaceholders<Str>, Value>;
export declare function interpolate<Str extends string>(text: Str, values?: InterpolateValues<Str, string | number>): string;
export declare function interpolate<Str extends string, Value extends ReactNode>(text: Str, values?: InterpolateValues<Str, Value>): ReactNode;
export declare type InterpolateProps<Str extends string> = {
    children: Str;
    values?: InterpolateValues<Str, ReactNode>;
};
export default function Interpolate<Str extends string>({ children, values, }: InterpolateProps<Str>): React.ReactNode;
export {};
//# sourceMappingURL=Interpolate.d.ts.map