import axios from "axios";
const chainName = "imtbl-zkevm-testnet";

export const getNFTFromUsers = async (accountAddress, isLocal) => {
  const contractAddress = isLocal
    ? process.env.CONTRACT_ADDRESS_LOCAL
    : process.env.CONTRACT_ADDRESS;
  const apiURL = `https://api.sandbox.immutable.com/v1/chains/${chainName}/accounts/${accountAddress}/nfts?contract_address=${contractAddress}`;
  const res = await axios.get(
    apiURL,
    {},
    {
      headers: {
        "x-immutable-api-key": isLocal
          ? process.env.IMMUTABLE_API_KEY_LOCAL
          : process.env.IMMUTABLE_API_KEY,
      },
    }
  );
  return res?.data?.result || [];
};
export const userAlreadyHasNFT = async (accountAddress, nftName, isLocal) => {
  const nftsFromUser = await getNFTFromUsers(accountAddress, isLocal);
  for (let nft of nftsFromUser) {
    if (nftName === "laserx3" && nft?.name?.toLowerCase() === "laser (x3)")
      return true;
    if (nftName === "drsx5" && nft?.name?.toLowerCase() === "drs (x5)")
      return true;
    if (nftName === nft?.name?.toLowerCase()) {
      return true;
    }
  }
  return false;
};
export const mintNftToAddress = async (
  destinationAddress,
  tokenID,
  contract
) => {
  const res = await contract.mint(destinationAddress, tokenID);
  console.log("RES", res);
};

export const refreshNFTMetadata = async (tokenId, nft, isLocal, retry = 0) => {
  try {
    const contractAddress = isLocal
      ? process.env.CONTRACT_ADDRESS_LOCAL
      : process.env.CONTRACT_ADDRESS;

    const chainName = "imtbl-zkevm-testnet";
    const apiUrl = `https://api.sandbox.immutable.com/v1/chains/${chainName}/collections/${contractAddress}/nfts/refresh-metadata`;
    console.log("Refreshing metadata");
    const res = await axios.post(
      apiUrl,
      {
        nft_metadata: [
          {
            ...nft,
            external_url: `${process.env.WEBSITE_URL}/${
              isLocal ? "nfts-local" : "nfts"
            }/${tokenId}`,
            animation_url: `${process.env.WEBSITE_URL}/${
              isLocal ? "nfts-local" : "nfts"
            }/${tokenId}`,
            youtube_url: `${process.env.WEBSITE_URL}/${
              isLocal ? "nfts-local" : "nfts"
            }/${tokenId}`,
            token_id: `${tokenId}`,
            id: `${tokenId}`,
          },
        ],
      },
      {
        headers: {
          "x-immutable-api-key": isLocal
          ? process.env.IMMUTABLE_API_KEY_LOCAL
          : process.env.IMMUTABLE_API_KEY,
        },
      }
    );
    console.log("RES", res.data);
  } catch (e) {
    if (retry < 5) {
      console.log(`Retry ${retry}...`);
      await wait(1500);
      return await refreshNFTMetadata(tokenId, nft, isLocal, retry + 1);
    }
    throw e;
  }
};

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
