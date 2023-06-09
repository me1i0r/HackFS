import React, { useEffect, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const Vote: NextPage = () => {
  const { address } = useAccount();
  const { data: allProposals } = useScaffoldContractRead({
    contractName: "VRFv2DirectFundingConsumer",
    functionName: "getAllProposals",
  });

  const userProposals = allProposals?.filter(
    proposal => proposal.randomDelegates && proposal.randomDelegates.includes(address),
  );

  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          .text-primary {
            color: #6B7280;
          }
          .proposal-container {
            display: flex;
            flex-wrap: wrap;
            flex-direction: column;
            align-items: center;
            width: 100%;
          }
          .proposal-box {
            border: 3px solid #e49f1b;
            width: 50%;
            padding: 20px;
            margin-bottom: 20px;
            text-align: left;
          }
          .label {
            font-weight: bold;
            color: #6B7280;
          }

          .response {
            margin-left: 10px;
          }
          
          .row {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
          }
        `}</style>
        <title>Vote | Scaffold-ETH 2</title>
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

        {userProposals && (
          <div className="proposal-container">
            {userProposals.map((proposal, index) => (
              <div key={index} className="proposal-box">
                <div className="row">
                  <div className="label">Title:</div>
                  <div className="response">{proposal.title}</div>
                </div>
                <div className="row">
                  <div className="label">DAO:</div>
                  <div className="response">{proposal.DAO}</div>
                </div>
                <div className="row">
                  <div className="label">Amount:</div>
                  <div className="response">{proposal.amount}</div>
                </div>
                <div className="row">
                  <div className="label">Proposal:</div>
                  <div className="response">{proposal.description}</div>
                </div>
                <div className="button-container">
                  <button className="btn btn-primary" type="button">
                    Approve
                  </button>
                  <button className="btn btn-primary" type="button">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Vote;
