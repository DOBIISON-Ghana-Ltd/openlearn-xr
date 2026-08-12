import { JSend } from "@/lib/utils/jsend";
import ZSim from "@/data/api/sim/sim.schema";

export async function handleGetLocalScore() {
  const resData = { score: 0, moduleId: undefined };
  return JSend.success(ZSim.SimGeneralGetScore.shape.res.parse(resData));
}
