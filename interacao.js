import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import DAOToken from './artifacts/contracts/Token.sol/DAOToken.json';
import Governance from './artifacts/contracts/Governance.sol/Governance.json';

const tokenAddress = "ADDRESS_OF_DEPLOYED_DAOTOKEN";
const governanceAddress = "ADDRESS_OF_DEPLOYED_GOVERNANCE";

function App() {
    const [proposals, setProposals] = useState([]);
    const [description, setDescription] = useState('');
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [governanceContract, setGovernanceContract] = useState(null);

    useEffect(() => {
        const init = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);
            const signer = provider.getSigner();
            setSigner(signer);
            const governanceContract = new ethers.Contract(governanceAddress, Governance.abi, signer);
            setGovernanceContract(governanceContract);
            const proposalCount = await governanceContract.proposals.length;
            const proposals = [];
            for (let i = 0; i < proposalCount; i++) {
                const proposal = await governanceContract.proposals(i);
                proposals.push(proposal);
            }
            setProposals(proposals);
        };
        init();
    }, []);

    const createProposal = async () => {
        await governanceContract.createProposal(description);
    };

    const vote = async (proposalId) => {
        await governanceContract.vote(proposalId);
    };

    const executeProposal = async (proposalId) => {
        await governanceContract.executeProposal(proposalId);
    };

    return (
        <div>
            <h1>DAO Governance</h1>
            <div>
                <h2>Create Proposal</h2>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button onClick={createProposal}>Create</button>
            </div>
            <div>
                <h2>Proposals</h2>
                <ul>
                    {proposals.map((proposal, index) => (
                        <li key={index}>
                            <p>{proposal.description}</p>
                            <button onClick={() => vote(index)}>Vote</button>
                            <button onClick={() => executeProposal(index)}>Execute</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
