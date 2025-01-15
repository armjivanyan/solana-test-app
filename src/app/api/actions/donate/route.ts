
import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS } from "@solana/actions"
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export const GET = (req: Request) => {
    const payload: ActionGetResponse = {
        icon: new URL("/test.jpg", new URL(req.url).origin).toString(),
        label: "Donate 1 SOL",
        description: "Testing simple action with sol in devnet",
        title: "Test Task"
    };

    return Response.json(payload, {
        headers: ACTIONS_CORS_HEADERS
    });
}

export const OPTIONS = GET;

export const POST = async (req: Request) => {
    try {
      const body: ActionPostRequest = await req.json();
      let account: PublicKey;
      try {
        account = new PublicKey(body.account);
      } catch (err) {
        throw "Invalid account";
      }
      let amount: number = 1;
      
      const TO_PUBKEY = new PublicKey("DLueJF5SwMR9h85nj8aGroUZLHFQTsNtteFgNjoc5ir8")
      const connection = new Connection(clusterApiUrl("devnet"))

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: account,
          lamports: amount * LAMPORTS_PER_SOL,
          toPubkey: TO_PUBKEY,
        }),
      );
      transaction.feePayer = account;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      const serializedTransaction = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      });

      return Response.json({
        transaction: serializedTransaction.toString("base64"),
        message: "Thanks for your donation",
        type: "transaction"
      }, {
        headers: ACTIONS_CORS_HEADERS,
      });
    } catch (err) {
      let message = "Error occured";
      if (typeof err == "string") message = err;
  
      return Response.json({
          message,
        },{
          headers: ACTIONS_CORS_HEADERS,
        },
      );
    }
  };