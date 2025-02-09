/** @jsxImportSource frog/jsx */

import {
  getIpfsMetadata,
  getPinataMetadataCID,
  getWebURL,
} from "@/app/lib/utils";
import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { abi, address } from "@/app/lib/OnlyRoastNFTContract";

const app = new Frog({
  imageOptions: {
    /* Other default options */
    fonts: [
      {
        name: "Bangers",
        source: "google",
      },
    ],
  },
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
  title: "Frog Frame",
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'
//check
const roastData = [
  {
    roast: "You’ve spent more on gas fees than on your coffee this month! ☕",
    walletAddress: "0x1234567890",
    flameCount: 3,
  },
];

app.frame("/postedFromClient/:cid", async (c) => {
  const cid = c.req.param("cid");

  const ipfsMetaData = await getIpfsMetadata(cid);

  const { name, description, image, attributes, tokenId } = ipfsMetaData;

  console.log(ipfsMetaData);
  return c.res({
    image: image,

    intents: [
      <Button.Transaction
        target={`/lit-token/${tokenId}`}
        action="/lit-token-finish"
      >
        Lit
      </Button.Transaction>,
      <Button.Transaction
        target={`/drop-token/${tokenId}`}
        action="/drop-token-finish"
      >
        Drop
      </Button.Transaction>,
      <Button action="/generate-roast">Get Your Roast</Button>,
      <Button.Link href={getWebURL() || ""}>Vist Website</Button.Link>,
    ],
  });
});

app.frame("/postedByBot/:cid", async (c) => {
  const cid = c.req.param("cid");

  const ipfsMetaData = await getIpfsMetadata(cid);

  const { name, description, image, attributes, tokenId } = ipfsMetaData;

  console.log(ipfsMetaData);
  return c.res({
    image: image,

    intents: [
      <Button.Transaction target={`/minted/${cid}`} action="/minting-finish">
        Mint As NFT
      </Button.Transaction>,
      <Button.Link href={getWebURL() || ""}>Vist Website</Button.Link>,
    ],
  });
});

app.frame("/generate-roast", async (c) => {
  const fid = c.frameData?.fid;
  const { cid, roastData } = await getPinataMetadataCID(fid);
  const ipfsMetaData = await getIpfsMetadata(cid);

  return c.res({
    action: "/minting-finish",
    image: ipfsMetaData.image,
    intents: [
      <Button.Transaction target={`/minted/${cid}`}>
        Mint As NFT
      </Button.Transaction>,

      <Button.Link href={getWebURL() || ""}>Vist Website</Button.Link>,
    ],
  });
});

app.transaction("/lit-token/:tokenId", (c) => {
  console.log("Transaction");
  const tokenId = c.req.param("tokenId");
  // Contract transaction response.
  console.log(tokenId);
  console.log(c.frameData?.address);
  return c.contract({
    abi,
    chainId: "eip155:84532",
    functionName: "litToken",
    args: [BigInt(tokenId)],
    to: address,
  });
});

app.transaction("/drop-token/:tokenId", (c) => {
  const tokenId = c.req.param("tokenId");
  // Contract transaction response.
  console.log(tokenId);
  console.log(c.frameData?.address);
  return c.contract({
    abi,
    chainId: "eip155:84532",
    functionName: "dropToken",
    args: [BigInt(tokenId)],
    to: address,
  });
});

app.transaction("/minted/:cid", (c) => {
  const cid = c.req.param("cid");
  // Contract transaction response.
  console.log(cid);
  console.log(c.frameData?.address);
  return c.contract({
    abi,
    chainId: "eip155:84532",
    functionName: "safeMint",
    //@ts-expect-error
    args: [c.frameData?.address, cid],
    to: address,
  });
});

app.frame("/lit-token-finish", async (c) => {
  return c.res({
    image: (
      <div tw="flex bg-white text-black h-full w-full justify-center items-center p-3">
        <p tw="text-[40px] border border-black p-3">
          You've litted the roast token successfully, Now you can get your own
          roast
        </p>
      </div>
    ),
    intents: [
      <Button action="/generate-roast">Get Your Roast</Button>,
      <Button.Link href={getWebURL() || ""}>Vist Website</Button.Link>,
    ],
  });
});

app.frame("/drop-token-finish", async (c) => {
  return c.res({
    image: (
      <div tw="flex bg-white text-black h-full w-full justify-center items-center p-3">
        <p tw="text-[40px] border border-black p-3">
          You've water dropped the roast token successfully, Now you can get
          your own roast
        </p>
      </div>
    ),
    intents: [
      <Button action="/generate-roast">Get Your Roast</Button>,
      <Button.Link href={getWebURL() || ""}>Vist Website</Button.Link>,
    ],
  });
});

app.frame("/minting-finish", async (c) => {
  const { buttonValue, inputText, status } = c;
  const fruit = inputText || buttonValue;

  return c.res({
    image: (
      <div tw="flex bg-white text-black h-full w-full justify-center items-center p-3">
        <p tw="text-[40px] border border-black p-3">
          Your Roast NFT has minted successfully, Now you can roast your friend
          by entering farcaster name
        </p>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter farcaster name" />,
      <Button action="/roast-a-friend">Roast - A - Friend</Button>,
      <Button.Link href={getWebURL() || ""}>Vist Website</Button.Link>,
    ],
  });
});

app.frame("/roast-a-friend", async (c) => {
  const { buttonValue, inputText, status } = c;

  return c.res({
    image: (
      <div tw="flex bg-white text-black h-full w-full justify-center items-center p-3">
        <p tw="text-[40px] border border-black p-3">
          "Successfully roasted your friend, Check our farcaster handle to see
          the roast"
        </p>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter your friend farcaster name..." />,
      <Button action="/roast-a-friend">Roast - A - Friend</Button>,
      <Button.Link href={getWebURL() || ""}>Vist Website</Button.Link>,
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);

// NOTE: That if you are using the devtools and enable Edge Runtime, you will need to copy the devtools
// static assets to the public folder. You can do this by adding a script to your package.json:
// ```json
// {
//   scripts: {
//     "copy-static": "cp -r ./node_modules/frog/_lib/ui/.frog ./public/.frog"
//   }
// }
// ```
// Next, you'll want to set up the devtools to use the correct assets path:
// ```ts
// devtools(app, { assetsPath: '/.frog' })
// ```
