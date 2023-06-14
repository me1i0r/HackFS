import { expect } from "chai";
import { ethers } from "hardhat";
import { VRFv2DirectFundingConsumer } from "../typechain-types";

describe("VRFv2DirectFundingConsumer", function () {
  let vrfConsumer: VRFv2DirectFundingConsumer;
  before(async () => {
    const [owner] = await ethers.getSigners();
    const vrfConsumerFactory = await ethers.getContractFactory("VRFv2DirectFundingConsumer");
    vrfConsumer = (await vrfConsumerFactory.deploy()) as VRFv2DirectFundingConsumer;
    await vrfConsumer.deployed();
  });

  describe("Deployment", function () {
    it("Should initialize with correct members and sample size", async function () {
      const members = await vrfConsumer.members();
      expect(members).to.deep.equal([
        "0xEDBB33d95b764103AbE1Bc1550dBC09bEE4C6F3d",
        "0x2D2ce9676CF72505E0AeFA3dc2d3061BF84A5097",
        "0xDfF835cEE7A14863BfCd264979a86d1aF2E8512C",
        "0x6816FA2c2D1848165cCb535eF8fC695f6B8CaF10",
        "0x2249874CA159908FEc4C71A982758446bA000ee5",
      ]);

      const sampleSize = await vrfConsumer.sampleSize();
      expect(sampleSize).to.equal(3);
    });

    it("Should request random words", async function () {
      const requestId = await vrfConsumer.requestRandomWords();
      expect(requestId).to.exist;
    });
  });

  describe("Proposal handling", function () {
    it("Should handle proposal submission and get all proposals", async function () {
      const proposer = await ethers.getSigner(1).getAddress();
      const title = "Test Proposal";
      const DAO = "Test DAO";
      const amount = ethers.utils.parseEther("1");
      const description = "Test Proposal Description";

      await vrfConsumer.handleSubmission(proposer, title, DAO, amount, description);

      const proposals = await vrfConsumer.getAllProposals();
      expect(proposals.length).to.equal(1);
      const proposal = proposals[0];
      expect(proposal.proposer).to.equal(proposer);
      expect(proposal.title).to.equal(title);
      expect(proposal.DAO).to.equal(DAO);
      expect(proposal.amount).to.equal(amount);
      expect(proposal.description).to.equal(description);
    });

  //   it("Should count votes for a proposal", async function () {
  //     const voter = await ethers.getSigner(2).getAddress();
  //     const proposalId = 0;
  //     const vote = 1;

  //     await vrfConsumer.countVote(proposalId, voter, vote);

  //     const proposals = await vrfConsumer.getAllProposals();
  //     const proposal = proposals[proposalId];
  //     expect(proposal.yesVotes).to.deep.equal([voter]);
  //     expect(proposal.noVotes).to.be.empty;
  //   });

  //   it("Should perform upkeep and payout for a proposal", async function () {
  //     const proposalId = 0;

  //     // Advance the block timestamp to simulate the end of the voting period
  //     await ethers.provider.send("evm_increaseTime", [votingDuration]);
  //     await ethers.provider.send("evm_mine");

  //     await vrfConsumer.performUpkeep(ethers.utils.defaultAbiCoder.encode(["uint256"], [proposalId]));

  //     const proposals = await vrfConsumer.getAllProposals();
  //     const proposal = proposals[proposalId];
  //     expect(proposal.isPaid).to.be.true;
  //     expect(await ethers.provider.getBalance(proposal.proposer)).to.equal(proposal.amount);
  //     if (proposal.yesVotes.length > 0) {
  //       expect(await ethers.provider.getBalance(proposal.yesVotes[0])).to.equal(proposal.reward);
  //     }
  //   });
  // });
});
