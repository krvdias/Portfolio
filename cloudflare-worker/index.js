// ============================================================
// Cloudflare Worker — Portfolio Image Upload Handler
// Deploy this on: https://dash.cloudflare.com → Workers & Pages
// ============================================================

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Only allow PUT
    if (request.method !== 'PUT') {
      return json({ error: 'Method not allowed' }, 405);
    }

    // Validate admin key
    const adminKey = request.headers.get('X-Admin-Key');
    if (!adminKey || adminKey !== env.ADMIN_KEY) {
      return json({ error: 'Unauthorized' }, 401);
    }

    // Validate content type
    const contentType = request.headers.get('Content-Type') || '';
    const isValidType = ALLOWED_TYPES.some(t => contentType.startsWith(t));
    if (!isValidType) {
      return json({ error: 'Only JPEG, PNG, and WebP images are allowed' }, 400);
    }

    // Validate file size (max 5MB)
    const contentLength = parseInt(request.headers.get('Content-Length') || '0');
    if (contentLength > 5 * 1024 * 1024) {
      return json({ error: 'File too large (max 5MB)' }, 413);
    }

    try {
      // Upload to R2 — always overwrites the same key
      const key = 'portfolio/assets/images/my.jpg';
      await env.R2_BUCKET.put(key, request.body, {
        httpMetadata: {
          contentType: 'image/jpeg',
          cacheControl: 'public, max-age=0, must-revalidate',
        },
      });

      return json({ success: true, key, timestamp: Date.now() }, 200);
    } catch (err) {
      return json({ error: 'Upload failed', detail: String(err) }, 500);
    }
  },
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
