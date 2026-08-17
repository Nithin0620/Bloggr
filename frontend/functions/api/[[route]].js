// Cloudflare Pages Function: Edge API Proxy & Global Edge Cache

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Render backend target
  const BACKEND_ORIGIN = "https://bloggr-y7gx.onrender.com";
  const targetUrl = new URL(url.pathname + url.search, BACKEND_ORIGIN);

  // Identify public cacheable GET endpoints
  const isCacheableGet =
    request.method === "GET" &&
    (url.pathname.includes("/post/getallposts") ||
      url.pathname.includes("/category/getallcategory") ||
      url.pathname.includes("/tags/getalltags") ||
      url.pathname.includes("/tags/trending"));

  const cache = caches.default;
  const cacheKey = new Request(targetUrl.toString(), {
    method: "GET",
  });

  // 1. Check Cloudflare 300+ edge data center cache
  if (isCacheableGet) {
    try {
      const cachedResponse = await cache.match(cacheKey);
      if (cachedResponse) {
        const response = new Response(cachedResponse.body, cachedResponse);
        response.headers.set("X-Cache-Status", "HIT-CLOUDFLARE-EDGE");
        return response;
      }
    } catch (e) {
      console.warn("Cloudflare cache lookup error:", e);
    }
  }

  // 2. Forward to Render backend
  const forwardHeaders = new Headers(request.headers);
  forwardHeaders.set("Host", "bloggr-y7gx.onrender.com");

  const forwardRequest = new Request(targetUrl.toString(), {
    method: request.method,
    headers: forwardHeaders,
    body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null,
    redirect: "follow",
  });

  try {
    const backendResponse = await fetch(forwardRequest);

    const response = new Response(backendResponse.body, backendResponse);

  // If a mutation happens (POST / PUT / DELETE to posts/categories), invalidate edge cache
  const isMutation = ["POST", "PUT", "DELETE", "PATCH"].includes(request.method);
  if (isMutation && backendResponse.status >= 200 && backendResponse.status < 300) {
    try {
      context.waitUntil(cache.delete(new Request(new URL("/api/v1/post/getallposts", BACKEND_ORIGIN).toString())));
      context.waitUntil(cache.delete(new Request(new URL("/api/v1/category/getallcategory", BACKEND_ORIGIN).toString())));
    } catch (e) {
      console.warn("Edge cache invalidation error:", e);
    }
  }

  // If successful and cacheable, save into Cloudflare Edge Cache (5 months stale-while-revalidate)
  if (isCacheableGet && backendResponse.status === 200) {
    const cacheResponse = response.clone();
    // 21 days = 1814400 seconds
    cacheResponse.headers.set("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=1814400");
    context.waitUntil(cache.put(cacheKey, cacheResponse));
    response.headers.set("X-Cache-Status", "MISS-FETCHED-FROM-RENDER");
  }

    return response;
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Backend server is waking up, please retry shortly.",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
