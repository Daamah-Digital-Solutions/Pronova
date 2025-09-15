import { expect } from "chai";
import { ethers } from "hardhat";
import { PronovaToken, PronovaPresale, MockUSDT } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("PronovaPresale", function () {
  let pronovaToken: PronovaToken;
  let presale: PronovaPresale;
  let mockUSDT: MockUSDT;
  let owner: SignerWithAddress;
  let buyer: SignerWithAddress;
  let treasury: SignerWithAddress;

  beforeEach(async function () {
    [owner, buyer, treasury] = await ethers.getSigners();

    // Deploy MockUSDT
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    mockUSDT = await MockUSDT.deploy();
    await mockUSDT.waitForDeployment();

    // Deploy PronovaToken
    const PronovaToken = await ethers.getContractFactory("PronovaToken");
    pronovaToken = await PronovaToken.deploy();
    await pronovaToken.waitForDeployment();

    // Deploy PronovaPresale
    const PronovaPresale = await ethers.getContractFactory("PronovaPresale");
    presale = await PronovaPresale.deploy(
      await pronovaToken.getAddress(),
      await mockUSDT.getAddress(),
      treasury.address,
      ethers.ZeroAddress, // Mock ETH price feed
      ethers.ZeroAddress  // Mock BNB price feed
    );
    await presale.waitForDeployment();

    // Set up token allocations
    await pronovaToken.setPresaleContract(await presale.getAddress());
    await pronovaToken.setTeamWallet(owner.address);
    await pronovaToken.setLiquidityWallet(owner.address);
    await pronovaToken.setMarketingWallet(owner.address);
    await pronovaToken.setStakingContract(owner.address);
    await pronovaToken.distributeAllocations();

    // Add buyer to whitelist
    await presale.updateWhitelist([buyer.address], true);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await presale.owner()).to.equal(owner.address);
    });

    it("Should initialize phases correctly", async function () {
      const phase1 = await presale.getPhaseInfo(1);
      expect(phase1.pricePerToken).to.equal(ethers.parseUnits("0.05", 6));
      expect(phase1.isActive).to.be.true;
    });
  });

  describe("ETH Purchase", function () {
    it("Should allow ETH purchase", async function () {
      const ethAmount = ethers.parseEther("1"); // 1 ETH
      
      await expect(
        presale.connect(buyer).buyWithETH(ethers.ZeroAddress, { value: ethAmount })
      ).to.emit(presale, "TokensPurchased");

      const userInfo = await presale.getUserPurchaseInfo(buyer.address);
      expect(userInfo.totalTokens).to.be.gt(0);
    });

    it("Should reject non-whitelisted users", async function () {
      const [, , nonWhitelisted] = await ethers.getSigners();
      const ethAmount = ethers.parseEther("1");

      await expect(
        presale.connect(nonWhitelisted).buyWithETH(ethers.ZeroAddress, { value: ethAmount })
      ).to.be.revertedWith("Not whitelisted");
    });

    it("Should handle referrals correctly", async function () {
      const [, , , referrer] = await ethers.getSigners();
      await presale.updateWhitelist([referrer.address], true);
      
      const ethAmount = ethers.parseEther("1");
      
      await expect(
        presale.connect(buyer).buyWithETH(referrer.address, { value: ethAmount })
      ).to.emit(presale, "ReferralRewardEarned");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to update phases", async function () {
      await presale.updatePhase(2, true);
      
      const phase1 = await presale.getPhaseInfo(1);
      const phase2 = await presale.getPhaseInfo(2);
      
      expect(phase1.isActive).to.be.false;
      expect(phase2.isActive).to.be.true;
    });

    it("Should allow owner to update whitelist", async function () {
      const [, , , newUser] = await ethers.getSigners();
      
      await presale.updateWhitelist([newUser.address], true);
      expect(await presale.whitelist(newUser.address)).to.be.true;
    });
  });
});