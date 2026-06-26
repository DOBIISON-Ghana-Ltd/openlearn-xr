import { AxiosError, AxiosResponse } from "axios";
import { ZApiResponse } from "./schema.base";
import z from "zod";
import logger from "@/lib/utils/logger";

export class ApiError extends Error {
  constructor(
    public override message: string,
    public status: number = 500,
    public code?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Wraps API calls with Zod validation and standardized error handling.
 * @param apiCall - The Axios call function.
 * @param dataSchema - The Zod schema for the expected 'data' property (e.g. ZUser).
 */
async function fetcher<TData>(
  apiCall: () => Promise<AxiosResponse<any>>,
  dataSchema: z.ZodType<TData>
): Promise<TData> {
  // Construct the full envelope validator
  const validator = ZApiResponse(dataSchema);

  try {
    const res = await apiCall();
    // logger.info("API Check", res.data, (({ url, method, data }) => ({ url, method, data }))(res.config));
    const safeRes = validator.parse(res.data);

    if (safeRes.status === 'error') {
      throw new ApiError(safeRes.message, res.status, safeRes.code);
    }

    return safeRes.data;
  } catch (e: any) {
    // logger.error("API Wrapper Error:", e.message);
    if (e instanceof ApiError) throw e;

    if (e instanceof z.ZodError) {
      throw new ApiError("Validation Error: " + e.issues.map(err => err.message).join(", "), 422);
    }

    if (e instanceof AxiosError) {
      const status = e.response?.status || 500;
      const msg = (e.response?.data as any)?.message || e.message;
      const code = (e.response?.data as any)?.code;

      throw new ApiError(msg, status, code);
    }

    throw new ApiError(e.message || "An unexpected error occurred", 500);
  }
}

export default fetcher;