import { Contract } from "ethers";
import { task } from "hardhat/config";

import { TaskArguments } from "hardhat/types";
import { getContractAddress } from "../utils/get-contract-address";

task("getAllDonationsOfCurrentDonor", "Get all donations of current donor")
  .addParam("donor", "The address of current donor")
  .setAction(async (taskArgs: TaskArguments, { ethers }) => {
    const { donor } = taskArgs;
    const parsedAddress = getContractAddress();

    if (parsedAddress) {
      const hardhatDonation: Contract = await ethers.getContractAt("Donation", parsedAddress.address);

      await hardhatDonation.getAllDonationsOfCurrentDonor(donor);
    }
  });
