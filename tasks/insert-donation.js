task("insertDonation", "Insert any value donation")
  .setAction(async () => {
    const Donation = await ethers.getContractFactory("Donation");
    const hardhatDonation = await Donation.deploy();

    const tx = await hardhatDonation.insertDonation();
    await tx.wait();
  });