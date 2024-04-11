import { useStore } from "@nanostores/preact";
import { userInventory, marketPlaceItems, userBalance } from "../store/imxStore";
import { MarketPlaceItem } from "./MarketPlaceItem";

const Marketplace = () => {
  const $userInventory = useStore(userInventory);
  const $marketPlaceItems = useStore(marketPlaceItems);
  return (
    <div class={"customize container flex-grow"}>
      <h2>
        Marketplace <span>(Click on an item to buy it)</span>
      </h2>

      <div class="game-item-container inventory  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {$marketPlaceItems.map((s: any, i: any) => {
          return (
            <MarketPlaceItem
              key={i}
              item={s}
              index={i}
              userBalance={userBalance}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Marketplace;
