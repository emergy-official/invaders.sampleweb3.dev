import { GameProjectileInventory, GameSpaceshipInventory } from "./GameItem";
import { useStore } from "@nanostores/preact";
import { userInventory } from "../store/imxStore";
import { userBalance } from "../store/imxStore";

const Inventory = () => {
  const $userInventory = useStore(userInventory);
  const $userBalance = useStore(userBalance);
  return (
    <div class={"customize container flex-grow"}>
      <h2>
        Inventory <span>(Click on an item to buy or use it)</span>
      </h2>
      <h3>Balance: {parseFloat($userBalance || 0).toFixed(4)}</h3>
      <h4 class={"balance-addr"}>{window?.gameInfo?.userInfo?.walletAddress}</h4>
      <br />
      <br />

      <h3>Spaceships</h3>
      <div class="game-item-container inventory  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {$userInventory.spaceships.map((s: any, i: any) => {
          return (
            <GameSpaceshipInventory
              key={i}
              s={s}
              index={i}
              userBalance={userBalance}
              inventory={$userInventory}
              setInventory={userInventory.set}
            />
          );
        })}
      </div>
      <h3>Projectiles</h3>
      <div class="game-item-container inventory grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {$userInventory.projectiles.map((p: any, i: any) => {
          return (
            <GameProjectileInventory
              key={i}
              p={p}
              index={i}
              userBalance={userBalance}
              inventory={$userInventory}
              setInventory={userInventory.set}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Inventory;
