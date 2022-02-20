const fs = require("fs");

task("getAllDonationsOfCurrentDonor", "Get all donations of current donor")
  .addParam("donor", "The address of current donor")
  .setAction(async (taskArgs) => {
    const { donor } = taskArgs;
    const addressFile = __dirname + "/../contracts/contract-address.json";

    if (!fs.existsSync(addressFile)) {
      console.error("You need to deploy your contract first");

      return;
    }

    const addressJson = fs.readFileSync(addressFile);
    const parsedAddress = JSON.parse(addressJson);
    const hardhatDonation = await ethers.getContractAt("Donation", parsedAddress.address);

    const tx = await hardhatDonation.getAllDonationsOfCurrentDonor(donor);
    console.log({tx})
  });