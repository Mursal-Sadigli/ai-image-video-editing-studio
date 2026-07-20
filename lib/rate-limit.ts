import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 5 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export async function checkRateLimit(identifier: string) {
  try {
    const { success, limit, reset, remaining } = await ratelimit.limit(identifier);
    return { success, limit, reset, remaining };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    // Əgər Redis xətası olarsa (məsələn, env yüklənməyibsə), müvəqqəti icazə veririk
    return { success: true, limit: 5, reset: 0, remaining: 5 };
  }
}
