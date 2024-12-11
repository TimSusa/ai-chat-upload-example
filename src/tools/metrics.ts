import { createChannel } from "better-sse";
import osu, { type NetStatMetrics } from "node-os-utils";

const metrics = createChannel();

const interval = 60000;

const broadcastSystemStats = async () => {
  const cpuUsage = await osu.cpu.usage(interval);

  const { totalMemMb, freeMemMb } = await osu.mem.info();
  const memoryUsage = (freeMemMb / totalMemMb) * 100;

  metrics.broadcast(
    {
      cpuUsage,
      memoryUsage,
    },
    "system-stats"
  );

  setTimeout(broadcastSystemStats, interval);
};

broadcastSystemStats();

const broadcastNetStats = async () => {
  const netStats = await osu.netstat.inOut(1000);
  // const {
  //   total: { inputMb, outputMb },
  // } = netStats;

  metrics.broadcast(
    {
      netStats,
    },
    "net-stats"
  );

  setTimeout(broadcastNetStats, interval);
};

broadcastNetStats();

export { metrics };
