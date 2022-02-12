task("getAllDonationsOfCurrentDonor", "Get all donations of current donor")
  .addParam("donor", "The address of current donor")
  .setAction(async (taskArgs) => {
    const { donor } = taskArgs;
    const Donation = await ethers.getContractFactory("Donation");
    const hardhatDonation = await Donation.deploy();

    const tx = await hardhatDonation.getAllDonationsOfCurrentDonor(donor);
    await tx.wait();
  });