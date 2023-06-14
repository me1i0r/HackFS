import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("DaomocracyContract", {
    from: deployer,
    log: true,
  });
};

export default deployContracts;

deployContracts.tags = ["DaomocracyContract"];
