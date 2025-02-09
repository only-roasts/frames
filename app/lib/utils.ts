import axios from "axios";
import { IPFSMetadata } from "./interface";

export const getWebURL = () => {
  return process.env.ENVIRONMENT == "development"
    ? process.env.NEXT_DEV_WEB_URL
    : process.env.NEXT_PROD_WEB_URL;
};

export const getFrameURL = () => {
  return process.env.ENVIRONMENT == "development"
    ? process.env.NEXT_DEV_FRAME_URL
    : process.env.NEXT_PROD_FRAME_URL;
};

export const getIpfsMetadata = async (cid: string): Promise<IPFSMetadata> => {
  const ipfsMetaDataResponse = await axios.get(
    `https://white-official-scallop-559.mypinata.cloud/ipfs/${cid}`
  );

  return ipfsMetaDataResponse.data;
};

export const roastAFriend = async (username: string, userFid: Number) => {
  const sendcastResponse = await axios.post(`${getWebURL()}/roast-a-friend`, {
    username,
    userFid,
  });
};

export const getPinataMetadataCID = async (fid: number | undefined) => {
  const roastData = await getRoastData(fid);

  // const roastData = {
  //   roast: "You’ve spent more on gas fees than on your coffee this month! ☕",
  //   walletAddress: "0x1234567890",
  //   flameCount: 0,
  //   litCount: 0,
  //   dropletCount: 0,
  // };

  const roastImage = await getRoastImage(roastData);

  const roastNFTData = {
    walletStatus: "Defi Degenerate",
    ethSpent: 0,
    roast: roastData.roast,
    intensity: "Mild",
    advice: "You should probably stop trading on Uniswap.",
  };

  const uploadMetadataResponse = await axios.post(
    `${getWebURL()}/api/upload-metadata`,
    {
      pngBuffer: roastImage,
      tokenID: 16,
      roastNFTData,
    }
  );

  const cid = uploadMetadataResponse.data.cid;
  return { cid, roastData };
};

export const getRoastData = async (fid: number | undefined) => {
  const addressResponse = await axios.get(
    `${getFrameURL()}/api/getEthereumAddressByFid/${fid}`
  );

  const address = addressResponse.data.address;

  const roastResponse = await axios.get(
    `${getWebURL()}/api/generate-roast/${address}`
  );
  console.log(roastResponse.data.roast);

  const roastData = {
    roast: roastResponse.data.roast,
    walletAddress: address,
    flameCount: 0,
    litCount: 0,
    dropletCount: 0,
  };
  return roastData;
};

export const getRoastImage = async (roastData: any) => {
  const roastImageResponse = await axios.post(
    `${getWebURL()}/api/generate-image`,
    {
      roast: roastData.roast,
      walletAddress: roastData.walletAddress,
      flameCount: roastData.flameCount,
      litCount: roastData.litCount,
      dropletCount: roastData.dropletCount,
    }
  );

  return roastImageResponse.data.pngBuffer;
};
