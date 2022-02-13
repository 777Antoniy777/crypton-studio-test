task("insertDonation", "Insert any value donation")
  .setAction(async () => {
    const Donation = await ethers.getContractFactory("Donation");
    const hardhatDonation = await Donation.deploy();

    await hardhatDonation.insertDonation();
  });