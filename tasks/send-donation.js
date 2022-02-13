task("sendDonation", "Transfer donation to any address")
  .addParam("recipient", "The address that receive donation")
  .addParam("amount", "Value of donation")
  .setAction(async (taskArgs) => {
    const { recipient, amount } = taskArgs;
    const Donation = await ethers.getContractFactory("Donation");
    const hardhatDonation = await Donation.deploy();

    await hardhatDonation.sendDonation(recipient, amount);
  });