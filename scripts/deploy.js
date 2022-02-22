async function main() {
  const deployer = await ethers.getSigner();
  console.log("Deploying contracts with the account:", deployer.address);

  const Donation = await ethers.getContractFactory("Donation");
  const donationContract = await Donation.deploy();

  await donationContract.deployed();
  console.log("Contract address:", donationContract.address);

  saveContractAddress(donationContract);
}

function saveContractAddress(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../contracts";

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ address: contract.address }, undefined, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });