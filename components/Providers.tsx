import { Notification } from "@strata-foundation/react";
import React from "react";
import toast from "react-hot-toast";
import { Wallet } from "./Wallet";
import { MarketplaceProviders } from "@strata-foundation/marketplace-ui";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

export const Providers: React.FC = ({ children }) => {
  const onError = React.useCallback(
    (error: Error) => {
      console.error(error);
      if (
        error.message?.includes(
          "Attempt to debit an account but found no record of a prior credit."
        )
      ) {
        error = new Error("Not enough SOL to perform this action");
      }

      const code = (error.message?.match("custom program error: (.*)") ||
        [])[1];
      if (code == "0x1") {
        error = new Error("Insufficient balance.");
      } else if (code === "0x0") {
        error = new Error("Blockhash expired. Please retry");
      }

      toast.custom((t) => (
        <Notification
          type="error"
          show={t.visible}
          heading={error.name}
          // @ts-ignore
          message={error.message || error.msg || error.toString()}
          onDismiss={() => toast.dismiss(t.id)}
        />
      ));
    },
    [toast]
  );

  return (
    <Wallet>
      <MarketplaceProviders onError={onError} resetCSS>
        <WalletModalProvider>{children}</WalletModalProvider>
      </MarketplaceProviders>
    </Wallet>
  );
}
