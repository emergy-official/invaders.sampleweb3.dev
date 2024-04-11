import { userInventory, marketPlaceItems } from "../store/imxStore";
import { useState, useRef } from "preact/hooks";
import { updateInvAndMarketplace, shortenAddress, buyMarketplaceNFT } from "./web3";
import { ethers } from "ethers";

export const MarketPlaceItem = ({
  item,
  userBalance,
}: any) => {
  const [loading, setLoading] = useState(false);

  const isSeller = window.gameInfo.userInfo.walletAddress == item.seller
  const buy = async (e: any) => {
    if (isSeller || item.alreadyOwned) return;

    e.preventDefault()
    e.stopPropagation();
    await buyMarketplaceNFT(item)
    await updateInvAndMarketplace(marketPlaceItems, userInventory, userBalance)
  }

  return (
    <div
      class={`game-item flex rounded-lg shadow-lg ${isSeller || item.alreadyOwned ? " cant-buy" : ""} ${loading ? " loading" : ""}`}
      onClick={buy}
    >
      <div class="ml-4 game-item-detail">
        <h3 class="font-semibold text-lg" style={"margin:0px;"}>{loading ? (
          "Loading..."
        ) :
          <>
            {`${item.name} (${ethers.formatEther(item.price)})`}<br />
            {isSeller ? "You" : shortenAddress(item.seller)}
          </>
        }</h3>
      </div>
    </div>
  );
};
