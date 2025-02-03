/** @jsxImportSource frog/jsx */

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

app.frame("/:tokenId", async (c) => {
  const roastData = [
    {
      roast: "You’ve spent more on gas fees than on your coffee this month! ☕",
      walletAddress: "0x1234567890",
      flameCount: 3,
    },
  ];
  const { buttonValue, inputText, status } = c;
  const fruit = inputText || buttonValue;

  console.log(c.req.param("tokenId"));
  const tokenId = c.req.param("tokenId");

  const ipfsMetaDataResponse = await axios.get(
    `https://white-official-scallop-559.mypinata.cloud/ipfs/${tokenId}`
  );

  console.log(ipfsMetaDataResponse.data);
  // const roastResponse = await axios.get(
  //   "http://localhost:3001/api/generate-roast"
  // );

  // const roastImageResponse = await axios.post(
  //   "http://localhost:3001/api/generate-image",
  //   {
  //     roast: roastData[0].roast,
  //     walletAddress: roastData[0].walletAddress,
  //     flameCount: roastData[0].flameCount,
  //   }
  // );

  // const { image } = roastImageResponse.data;

  return c.res({
    // image ? (`data:image/png;base64,${image}`) :
    image: (
      <div tw="flex bg-white text-black">
        <p>hi {ipfsMetaDataResponse.data.name}</p>
      </div>
    ),

    intents: [
      <Button action="/getRoast" value="goldfinger">
        Get Your Roast
      </Button>,
      <Button.Mint target="eip155:84532:0x07E909d6B1857E7a90a6a05DacE89A1d8E234Bfc:1">
        Mint Now
      </Button.Mint>,
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
