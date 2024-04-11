import { useState } from "preact/hooks";

import { account, userInventory, userBalance, marketPlaceItems } from "../store/imxStore";
import {
  setMetamask,
  updateInvAndMarketplace, listenToEvents
} from "./web3";

const SignInButton = ({ icon, text }: any) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div class={`btn-container${isLoading ? " btn-imx-loading" : ""}`}>
      <div
        class={`btn`}
        onClick={async () => {
          setIsLoading(true);

          const accs = await setMetamask()

          if (accs?.length) {
            account.set(accs[0]);
            updateInvAndMarketplace(marketPlaceItems, userInventory, userBalance)
            listenToEvents(marketPlaceItems, userInventory, userBalance)
          }
          setIsLoading(false);
        }}
      >
        <div class="btn-icon">
          <div class="icon-32x32 w-embed">
            {icon}
          </div>
          <div class="btn-text">{text}</div>
        </div>
      </div>
    </div>
  );
};

export default SignInButton;
