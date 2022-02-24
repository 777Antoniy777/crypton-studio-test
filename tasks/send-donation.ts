import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { task } from "hardhat/config";

import { TaskArguments } from "hardhat/types";
import { getContractAddress } from "../utils/get-contract-address";

task("sendDonation", "Transfer donation to any address")
  .addParam("recipient", "The address that receive donation")
  .addParam("amount", "Value of donation")
  .setAction(async (taskArgs: TaskArguments, { ethers }) => {
    const { recipient, amount } = taskArgs;
    const parsedAddress = getContractAddress();

    if (parsedAddress) {
      const hardhatDonation: Contract = await ethers.getContractAt("Donation", parsedAddress.address);

      const [sender]: SignerWithAddress[] = await ethers.getSigners();

      const tx1 = await hardhatDonation.sendDonation(recipient, ethers.utils.parseEther(amount));
      await tx1.wait();

      const tx2 = await sender.sendTransaction({
        to: recipient,
        value: ethers.utils.parseEther(amount),
      });
      await tx2.wait();
    }
  });
