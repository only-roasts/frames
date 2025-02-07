/** @jsxImportSource frog/jsx */

import { getIpfsMetadata, getRoast, getWebURL } from "@/app/lib/utils";
import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { abi } from "@/app/lib/OnlyRoastABI";

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

app.frame("/initial/:cid", async (c) => {
  const { buttonValue, inputText, status } = c;
  const fruit = inputText || buttonValue;

  const cid = c.req.param("cid");

  const ipfsMetaData = await getIpfsMetadata(cid);

  const { name, description, image, attributes } = ipfsMetaData;

  console.log(ipfsMetaData);
  return c.res({
    image: (
      <div tw="flex bg-white text-black h-full w-full justify-center items-center ">
        {name}
      </div>
    ),

    intents: [
      <Button>Lit</Button>,
      <Button>Drop</Button>,
      <Button action="/generate-roast">Get Your Roast</Button>,
      <Button.Link href={getWebURL() || ""}>Vist Website</Button.Link>,
    ],
  });
});

app.frame("/generate-roast", async (c) => {
  const fid = c.frameData?.fid;
  const { cid } = await getRoast(fid);
  // const ipfsMetaData = await getIpfsMetadata(cid);

  return c.res({
    action: "/finish",
    image: (
      <div tw="flex bg-white text-black h-full w-full justify-center items-center">
        <p tw="text-[40px] border border-black p-3">
          "You’ve spent more on gas fees than on your coffee this month! ☕"
        </p>
      </div>
    ),
    intents: [
      <Button.Transaction
        target={`/minted/${cid}`}
      >
        Mint As NFT
      </Button.Transaction>,

      <Button.Link href={getWebURL() || ""}>Vist Website</Button.Link>,
    ],
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
    to: "0x0d23c18151c8289d2B72d577a6b9Bf44b3660A4F",
  });
});

app.frame("/finish", async (c) => {
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
