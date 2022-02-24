import { Contract } from "ethers";
import { task } from "hardhat/config";

import { getContractAddress } from "../utils/get-contract-address";

task("getAllDonors", "Get all donors").setAction(async (_, { ethers }) => {
  const parsedAddress = getContractAddress();

  if (parsedAddress) {
    const hardhatDonation: Contract = await ethers.getContractAt("Donation", parsedAddress.address);

    await hardhatDonation.getAllDonors();
  }
});
