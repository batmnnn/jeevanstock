// Faucet needs a browser wallet (friction F1), so fund only PAYER by hand, then fan out from it.
// Usage: npm run fund            (tops admin + each centre up to TARGET)
import { createPublicClient, createWalletClient, formatEther, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { tiramisu } from "@arkiv-network/sdk/chains";
import { CENTRES } from "../src/lib/centres";
import { arkivTransport } from "../src/lib/rpc";
import { loadKeys } from "./env";

const TARGET = parseEther(process.env.FUND_TARGET ?? "0.02");
const keys = loadKeys();
const pub = createPublicClient({ chain: tiramisu, transport: arkivTransport() });
const payer = createWalletClient({ account: privateKeyToAccount(keys.payer), chain: tiramisu, transport: arkivTransport() });

const targets = [
  { label: "admin", address: privateKeyToAccount(keys.admin).address },
  ...CENTRES.map((c, i) => ({ label: c.centreId, address: privateKeyToAccount(keys.centreKeys[i]).address })),
];

const payerBal = await pub.getBalance({ address: payer.account.address });
console.log(`payer ${payer.account.address} balance ${formatEther(payerBal)} GLM`);
const needs = await Promise.all(targets.map(async (t) => ({ ...t, bal: await pub.getBalance({ address: t.address }) })));
const total = needs.reduce((s, t) => s + (t.bal < TARGET ? TARGET - t.bal : 0n), 0n);
if (total === 0n) {
  console.log("everyone already funded");
  process.exit(0);
}
if (total >= payerBal) {
  console.error(`payer needs > ${formatEther(total)} GLM to top everyone up to ${formatEther(TARGET)}; fund it at https://hub.arkiv.network/faucet or lower FUND_TARGET`);
  process.exit(1);
}
for (const t of needs) {
  if (t.bal >= TARGET) {
    console.log(`  ${t.label.padEnd(16)} ok (${formatEther(t.bal)})`);
    continue;
  }
  const hash = await payer.sendTransaction({ to: t.address, value: TARGET - t.bal });
  await pub.waitForTransactionReceipt({ hash });
  console.log(`  ${t.label.padEnd(16)} +${formatEther(TARGET - t.bal)} GLM  tx ${hash}`);
}
