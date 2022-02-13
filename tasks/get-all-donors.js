task("getAllDonors", "Get all donors")
  .setAction(async () => {
    const Donation = await ethers.getContractFactory("Donation");
    const hardhatDonation = await Donation.deploy();

    await hardhatDonation.getAllDonors();
  });