export enum EntryType {
  File,
  Directory
}

interface BaseEntry {
  type: EntryType;
  name: string;
  path: string;
}

export interface File extends BaseEntry {
  type: EntryType.File;
}

export interface Directory extends BaseEntry {
  type: EntryType.Directory;
  children: readonly Entry[];
}

export type Entry = File | Directory;
