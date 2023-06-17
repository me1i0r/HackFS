import React from "react";
import Head from "next/head";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

const Vote = () => {
  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          .text-primary {
            color: #6B7280;
          }
        `}</style>
        <title>vote | DAOmocracy</title>
      </Head>
      <div
        style={{
          background: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div style={{ position: "absolute", top: "10px", right: "100px" }}>
          <RainbowKitCustomConnectButton />
        </div>

        <span className="block text-9xl pl-10 absolute top-0 left-10 my-soul-font" style={{ color: "#e49f1b" }}>
          vote
        </span>
      </div>
    </div>
  );
};

export default Vote;
