task("insertDonation", "Insert any value donation")
  .setAction(async () => {
    const Donation = await ethers.getContractFactory("Donation");
    const hardhatDonation = await Donation.deploy();

    const tx = await hardhatDonation.insertDonation();
    await tx.wait();

    console.log(await hardhatDonation.owner())
  });

task("sendDonation", "Transfer donation to any address")
  .addParam("recipient", "The address that receive donation")
  .addParam("amount", "Value of donation")
  .setAction(async (taskArgs) => {
    const { recipient, amount } = taskArgs;
    const Donation = await ethers.getContractFactory("Donation");
    const hardhatDonation = await Donation.deploy();

    const tx = await hardhatDonation.sendDonation(recipient, amount);
    await tx.wait();

    console.log(`All donations from ${recipient} is ${tx}`);
  });

task("getAllDonors", "Get all donors")
  .setAction(async () => {
    const Donation = await ethers.getContractFactory("Donation");
    const hardhatDonation = await Donation.deploy();

    const tx = await hardhatDonation.getAllDonors();
    await tx.wait();

    const setOfDonors = new Set(tx);

    setOfDonors.forEach((elem, i) => console.log(`Donor #${i + 1} is ${elem}`));
  });

task("getAllDonationsOfCurrentDonor", "Get all donations of current donor")
  .addParam("donor", "The address of current donor")
  .setAction(async (taskArgs) => {
    const { donor } = taskArgs;
    const Donation = await ethers.getContractFactory("Donation");
    const hardhatDonation = await Donation.deploy();

    const value = await hardhatDonation.getAllDonationsOfCurrentDonor(donor);
    // await tx.wait();

    console.log(`All donations from ${donor} is ${value}`);
  });