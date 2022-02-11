async function main() {
  const Donation = await ethers.getContractFactory("Donation");
  const donationContract = await Donation.deploy();

  await donationContract.deployed();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });