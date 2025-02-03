/** @jsxImportSource frog/jsx */

import { getIpfsMetadata, getRoast } from "@/app/lib/utils";
import axios from "axios";
import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
  title: "Frog Frame",
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'
const roastData = [
  {
    roast: "You’ve spent more on gas fees than on your coffee this month! ☕",
    walletAddress: "0x1234567890",
    flameCount: 3,
  },
];

app.frame("/inital/:tokenId", async (c) => {
  const { buttonValue, inputText, status } = c;
  const fruit = inputText || buttonValue;

  const tokenId = c.req.param("tokenId");

  const ipfsMetaData = await getIpfsMetadata(tokenId);

  return c.res({
    image: (
      <div tw="flex bg-white text-black">
        <p>hi {ipfsMetaData.name}</p>
        <p>description: {ipfsMetaData.description}</p>
      </div>
    ),

    intents: [
      <Button action="/generate-roast">Get Your Roast</Button>,

      <Button.Link href="https://google.com">Vist Website</Button.Link>,
    ],
  });
});

app.frame("/generate-roast", async (c) => {
  const fid = c.frameData?.fid;
  const { roast, address } = await getRoast(fid);
  return c.res({
    image: (
      <div tw="flex bg-white text-black">
        <p>{roast}</p>
      </div>
    ),
    intents: [
      <Button value="goldfinger">Mint Your Roast</Button>,

      <Button.Link href="https://google.com">Vist Website</Button.Link>,
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
