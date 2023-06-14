import React, { useEffect, useState } from "react";
import Head from "next/head";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Vote: NextPage = () => {
  const { address } = useAccount();
  const [id, setId] = useState<number | undefined>(undefined);
  const [voteVar, setVoteVar] = useState<number | undefined>(undefined);

  const { data: allProposals } = useScaffoldContractRead({
    contractName: "DaomocracyContract",
    functionName: "getAllProposals",
  });

  const [selectedProposal, setSelectedProposal] = useState<{ id: number | undefined; randomDelegates: string[] }>({
    id: undefined,
    randomDelegates: [],
  });
  
  const { writeAsync } = useScaffoldContractWrite({
    contractName: "DaomocracyContract",
    functionName: "countVote",
    args: [id, address, voteVar],
  });

  const userProposals = allProposals?.filter(
    proposal => proposal.randomDelegates && address && proposal.randomDelegates.includes(address),
  );

  useEffect(() => {
    if (allProposals) {
      allProposals.forEach(proposal => {
        const proposalId = proposal.id;
        console.log(`Proposal ${proposalId} Random Delegates:`, proposal.randomDelegates);
      });
    }
  }, [allProposals]);

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
          .button-container {
            display: flex;
            justify-content: center;
            margin-top: -20px;
            width: 100%;
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
                  <div className="label">Reward:</div>
                  <div className="response">{ethers.utils.formatEther(proposal.reward)}</div>
                </div>

                <div className="row">
                  <div className="label">Proposal:</div>
                  <div className="response">{proposal.description}</div>
                </div>
                <div className="button-container">
                  <div style={{ display: "flex", justifyContent: "center", paddingTop: "40px", paddingRight: "20px" }}>
                    <button
                      className="btn btn-primary bg-transparent btn-lg text-primary hover:bg-primary hover:text-white"
                      type="button"
                      style={{
                        borderWidth: "3px",
                        width: "120px",
                        textTransform: "none",
                        boxShadow: "3px 3px 0px rgba(0, 0, 0, 0.1)",
                        borderColor: "#6B7280",
                        borderRadius: "0",
                        padding: "0 10px",
                      }}
                      onClick={() => {
                        setId(proposal.id);
                        setVoteVar(1);
                        writeAsync();
                      }}
                    >
                      approve
                    </button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", paddingTop: "40px", paddingLeft: "20px" }}>
                    <button
                      className="btn btn-primary bg-transparent btn-lg text-primary hover:bg-primary hover:text-white"
                      type="button"
                      style={{
                        borderWidth: "3px",
                        width: "120px",
                        textTransform: "none",
                        boxShadow: "3px 3px 0px rgba(0, 0, 0, 0.1)",
                        borderColor: "#6B7280",
                        borderRadius: "0",
                      }}
                      onClick={() => {
                        setId(proposal.id);
                        setVoteVar(0);
                        writeAsync();
                      }}
                    >
                      reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedProposal.id !== undefined && (
        <div className="proposal-info">
          <div className="label">Selected Proposal ID:</div>
          <div className="response">{selectedProposal.id}</div>

          <div className="label">Random Delegates:</div>
          <div className="response">
            {selectedProposal.randomDelegates.map((delegate, index) => (
              <span key={index}>{delegate}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Vote;
