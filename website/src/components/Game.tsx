import { account, userInventory } from "../store/imxStore";

import SignInButtons from "./SignInButtons";
import { useStore } from "@nanostores/preact";
import GameBoard from "./GameBoard";
import Inventory from "./Inventory";
import Footer from "./Footer";
import Marketplace from "./Marketplace";

declare global {
  interface Window {
    immutable: any;
    gameInfo: any;
    ethereum: any;

    // p5.js
    createCanvas: any;
    loadImage: any;
    p5Data: any;
    width: any;
    height: any;
    fill: any;
    rect: any;
    dist: any;
    random: any;
    image: any;
    test: any;
    textWidth: any;
    textFont: any;
    textSize: any;
    text: any;
    push: any;
    pop: any;
    noStroke: any;
    ellipse: any;
    background: any;
    keyCode: any;
    RIGHT_ARROW: any;
    LEFT_ARROW: any;
    DOWN_ARROW: any;
    UP_ARROW: any;
  }
}

const Game = () => {
  const $account = useStore(account);
  setTimeout(() => {
    if (window.gameInfo) {
      userInventory.set(window.gameInfo.inventory);
    }
  }, 0);

  // const t:any = passport;
  return (
    <>
      <div class="min-h-screen flex flex-col justify-top">
        <div
          class={`stackup-header inline-block mx-auto p-8 relative text-center${$account ? " has-account" : ""
            }`}
        >
          <h1 class="bol">Web3 Invaders</h1>
          <div class="mt-6">
            {!$account ? (
              <>
                <SignInButtons />
              </>
            ) : (
              <>
                <div
                  class="btn"
                  onClick={async () => {
                    account.set("");
                  }}
                >
                  <div>Logout</div>
                </div>
                <GameBoard />
              </>
            )}
          </div>
        </div>
        <div
          onClick={() => {
            const target = document.querySelector(".inventory-container");
            target?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          class={`stackup-arrow-down ${!$account ? "opacity-0" : "opacity-1"}`}
        >
          <i class="fa-solid fa-circle-arrow-down"></i>
        </div>
      </div>
      {$account ? (
        <>
          <div class="min-h-screen inventory-container flex flex-col">
            <Inventory />
            <Marketplace />
            <Footer />
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default Game;
2063318879993824653
