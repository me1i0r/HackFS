// SPDX-License-Identifier: MIT
// DAOmocracy demonstration contract
// Modified from Chainlink's VRFv2DirectFundingConsumer.sol

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

contract VRFv2DirectFundingConsumer is
    VRFV2WrapperConsumerBase,
    ConfirmedOwner,
    AutomationCompatible
{
    // Hardcoded DAO and samplesize for demonstration
    address[] public members = [
        address(0xEDBB33d95b764103AbE1Bc1550dBC09bEE4C6F3d),
        address(0x2D2ce9676CF72505E0AeFA3dc2d3061BF84A5097),
        address(0xDfF835cEE7A14863BfCd264979a86d1aF2E8512C),
        address(0x6816FA2c2D1848165cCb535eF8fC695f6B8CaF10),
        address(0x2249874CA159908FEc4C71A982758446bA000ee5)];
    uint256 public sampleSize = 3;
    address[] public sample;
    uint8 public proposalCount = 0;
    uint256 public votingDuration = 120;

    
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(
        uint256 requestId,
        uint256[] randomWords,
        uint256 payment
    );

    struct RequestStatus {
        uint256 paid; 
        bool fulfilled; 
        uint256[] randomWords;
    }
    
    struct Proposal {
        uint8 id;
        address proposer;
        string title;
        string DAO;
        uint256 amount;
        uint256 reward;
        uint256 startTime;
        string description;
        address[] randomDelegates;  
        address[] yesVotes;
        address[] noVotes;
        bool isPaid;
    }
    
    Proposal[] public proposals;

    mapping(uint256 => RequestStatus)
        public s_requests; 
    uint256[] public requestIds;
    uint256 public lastRequestId;

    uint32 callbackGasLimit = 2000000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 2;

    // Address LINK and address WRAPPER - hardcoded for Sepolia
    address linkAddress = 0x779877A7B0D9E8603169DdbD7836e478b4624789;
    address wrapperAddress = 0xab18414CD93297B0d12ac29E63Ca20f515b3DB46;

    constructor()
        ConfirmedOwner(msg.sender)
        VRFV2WrapperConsumerBase(linkAddress, wrapperAddress)
    {}

    function requestRandomWords()
        external
        onlyOwner
        returns (uint256 requestId)
    {
        requestId = requestRandomness(
            callbackGasLimit,
            requestConfirmations,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            paid: VRF_V2_WRAPPER.calculateRequestPrice(callbackGasLimit),
            randomWords: new uint256[](0),
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

    function requestRandomWordsWrapper() internal onlyOwner returns (uint256 requestId) {
        requestId = requestRandomness(
            callbackGasLimit,
            requestConfirmations,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            paid: VRF_V2_WRAPPER.calculateRequestPrice(callbackGasLimit),
            randomWords: new uint256[](0),
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }


    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].paid > 0, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;

        getSample(_randomWords);

        emit RequestFulfilled(
            _requestId,
            _randomWords,
            s_requests[_requestId].paid
        );
    }

    function getSample(uint256[] memory randomWords) public  {

        // Random number between 0 and number of members - 1 for starting index
        uint256 randStart = randomWords[0] % (members.length);

        // Random number between 1 and number of members - 1 for incrementing
        uint256 randIncrement = randomWords[1] % (members.length - 1) + 1;

        // Random sample of member addresses
        sample = new address[](sampleSize);

        // Make a copy of the members array
        address[] memory localMembers= new address[](members.length);
        for (uint256 i = 0; i < members.length; i++) {
            localMembers[i] = members[i];
        }

        // Start with a random index 
        uint256 index = randStart;

        // Loop until the number of addressses in the sample array equals the sample size    
        for (uint256 i = 0; i < sampleSize; i++) {
            
            // Put the address of the member at the index in the sample array
            sample[i] = localMembers[index];
            localMembers[index] = address(0);
            
            // Wrap the index if it exceeds the number of members
            if (index + randIncrement >= members.length) {
                index = (index + randIncrement) % members.length;
            
            // Add the random increment to the index
            } else {
                index += randIncrement;
            }       

            // Avoid selecting the same address twice
            while (members[index] == address(0)) {
                index++;
                if (index >= members.length) {
                    index = 0;
                }
            }
        }
    
        // Assign the sample to the latest proposal
        proposals[proposalCount - 1].randomDelegates = sample;
    }   

    function handleSubmission(
        address _proposer,
        string memory _title,
        string memory _DAO,
        uint256 _amount,
        string memory _description
    ) public {
        Proposal memory newProposal;
        newProposal.proposer = _proposer;
        newProposal.id = proposalCount;
        newProposal.title = _title;
        newProposal.DAO = _DAO;
        newProposal.amount = _amount;
        newProposal.description = _description;
        newProposal.reward = _amount / 10;

        proposals.push(newProposal);
        proposalCount = uint8(proposals.length);
        requestRandomWordsWrapper();
    }

    function getAllProposals() public view returns (Proposal[] memory) {
        return proposals;
    }

    // Would add checks here to make sure voter is delegate and has not voted
    function countVote(uint256 id, address voter, uint8 vote) public {
        Proposal storage proposal = proposals[id];

        if (vote == 1) {
            proposal.yesVotes.push(voter);
        } else {
            proposal.noVotes.push(voter);
        }
    }

    function randomDelegatesContains(uint256 id, address voter) internal view returns (bool) {
        Proposal storage proposal = proposals[id];

        for (uint256 i = 0; i < proposal.randomDelegates.length; i++) {
            if (proposal.randomDelegates[i] == voter) {
                return true;
            }
        }

        return false;
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    ) external view override returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = false;
        for (uint256 i = 0; i < proposals.length; i++) {
            if ((block.timestamp - proposals[i].startTime) > votingDuration && proposals[i].isPaid == false) {
                upkeepNeeded = true;
                performData = abi.encode(i);
                break;
            }
        }
    }

  function performUpkeep(bytes calldata performData) external override {
    uint256 proposalIndex = abi.decode(performData, (uint256));
    _payout(proposalIndex);
  }

   function _payout(uint256 proposalIndex) internal {
        Proposal storage proposal = proposals[proposalIndex];
        require((block.timestamp - proposal.startTime) > votingDuration, "Voting period is not over yet");
        require(!proposal.isPaid, "Proposal has already been paid out");

        uint256 yesVotesCount = proposal.yesVotes.length;
        uint256 noVotesCount = proposal.noVotes.length;

        if (yesVotesCount > noVotesCount) {
            // Transfer proposal amount to proposer
            payable(proposal.proposer).transfer(proposal.amount);

            // Distribute reward to yesVotes addresses
            for (uint256 i = 0; i < yesVotesCount; i++) {
                payable(proposal.yesVotes[i]).transfer(proposal.reward);
            }
        } else {
            // Distribute reward to noVotes addresses
            for (uint256 i = 0; i < noVotesCount; i++) {
                payable(proposal.noVotes[i]).transfer(proposal.reward);
            }
        }
        // Mark proposal as paid
        proposal.isPaid = true;
    }


    function getRequestStatus(
        uint256 _requestId
    )
        external
        view
        returns (uint256 paid, bool fulfilled, uint256[] memory randomWords)
    {
        require(s_requests[_requestId].paid > 0, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.paid, request.fulfilled, request.randomWords);
    }

    receive() external payable {

    }
    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(linkAddress);
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
}
