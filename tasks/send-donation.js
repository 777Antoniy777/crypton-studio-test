const fs = require("fs");

task("sendDonation", "Transfer donation to any address")
  .addParam("recipient", "The address that receive donation")
  .addParam("amount", "Value of donation")
  .setAction(async (taskArgs) => {
    const { recipient, amount } = taskArgs;
    const addressFile = __dirname + "/../contracts/contract-address.json";

    if (!fs.existsSync(addressFile)) {
      console.error("You need to deploy your contract first");

      return;
    }

    const addressJson = fs.readFileSync(addressFile);
    const parsedAddress = JSON.parse(addressJson);
    const hardhatDonation = await ethers.getContractAt("Donation", parsedAddress.address);

    const sender = await ethers.getSigner();

    const tx1 = await hardhatDonation.sendDonation(
      recipient,
      ethers.utils.parseEther(amount),
    );
    await tx1.wait();

    const tx2 = await sender.sendTransaction({
      to: recipient,
      value: ethers.utils.parseEther(amount),
    });
    await tx2.wait();
  });