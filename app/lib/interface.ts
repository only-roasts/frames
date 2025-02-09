export interface IPFSMetadata {
  tokenId: number;
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
