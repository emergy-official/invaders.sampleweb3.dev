import fs from "fs"
// Read the artifact JSON file  
const artifact = JSON.parse(fs.readFileSync("./artifacts/contracts/GameItems.sol/GameItems.json", 'utf8'));

// Extract ABI  
const abi = artifact.abi;

// Filter out and format functions to match your style  
const simpleABI = abi.reduce((acc: any, item: any) => {
    if (item.type === 'function') {
        let funcSignature = `function ${item.name}(`;
        funcSignature += item.inputs.map((input: any) => `${input.internalType} ${input.name}`).join(', ');
        funcSignature += `) ${item.stateMutability !== 'nonpayable' ? item.stateMutability : ''}`;
        funcSignature += item.outputs.length ? ` view returns (${item.outputs.map((output:any) => output.type).join(', ')})` : '';
        acc.push(funcSignature.trim());
    }
    return acc;
}, []);

console.log(simpleABI);  