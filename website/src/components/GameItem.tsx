import { useStore } from "@nanostores/preact";
import { marketPlaceItems, userInventory } from "./../store/imxStore";
import { useState, useRef, useEffect } from "preact/hooks";
import { claimNFT, buyNFT, claimNFTAfterBuy, getBalance } from "./helpers";
import Game from "./GameLogic/Game";
import { listNFTForSale, unlistItem, updateInvAndMarketplace } from "./web3";

const setUserInv = (setInventory: any, newInventory: any) => {
  window.gameInfo.inventory = newInventory;
  setInventory(newInventory);
  localStorage.setItem(
    `inventory-${window.gameInfo.userInfo.walletAddress}`,
    JSON.stringify(newInventory)
  );
};

const wait = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
};

export const GameSpaceshipInventory = ({
  s,
  index,
  inventory,
  setInventory,
  userBalance,
}: any) => {
  const [item, setItem] = useState(s)
  const [loading, setLoading] = useState(false);
  const [sellMode, setSellMode] = useState(false);
  const numberInput: any = useRef(null);

  useEffect(() => {
    setItem(s)
  }, [s])

  const sell = async (e: any) => {
    e.preventDefault()
    e.stopPropagation();
    setSellMode(true);

  }
  const unlist = async (e: any) => {
    e.preventDefault()
    e.stopPropagation();
    console.log(item)
    setLoading(true);

    await unlistItem(item.marketplaceItemId)
    setItem({ ...item, listedForSale: false })
    await updateInvAndMarketplace(marketPlaceItems, userInventory, userBalance)
    setLoading(false);

  }

  const listItem = async (e: any) => {
    if (!numberInput.current.value) {
      return window.alert("Please provide a price before listing the item")
    }
    setLoading(true);

    await listNFTForSale(item, numberInput.current.value);
    setSellMode(false);
    // setItem({ ...item, listedForSale: true })
    await updateInvAndMarketplace(marketPlaceItems, userInventory, userBalance)
    setLoading(false);

  }

  const handleClick = async () => {
    if (item.isNFT && !item.owned) {
      if (!item.price) {
        setLoading(true);
        // await wait();
        await claimNFT(item.claimName);
        setItem({ ...item, owned: true })
      } else {
        setLoading(true);

        const nft = await buyNFT(item.claimName, item.price);
        // await wait();
        if (nft) {
          setItem({ ...item, owned: true })
          await updateInvAndMarketplace(marketPlaceItems, userInventory, userBalance)

        }
      }
    }

    if (item.owned) {
      const newInventory = {
        ...inventory,
        spaceships: inventory.spaceships.map((spaceship: any, i: any) => {
          return {
            ...spaceship,
            selected: i === index ? true : false,
          };
        }),
      };
      console.log("Updating inventory");

      const balance = await getBalance();
      console.log("USER B", balance);
      userBalance.set(balance);

      setUserInv(setInventory, newInventory);
      window.gameInfo.game = new Game();
    }

    setLoading(false);
    console.log("Loading set to false");
  };

  return (
    <div
      onClick={!loading ? handleClick : () => { }}
      class={`game-item flex rounded-lg shadow-lg p-3${item.selected ? " selected" : ""
        }${loading ? " loading" : ""}`}
    >
      <div class="flex-shrink-0">
        <img src={item.image} alt={item.name} class="w-14 h-14" />
      </div>
      <div class="ml-4 game-item-detail">
        <h3 class="font-semibold text-lg">{item.name}</h3>
        {loading ? (
          <p class="mt-2 loading-txt">Loading...</p>
        ) : (
          <p class="mt-2">Lives: {item.lives}</p>
        )}
        <p>Speed: {item.speed}</p>
        {!item.owned ? (
          <p class="price">Price: {item.reward ? "FREE" : `${item.price}`}</p>
        ) : (
          ""
        )}

        {item.owned && item.isNFT && sellMode ? <div class="nft-sell-mode">
          <input type="number" ref={numberInput} placeholder={`${item.price}`} step="0.001" />
          <div>
            <button onClick={listItem} class="list-btn">List</button>
            <button onClick={() => { setSellMode(false) }} class="cancel-btn">Cancel</button>
          </div>
        </div> : ""}

        {!sellMode ?
          <p class={item.isNFT ? "is-nft" : "isnt-nft"}>
            {item.isNFT ? <>
              <span>NFT</span>
              {item.owned && !item.listedForSale ? <button onClick={sell} class="sell-btn">Sell</button> : ""}
              {item.owned && item.listedForSale ? <button onClick={unlist} class="cancel-btn">Unlist</button> : ""}

            </> : "NOT A NFT"}
          </p>
          : ""}

      </div>
    </div>
  );
};
export const GameProjectileInventory = ({
  p,
  index,
  inventory,
  userBalance,
  setInventory,
}: any) => {
  const [item, setItem] = useState(p)
  const [loading, setLoading] = useState(false);
  const [sellMode, setSellMode] = useState(false);
  const numberInput: any = useRef(null);

  useEffect(() => {
    setItem(p)
  }, [p])

  const sell = async (e: any) => {
    e.preventDefault()
    e.stopPropagation();
    setSellMode(true);

  }
  const unlist = async (e: any) => {
    e.preventDefault()
    e.stopPropagation();
    console.log(item)
    await unlistItem(item.marketplaceItemId)
    setItem({ ...item, listedForSale: false })
    await updateInvAndMarketplace(marketPlaceItems, userInventory, userBalance)

  }

  const listItem = async (e: any) => {
    if (!numberInput.current.value) {
      return window.alert("Please provide a price before listing the item")
    }
    await listNFTForSale(item, numberInput.current.value);
    setSellMode(false);
    await updateInvAndMarketplace(marketPlaceItems, userInventory, userBalance)

    // setItem({ ...item, listedForSale: true })
  }

  const handleClick = async () => {
    if (item.isNFT && !item.owned) {
      if (!item.price) {
        setLoading(true);
        // await wait();
        await claimNFT(item.claimName);
        setItem({ ...item, owned: true })
      } else {
        setLoading(true);

        const nft = await buyNFT(item.claimName, item.price);
        // await wait();
        if (nft) {
          setItem({ ...item, owned: true })
          await updateInvAndMarketplace(marketPlaceItems, userInventory, userBalance)

        }
      }
    }

    if (item.owned) {
      const newInventory = {
        ...inventory,
        projectiles: inventory.projectiles.map((projectile: any, i: any) => {
          return {
            ...projectile,
            selected: i === index ? true : false,
          };
        }),
      };
      console.log("Updating inventory");

      const balance = await getBalance();
      console.log("USER B", balance);
      userBalance.set(balance);

      setUserInv(setInventory, newInventory);
      window.gameInfo.game = new Game();
    }

    setLoading(false);
    console.log("Loading set to false");
  };

  return (
    <div
      onClick={!loading ? handleClick : () => { }}
      class={`game-item flex rounded-lg shadow-lg p-3${item.selected ? " selected" : ""
        }${loading ? " loading" : ""}`}
    >
      <div class="flex-shrink-0">
        <img src={item.image} alt={item.name} class="w-14 h-14" />
      </div>
      <div class="ml-4 game-item-detail">
        <h3 class="font-semibold text-lg">{item.name}</h3>
        {loading ? (
          <p class="mt-2 loading-txt">Loading...</p>
        ) : (
          <p class="mt-2">Lives: {item.lives}</p>
        )}
        <p>Projectile: {p.number}</p>
        <p>Speed: {p.speed}</p>
        {!item.owned ? (
          <p class="price">Price: {item.reward ? "FREE" : `${item.price}`}</p>
        ) : (
          ""
        )}

        {item.owned && item.isNFT && sellMode ? <div class="nft-sell-mode">
          <input type="number" ref={numberInput} placeholder={`${item.price}`} step="0.001" />
          <div>
            <button onClick={listItem} class="list-btn">List</button>
            <button onClick={() => { setSellMode(false) }} class="cancel-btn">Cancel</button>
          </div>
        </div> : ""}

        {!sellMode ?
          <p class={item.isNFT ? "is-nft" : "isnt-nft"}>
            {item.isNFT ? <>
              <span>NFT</span>
              {item.owned && !item.listedForSale ? <button onClick={sell} class="sell-btn">Sell</button> : ""}
              {item.owned && item.listedForSale ? <button onClick={unlist} class="cancel-btn">Unlist</button> : ""}

            </> : "NOT A NFT"}
          </p>
          : ""}

      </div>
    </div>
  );
};
