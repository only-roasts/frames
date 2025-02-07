export interface IPFSMetadata {
  name: string;
  description: string;
  image: string;
  external_url: string;
  attributes: [
    {
      trait_type: string;
      value: string;
    }
  ];
}
