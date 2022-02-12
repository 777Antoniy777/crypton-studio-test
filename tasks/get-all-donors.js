task("getAllDonors", "Get all donors")
  .setAction(async () => {
    const Donation = await ethers.getContractFactory("Donation");
    const hardhatDonation = await Donation.deploy();

    const tx = await hardhatDonation.getAllDonors();
    await tx.wait();
  });