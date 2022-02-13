const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Donation contract", () => {
  let Donation;
  let hardhatDonation;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async () => {
    Donation = await ethers.getContractFactory("Donation");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    hardhatDonation = await Donation.deploy();
    await hardhatDonation.deployed();
  });

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await hardhatDonation.owner()).to.equal(owner.address);
    });
  });

  const insertDonationFromAnotherAddress = async (addr = addr1, receivedValue = 10) => {
    await hardhatDonation.connect(addr).insertDonation({ value: receivedValue });

    return receivedValue;
  };

  describe("insertDonation", () => {
    it("Should insert donation at owner address from any address", async () => {
      const value = await insertDonationFromAnotherAddress();

      const ownerBalance = await hardhatDonation.balanceOf(owner.address);
      expect(ownerBalance).to.equal(value);
    });

    it("Should insert donation at allDonation map for current address", async () => {
      const value = await insertDonationFromAnotherAddress();

      const donationFromAnotherAddress = await hardhatDonation.allDonations(addr1.address);
      expect(donationFromAnotherAddress).to.equal(value);
    });

    it("Should insert donor address at donors array", async () => {
      await insertDonationFromAnotherAddress();

      const currentAddress = await hardhatDonation.donors([0]);
      expect(currentAddress).to.equal(addr1.address);
    });

    it("Should reject donation if sender is owner", async () => {
      const value = 10;
      await expect(
        hardhatDonation.insertDonation({ value })
      ).to.be.revertedWith("You are owner");

      const ownerBalance = await hardhatDonation.balanceOf(owner.address);
      expect(ownerBalance).to.equal(0);
    });
  });

  describe("sendDonation", () => {
    const checkOwnerBalance = async (receivedValue) => {
      const ownerBalance = await hardhatDonation.balanceOf(owner.address);
      expect(ownerBalance).to.equal(receivedValue);
    };

    it("Should owner to send donation to any another address", async () => {
      // insert donation from addr1
      const receivedValue = await insertDonationFromAnotherAddress();
      await checkOwnerBalance(receivedValue);

      // send donation from owner
      const sentValue = 5;
      await hardhatDonation.sendDonation(addr2.address, sentValue);

      // check balances
      const ownerBalance = await hardhatDonation.balanceOf(owner.address);
      const balanceWithSentDonation = await hardhatDonation.balanceOf(addr2.address);
      expect(ownerBalance).to.equal(receivedValue - sentValue);
      expect(balanceWithSentDonation).to.equal(sentValue);
    });

    it("Should reject sending donation if sender is not owner", async () => {
      // insert donation from addr1
      const receivedValue = await insertDonationFromAnotherAddress();
      await checkOwnerBalance(receivedValue);

      // send donation from another address
      const sentValue = 5;
      await expect(
        hardhatDonation.connect(addr1).sendDonation(addr2.address, sentValue)
      ).to.be.revertedWith("You are not owner");

      // check balances
      const ownerBalance = await hardhatDonation.balanceOf(owner.address);
      const balanceWithSentDonation = await hardhatDonation.balanceOf(addr2.address);
      expect(ownerBalance).to.equal(receivedValue);
      expect(balanceWithSentDonation).to.equal(0);
    });

    it("Should reject sending if balance less than needle", async () => {
      // insert donation from addr1
      const receivedValue = await insertDonationFromAnotherAddress();
      await checkOwnerBalance(receivedValue);

      // send donation from another address
      const sentValue = 15;
      await expect(
        hardhatDonation.sendDonation(addr2.address, sentValue)
      ).to.be.revertedWith("Not enough tokens");

      // check balances
      const ownerBalance = await hardhatDonation.balanceOf(owner.address);
      const balanceWithSentDonation = await hardhatDonation.balanceOf(addr2.address);
      expect(ownerBalance).to.equal(receivedValue);
      expect(balanceWithSentDonation).to.equal(0);
    });

    it("Should reject sending if sending donation itself", async () => {
      // insert donation from addr1
      const receivedValue = await insertDonationFromAnotherAddress();
      await checkOwnerBalance(receivedValue);

      // send donation itself
      const sentValue = 8;
      await expect(
        hardhatDonation.sendDonation(owner.address, sentValue)
      ).to.be.revertedWith("You can't send money to yourself!");

      // check balances
      const ownerBalance = await hardhatDonation.balanceOf(owner.address);
      expect(ownerBalance).to.equal(receivedValue);
    });
  });

  describe("getAllDonors", () => {
    it("Should return all donors that inserted donations", async () => {
      let index = 0;
      addrs.length = 5;

      // add unique address on every iteration
      for (let value of addrs) {
        await insertDonationFromAnotherAddress(value);

        index++;
      }

      // add repeated addresses for testing function
      await insertDonationFromAnotherAddress(addrs[0]);
      await insertDonationFromAnotherAddress(addrs[0]);

      const donors = await hardhatDonation.getAllDonors();
      expect(donors.length).to.equal(addrs.length);
    });

    it("Should not add donor if any exception fired in insertDonation function", async () => {
      await expect(
        insertDonationFromAnotherAddress(owner)
      ).to.be.revertedWith("You are owner");

      const donors = await hardhatDonation.getAllDonors();
      expect(donors.length).to.equal(0);
    });
  });

  describe("getAllDonationsOfCurrentDonor", () => {
    it("Should return all donation for current donor", async () => {
      const allDonationValues = [5, 10, 15];

      for (let value of allDonationValues) {
        await insertDonationFromAnotherAddress(addr1, value);
      }

      const allDonation = await hardhatDonation.getAllDonationsOfCurrentDonor(addr1.address);
      const reducedValues = allDonationValues.reduce((acc, elem) => acc + elem);
      expect(allDonation).to.equal(reducedValues);
    });

    it("Should return 0 if no donors exist", async () => {
      const allDonation = await hardhatDonation.getAllDonationsOfCurrentDonor(addr1.address);
      expect(allDonation).to.equal(0);
    });
  });
});