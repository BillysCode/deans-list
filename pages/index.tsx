import { VStack, Box, Center, Container, Heading, Text, Button } from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import {
  BountyCard,
  useBounties,
  BountyList,
} from "@strata-foundation/marketplace-ui";
import { Swap } from "@strata-foundation/react";
import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { Toaster } from 'react-hot-toast';

const DEAN_BONDING = new PublicKey("9ERkrMD8gq8PQBABazpziNytJKrxVgyoxd5uEzAqsTc6");
const DEAN_MINT = new PublicKey("6LyW1iUpfTPiMxSLMpKCxeAqXDz7nuWCfCNnEaSmibZ1");

const Home: NextPage = () => {
  const { connection } = useConnection();
    const {
      result: bounties,
    } = useBounties({
      baseMint: DEAN_MINT,
      search: "",
      sortType: "CONTRIBUTION",
      sortDirection: "DESC",
      limit: 20,
    });

  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <div>
      <Head>
        <title>Dean$apos;s List</title>
        <meta
          name="description"
          content="Vote on projects for Dean's list feedback"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container pt={8} maxW="container.lg">
          <VStack spacing={8} w="full" align="left">
            <VStack spacing={4} w="full" align="left">
              <Heading>Dean&apos;s List</Heading>
              <Text>
                Use $DEAN to vote on projects to get feedback. You can purchase
                some $DEAN below. At the end of the cycle, the project with the
                most $DEAN will be reviewed. Reviews will happen in the Grape Discord.
              </Text>
              <Center>
                <Box
                  w="500px"
                  rounded="lg"
                  border="1px solid"
                  borderColor="gray.200"
                  p={4}
                >
                  {connected && connection && typeof window != "undefined" && (
                    <Swap tokenBondingKey={DEAN_BONDING} />
                  )}
                  {!connected && (
                    <Center>
                      <Button
                        colorScheme="primary"
                        onClick={() => setVisible(true)}
                      >
                        Connect Wallet
                      </Button>
                    </Center>
                  )}
                </Box>
              </Center>
            </VStack>

            <VStack spacing={4} w="full" align="left">
              <Heading>Auctions</Heading>
              <BountyList>
                {bounties &&
                  bounties.map((bounty) => (
                    <BountyCard
                      onClick={() =>
                        window.open(
                          `https://app.strataprotocol.com/bounties/${bounty.targetMint.toBase58()}`,
                          "_blank"
                        )
                      }
                      key={bounty.tokenBondingKey.toBase58()}
                      mintKey={bounty.targetMint}
                    />
                  ))}
              </BountyList>
            </VStack>
          </VStack>
        </Container>

        <Toaster
          position="bottom-center"
          containerStyle={{
            margin: "auto",
            width: "420px",
          }}
        />
      </main>
    </div>
  );
};

export default Home;
