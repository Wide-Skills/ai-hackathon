export async function startWorkers() {
  const { screeningWorker } = await import("./screening.worker");
  const { batchScreeningWorker } = await import("./screening-batch.worker");

  return {
    screeningWorker,
    batchScreeningWorker,
  };
}
