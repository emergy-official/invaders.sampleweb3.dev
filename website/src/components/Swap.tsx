import { useEffect, useState } from "preact/hooks";
import { checkout } from "@imtbl/sdk";

// create Checkout SDK
const checkoutSDK = new checkout.Checkout();

const Swap = () => {
  // Initialise widgets, create wallet widget and mount
  const [swap, setSwap] =
    useState<checkout.Widget<typeof checkout.WidgetType.SWAP>>();

  // Initialise widgets, create swap widget
  useEffect(() => {
    (async () => {
      const widgets = await checkoutSDK.widgets({
        config: { theme: checkout.WidgetTheme.DARK },
      });
      const swap = widgets.create(checkout.WidgetType.SWAP, {
        config: { theme: checkout.WidgetTheme.DARK },
      });
      setSwap(swap);
    })();
  }, []);

  // mount swap widget and add event listeners
  useEffect(() => {
    if (!swap) return;

    swap.mount("swap");

    swap.addListener(
      checkout.SwapEventType.SUCCESS,
      (data: checkout.SwapSuccess) => {
        console.log("success", data);
      }
    );
    swap.addListener(
      checkout.SwapEventType.FAILURE,
      (data: checkout.SwapFailed) => {
        console.log("failure", data);
      }
    );
    swap.addListener(
      checkout.SwapEventType.REJECTED,
      (data: checkout.SwapRejected) => {
        console.log("rejected", data);
      }
    );
    swap.addListener(checkout.SwapEventType.CLOSE_WIDGET, () => {
      swap.unmount();
    });
  }, [swap]);

  return <div id="swap" />;
};

export default Swap;
