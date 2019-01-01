export interface Result {
  manifests: Manifest[];
}

export interface Manifest {
  path: string;
  data: any;
}
