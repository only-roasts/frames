import axios from "axios";
import { IPFSMetadata } from "./interface";

export const getWebURL = () => {
  return process.env.ENVIRONMENT == "development"
    ? process.env.NEXT_DEV_WEB_URL
    : process.env.NEXT_PROD_WEB_URL;
};

export const getIpfsMetadata = async (cid: string): Promise<IPFSMetadata> => {
  const ipfsMetaDataResponse = await axios.get(
    `https://white-official-scallop-559.mypinata.cloud/ipfs/${cid}`
  );

  return ipfsMetaDataResponse.data;
};

export const getRoast = async (fid: number | undefined) => {
  const roastResponse = await axios.get(
    `${getWebURL()}/api/generate-roast/${fid}`
  );
  return roastResponse.data;
};

export const getRoastImage = async (roastData: any) => {
  const roastImageResponse = await axios.post(
    `${getWebURL()}/api/generate-image`,
    {
      roast: roastData[0].roast,
      walletAddress: roastData[0].walletAddress,
      flameCount: roastData[0].flameCount,
    }
  );

  return roastImageResponse.data;
};
