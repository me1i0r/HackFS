import React, { useEffect, useState } from "react";
import Head from "next/head";
import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";
import seedrandom from "seedrandom";

const Review = () => {
  const [randomNumber, setRandomNumber] = useState<string | null>(null);
  const [randomNumbersList, setRandomNumbersList] = useState<number[]>([]);

  useEffect(() => {
    const chainUrl = "https://api.drand.sh";

    const fetchRandomNumber = async () => {
      try {
        const response = await fetch(`${chainUrl}/public/latest`);
        const { randomness } = await response.json();

        setRandomNumber(randomness);
      } catch (error) {
        console.error("Failed to fetch random number:", error);
      }
    };

    fetchRandomNumber();
  }, []);

  useEffect(() => {
    if (randomNumber) {
      const seed = randomNumber.toString();
      const rng = seedrandom(seed);

      const selectedIndices = new Set<number>();
      while (selectedIndices.size < 10) {
        const randomIndex = Math.floor(rng() * 100) + 1;
        selectedIndices.add(randomIndex);
      }

      setRandomNumbersList(Array.from(selectedIndices));
    }
  }, [randomNumber]);

  const sendNotification = async () => {
    const PK = "67e1561b067d02337b50531260a80c8b11e2ecbdcc11293d6bc3422d4457fdaa"; // channel private key
    const Pkey = `0x${PK}`;
    const _signer = new ethers.Wallet(Pkey);

    try {
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer: _signer,
        type: 1, // broadcast
        identityType: 2, // direct payload
        notification: {
          title: `[SDK-TEST] notification TITLE:`,
          body: `[sdk-test] notification BODY`,
        },
        payload: {
          title: `[sdk-test] payload title`,
          body: `sample msg body`,
          cta: "",
          img: "",
        },
        channel: "eip155:5:0x616b5249Aaf1C924339f8B8E94474e64Ceb22Af3", // your channel address
        env: "staging",
      });
      console.log("Notification sent:", apiResponse);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  return (
    <div className="review-page">
      <Head>
        <title>review | DAOmocracy</title>
      </Head>
      <p className="centered-text">Random Number from drand: {randomNumber}</p>
      <ul>
        {randomNumbersList.map(number => (
          <li key={number}>{number}</li>
        ))}
      </ul>
      <button onClick={sendNotification}>Send Notification</button>
    </div>
  );
};

export default Review;
