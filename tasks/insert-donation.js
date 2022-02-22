const fs = require("fs");

task("insertDonation", "Insert any value donation")
  .addParam("amount", "Value of donation")
  .setAction(async (taskArgs) => {
    const { amount } = taskArgs;
    const addressFile = __dirname + "/../contracts/contract-address.json";

    if (!fs.existsSync(addressFile)) {
      console.error("You need to deploy your contract first");

      return;
    }

    const addressJson = fs.readFileSync(addressFile);
    const parsedAddress = JSON.parse(addressJson);
    const hardhatDonation = await ethers.getContractAt("Donation", parsedAddress.address);

    await hardhatDonation.insertDonation({
      value: ethers.utils.parseEther(amount),
    });
  });