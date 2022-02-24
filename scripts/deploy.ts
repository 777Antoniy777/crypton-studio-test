import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import fs from "fs";

const saveContractAddress = (contract: Contract): void => {
  const contractsDir = __dirname + "/../contracts";

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ address: contract.address }, undefined, 2)
  );
};

const main = async (): Promise<void> => {
  const [deployer]: SignerWithAddress[] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Donation: ContractFactory = await ethers.getContractFactory("Donation");
  const donationContract: Contract = await Donation.deploy();

  await donationContract.deployed();
  console.log("Contract address:", donationContract.address);

  saveContractAddress(donationContract);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
