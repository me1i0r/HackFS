import React, { useState } from "react";
import Head from "next/head";
import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";
import type { NextPage } from "next";
import seedrandom from "seedrandom";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

const Propose: NextPage = () => {
  // Hardcoded DAO for demonstration
  const memberAddresses = [
    "0xEDBB33d95b764103AbE1Bc1550dBC09bEE4C6F3d",
    "0x2D2ce9676CF72505E0AeFA3dc2d3061BF84A5097",
    "0xDfF835cEE7A14863BfCd264979a86d1aF2E8512C",
    "0x6816FA2c2D1848165cCb535eF8fC695f6B8CaF10",
    "0x2249874CA159908FEc4C71A982758446bA000ee5",
  ];
  const [title, setTitle] = useState("");
  const [DAO, setDAO] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Use drand number to randomly select three delegtates for demonstration
  const delegate = async () => {
    try {
      const chainUrl = "https://api.drand.sh";
      const response = await fetch(`${chainUrl}/public/latest`);
      const { randomness } = await response.json();

      const seed = randomness.toString();
      const rng = seedrandom(seed);

      const selectedAddresses: string[] = [];
      const selectedIndices = new Set<number>();

      while (selectedIndices.size < 3) {
        const randomIndex = Math.floor(rng() * memberAddresses.length);
        selectedIndices.add(randomIndex);
      }

      selectedIndices.forEach(index => {
        selectedAddresses.push(memberAddresses[index]);
      });

      console.log(selectedAddresses);
      await notify(selectedAddresses);

    } catch (error) {
      console.error("Failed to fetch random number:", error);
    }
  };

  // Notify delegates through Push SDK
  const notify = async (addresses: string[]) => {
    const PK = "67e1561b067d02337b50531260a80c8b11e2ecbdcc11293d6bc3422d4457fdaa";
    const Pkey = `0x${PK}`;
    const _signer = new ethers.Wallet(Pkey);

    try {
      const formattedAddresses = addresses.map(address => `eip155:5:${address}`);
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer: _signer,
        type: 4,
        identityType: 2,
        notification: {
          title: `You received a delegation in ${DAO}!`,
          body: `Proposal: ${title}`,
        },
        payload: {
          title: `You received a delegation in ${DAO}!`,
          body: `Proposal: ${title}`,
          cta: "",
          img: "",
        },
        recipients: formattedAddresses,
        channel: "eip155:5:0x616b5249Aaf1C924339f8B8E94474e64Ceb22Af3",
        env: "staging",
      });

      // Handle the response if needed
      console.log("Notification sent:", apiResponse);
    } catch (error) {
      console.error("Failed to send notifications:", error);
    }
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };
  const handleInputBlur = () => {
    setIsInputFocused(false);
  };
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    delegate();
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
        <title>propose | DAOmocracy</title>
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
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              value={title}
              onChange={e => setTitle(e.target.value)}
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
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                value={DAO}
                onChange={e => setDAO(e.target.value)}
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
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              required
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "25px" }}>
            <button
              className="btn btn-primary bg-transparent btn-lg text-primary hover:bg-primary hover:text-white"
              type="submit"
              style={{
                borderWidth: "3px",
                textTransform: "none",
                boxShadow: "3px 3px 0px rgba(0, 0, 0, 0.1)",
                borderColor: "#6B7280",
                fontSize: "20px",
                borderRadius: "0",
              }}
            >
              submit
            </button>
          </div>
        </form>
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
