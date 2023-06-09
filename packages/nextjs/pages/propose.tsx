import React, { useEffect, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Propose: NextPage = () => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const { address } = useAccount();
  const [title, setTitle] = useState("");
  const [dao, setDAO] = useState("");
  const [amount, setAmount] = useState("");
  const [proposal, setProposal] = useState("");

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "VRFv2DirectFundingConsumer",
    functionName: "handleSubmission",
    args: [title, dao, amount, proposal],
  });

  const { data: allProposals } = useScaffoldContractRead({
    contractName: "VRFv2DirectFundingConsumer",
    functionName: "getAllProposals",
  });

  useEffect(() => {
    if (allProposals) {
      const randomDelegates = allProposals
        .map(proposal => proposal.randomDelegates)
        .reduce((acc, delegates) => acc.concat(delegates), []);
      console.log("Random Delegates:", randomDelegates);
    }
  }, [allProposals]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    writeAsync();
  };

  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          .form-control {
            border: 3px solid #8d56a9;
            border-radius: 0;
            box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.1);
            width: 100%;
            transition: border-color 0.3s;
          }

          .form-control:focus {
            border-color: ${isInputFocused ? "#6B7280" : "#8d56a9"};
            outline: none;
          }

          .form-label {
            color: #6B7280;
          }

          .btn-primary {
            color: #FFFFFF;
            background-color: #6B7280;
            border-color: #6B7280;
          }

          .btn-primary:hover {
            background-color: #6B7280;
            border-color: #6B7280;
          }
        `}</style>
        <title>Debug Contracts | Scaffold-ETH 2</title>
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
        <span className="block text-9xl pl-10 absolute top-0 left-10 my-soul-font" style={{ color: "#8d56a9" }}>
          propose
        </span>

        <form style={{ width: "50%" }} onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputTitle" className="form-label">
              title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required
            />
          </div>
          <div className="mb-3" style={{ display: "flex" }}>
            <div style={{ flex: 1, marginRight: "10px" }}>
              <label htmlFor="exampleInputDAO" className="form-label">
                DAO
              </label>
              <select
                className="form-control"
                id="dao"
                value={dao}
                onChange={e => setDAO(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              >
                <option value="">Select DAO</option>
                <option value="demoDAO">demoDAO</option>
                <option value="anotherDAO">anotherDAO</option>
              </select>
            </div>
            <div style={{ flex: 1, marginLeft: "10px" }}>
              <label htmlFor="exampleInputAmount" className="form-label">
                amount
              </label>
              <div>
                <input
                  type="text"
                  className="form-control"
                  id="amount"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputProposal" className="form-label">
              proposal
            </label>
            <textarea
              className="form-control"
              id="proposal"
              rows={15}
              value={proposal}
              onChange={e => setProposal(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "25px" }}>
            <button
              className="btn btn-primary bg-transparent btn-lg text-primary hover:bg-primary hover:text-white"
              type="button"
              style={{
                borderWidth: "3px",
                textTransform: "none",
                boxShadow: "3px 3px 0px rgba(0, 0, 0, 0.1)",
                borderColor: "#6B7280",
                borderRadius: "0",
              }}
            >
              submit
            </button>
          </div>
        </form>
      </div>
      <div>
        <h2>Your Address: {address}</h2>
      </div>
      {allProposals && (
        <div>
          <h2>All Proposals</h2>
          <ul>
            {allProposals.map((proposal, index) => (
              <li key={index}>
                <p>Proposer: {proposal.proposer}</p>
                <p>Title: {proposal.title}</p>
                <p>DAO: {proposal.DAO}</p>
                <p>Amount: {proposal.amount}</p>
                <p>Description: {proposal.description}</p>
                <p>Random Delegates: {proposal.randomDelegates.join(", ")}</p>
                <p>Yes Votes: {proposal.yesVotes.join(", ")}</p>
                <p>No Votes: {proposal.noVotes.join(", ")}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        {allProposals && (
          <div>
            <h2>All Proposals</h2>
            {allProposals.map((proposal, index) => (
              <div key={index}>
                <p>Title: {proposal.title}</p>
                <p>Random Delegates: {proposal.randomDelegates.join(", ")}</p>
                {address && proposal.randomDelegates.includes(address) && (
                  <p>Your Address is in the Random Delegates list!</p>
                )}
              </div>
            ))}
          </div>
        )}{" "}
      </div>
      <style jsx>{`
        .centered-text {
          display: flex;
          justify-content: center;
          height: 100vh;
          position: absolute;
          top: 0;
        }

        .text-primary {
          color: #6b7280;
          font-size: 24px;
          font-weight: bold;
          text-align: center;
        }

        .form-control {
          padding-left: 20px; /* Add some padding to accommodate the $ symbol */
        }

        .button-container {
          display: flex;
          justify-content: center;
          padding-top: 25px;
        }

        .btn {
          border-width: 3px;
          text-transform: none;
          box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.1);
          border-color: #6b7280;
          border-radius: 0;
        }

        .btn-primary {
          background-color: transparent;
          color: #6b7280;
        }

        .btn-primary:hover {
          background-color: #6b7280;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Propose;
