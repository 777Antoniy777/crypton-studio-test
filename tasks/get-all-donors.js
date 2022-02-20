const fs = require("fs");

task("getAllDonors", "Get all donors")
  .setAction(async () => {
    const addressFile = __dirname + "/../contracts/contract-address.json";

    if (!fs.existsSync(addressFile)) {
      console.error("You need to deploy your contract first");

      return;
    }

    const addressJson = fs.readFileSync(addressFile);
    const parsedAddress = JSON.parse(addressJson);
    const hardhatDonation = await ethers.getContractAt("Donation", parsedAddress.address);

    const tx = await hardhatDonation.getAllDonors();
    console.log({tx})
  });