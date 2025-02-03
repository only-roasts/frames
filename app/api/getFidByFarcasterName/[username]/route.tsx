import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{
      username: string;
    }>;
  }
) {
  // Introducing a 6-second delay
  //   await new Promise((resolve) => setTimeout(resolve, 6000));

  const username = (await context.params).username;

  const response = await axios.get(
    `https://fnames.farcaster.xyz/transfers/current?name=${username}`
  );

  const fid = response.data.transfer.to;

  return NextResponse.json({ fid });
}
