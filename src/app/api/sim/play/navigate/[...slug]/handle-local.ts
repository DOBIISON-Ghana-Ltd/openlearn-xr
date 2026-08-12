import { JSend } from "@/lib/utils/jsend";
import ZSim from "@/data/api/sim/sim.schema";

export async function handleGetLocalNav() {
  const resData = { currentTab: 0, progress: 0 };
  return JSend.success(ZSim.SimGeneralGetNavigate.shape.res.parse(resData));
}

export async function handlePostLocalNav() {
  return JSend.success(ZSim.SimGeneralPostNavigate.shape.res.parse("Navigation updated successfully."));
}
