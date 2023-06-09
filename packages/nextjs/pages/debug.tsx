import React, { useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import { useLocalStorage } from "usehooks-ts";
import { MetaHeader } from "~~/components/MetaHeader";
import { ContractUI } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { ContractName } from "~~/utils/scaffold-eth/contract";
import { getContractNames } from "~~/utils/scaffold-eth/contractNames";

// Import the hook

const selectedContractStorageKey = "scaffoldEth2.selectedContract";

const Debug: NextPage = () => {
  const contractNames = getContractNames();
  const [selectedContract, setSelectedContract] = useLocalStorage<ContractName>(
    selectedContractStorageKey,
    contractNames[0],
  );
  const [title, setTitle] = useState("");
  const [dao, setDAO] = useState("");
  const [amount, setAmount] = useState("");
  const [proposal, setProposal] = useState("");
  const { writeAsync } = useScaffoldContractWrite({
    contractName: "VRFv2DirectFundingConsumer",
    functionName: "handleSubmission", // Assuming you have a function called setProposalData in YourContract
    args: [title, dao, amount, proposal], // Pass the form data as arguments
    // Other options as per your requirement
  });

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    writeAsync();
  };

  return (
    <>
      <MetaHeader
        title="Debug Contracts | Scaffold-ETH 2"
        description="Debug your deployed 🏗 Scaffold-ETH 2 contracts in an easy way"
      />
      <div className="flex flex-col gap-y-6 lg:gap-y-8 py-8 lg:py-12 justify-center items-center">
        {contractNames.length === 0 ? (
          <p className="text-3xl mt-14">No contracts found!</p>
        ) : (
          <>
            {contractNames.length > 1 && (
              <div className="flex flex-row gap-2 w-full max-w-7xl pb-1 px-6 lg:px-10 flex-wrap">
                {contractNames.map(contractName => (
                  <button
                    className={`btn btn-secondary btn-sm normal-case font-thin ${
                      contractName === selectedContract ? "bg-base-300" : "bg-base-100"
                    }`}
                    key={contractName}
                    onClick={() => setSelectedContract(contractName)}
                  >
                    {contractName}
                  </button>
                ))}
              </div>
            )}
            <div>
              <Head>
                <title>Propose</title>
              </Head>
              <form onSubmit={handleFormSubmit}>
                <div>
                  <label htmlFor="exampleInputTitle">Title</label>
                  <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ flex: 1, marginRight: "10px" }}>
                    <label htmlFor="exampleInputDAO">DAO</label>
                    <select id="dao" value={dao} onChange={e => setDAO(e.target.value)}>
                      <option value="">Select DAO</option>
                      <option value="dao1">demoDAO</option>
                      <option value="dao2">anotherDAO</option>
                    </select>
                  </div>
                  <div style={{ flex: 1, marginLeft: "10px" }}>
                    <label htmlFor="exampleInputAmount">Amount</label>
                    <div>
                      <span>$</span>
                      <input type="text" id="amount" value={amount} onChange={e => setAmount(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="exampleInputProposal">Proposal</label>
                  <textarea
                    id="proposal"
                    rows={5}
                    value={proposal}
                    onChange={e => setProposal(e.target.value)}
                  ></textarea>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "25px",
                  }}
                >
                  <button type="submit">Submit</button>
                </div>
              </form>
            </div>
            {contractNames.map(contractName => (
              <ContractUI
                key={contractName}
                contractName={contractName}
                className={contractName === selectedContract ? "" : "hidden"}
              />
            ))}
          </>
        )}
      </div>
      <div className="text-center mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Debug Contracts</h1>
        <p className="text-neutral">
          You can debug & interact with your deployed contracts here.
          <br /> Check{" "}
          <code className="italic bg-base-300 text-base font-bold [word-spacing:-0.5rem] px-1">
            packages / nextjs / pages / debug.tsx
          </code>{" "}
        </p>
      </div>
    </>
  );
};

export default Debug;
