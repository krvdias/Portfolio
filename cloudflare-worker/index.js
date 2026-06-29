// ============================================================
// Cloudflare Worker — Portfolio Backend (CMS, Analytics, Uploads)
// Deploy this on: https://dash.cloudflare.com → Workers & Pages
// ============================================================

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Content-Length, X-Admin-Key, X-Filename',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // --- VISITOR TRACKING ---
    if (path === '/api/visit' && request.method === 'POST') {
      try {
        const ip = request.headers.get('cf-connecting-ip') || 'unknown';
        const country = request.cf?.country || 'unknown';
        const city = request.cf?.city || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';
        const timestamp = Date.now();

        const visitData = { ip, country, city, userAgent, timestamp };
        
        // Fetch current visits
        let visits = [];
        const storedVisits = await env.PORTFOLIO_KV.get('visitors', 'json');
        if (storedVisits && Array.isArray(storedVisits)) {
          visits = storedVisits;
        }

        // Add new visit (keep last 1000 to avoid hitting 25MB KV limit quickly, though it would take a lot)
        visits.push(visitData);
        if (visits.length > 2000) {
          visits = visits.slice(visits.length - 2000);
        }

        await env.PORTFOLIO_KV.put('visitors', JSON.stringify(visits));
        
        // Also increment total count
        let total = parseInt(await env.PORTFOLIO_KV.get('total_visitors') || '0');
        await env.PORTFOLIO_KV.put('total_visitors', (total + 1).toString());

        return json({ success: true }, 200);
      } catch (err) {
        return json({ error: 'Failed to record visit' }, 500);
      }
    }

    // --- CMS DATA GET ---
    if (path === '/api/portfolio-data' && request.method === 'GET') {
      try {
        const data = await env.PORTFOLIO_KV.get('portfolio_data', 'json');
        if (!data) {
          return json({ data: null, message: 'No data found, use defaults' }, 200);
        }
        return json({ data }, 200);
      } catch (err) {
        return json({ error: 'Failed to fetch data' }, 500);
      }
    }

    // --- ADMIN ENDPOINTS BELOW THIS LINE ---
    const adminKey = request.headers.get('X-Admin-Key');
    if (!adminKey || adminKey !== env.ADMIN_KEY) {
      // Allow GET request to /api/portfolio-data, and POST to /api/visit without auth.
      // Everything else requires auth.
      if (path.startsWith('/api/')) {
         return json({ error: 'Unauthorized' }, 401);
      }
      // If not an API route, just return not found
      return json({ error: 'Not found' }, 404);
    }

    // --- CMS DATA PUT (ADMIN) ---
    if (path === '/api/portfolio-data' && request.method === 'PUT') {
      try {
        const body = await request.json();
        await env.PORTFOLIO_KV.put('portfolio_data', JSON.stringify(body));
        return json({ success: true }, 200);
      } catch (err) {
        return json({ error: 'Failed to save data' }, 500);
      }
    }

    // --- ANALYTICS STATS GET (ADMIN) ---
    if (path === '/api/stats' && request.method === 'GET') {
       try {
          const total = parseInt(await env.PORTFOLIO_KV.get('total_visitors') || '0');
          let visitors = await env.PORTFOLIO_KV.get('visitors', 'json') || [];
          return json({ total, visitors: visitors.reverse() }, 200); // Send newest first
       } catch (err) {
          return json({ error: 'Failed to fetch stats' }, 500);
       }
    }

    // --- IMAGE UPLOAD (ADMIN) — profile photo ---
    if (path === '/' && request.method === 'PUT') {
      const contentType = request.headers.get('Content-Type') || '';
      const isValidType = ALLOWED_TYPES.some(t => contentType.startsWith(t));
      if (!isValidType) {
        return json({ error: 'Only JPEG, PNG, and WebP images are allowed' }, 400);
      }

      const contentLength = parseInt(request.headers.get('Content-Length') || '0');
      if (contentLength > 5 * 1024 * 1024) {
        return json({ error: 'File too large (max 5MB)' }, 413);
      }

      try {
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
    }

    // --- DESIGN IMAGE UPLOAD (ADMIN) ---
    if (path === '/api/upload-design' && request.method === 'PUT') {
      const contentType = request.headers.get('Content-Type') || '';
      const isValidType = ALLOWED_TYPES.some(t => contentType.startsWith(t));
      if (!isValidType) {
        return json({ error: 'Only JPEG, PNG, and WebP images are allowed' }, 400);
      }

      const contentLength = parseInt(request.headers.get('Content-Length') || '0');
      if (contentLength > 10 * 1024 * 1024) {
        return json({ error: 'File too large (max 10MB)' }, 413);
      }

      // Custom filename from header, or generate a unique one
      const filename = request.headers.get('X-Filename') || `design-${Date.now()}`;
      const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
      const key = `portfolio/assets/images/posts/${filename}.${ext}`;

      try {
        await env.R2_BUCKET.put(key, request.body, {
          httpMetadata: {
            contentType,
            cacheControl: 'public, max-age=3600',
          },
        });

        // Build the public URL using the R2 public bucket base URL stored as a var, or derive it
        const publicBase = env.R2_PUBLIC_URL || '';
        const publicUrl = publicBase ? `${publicBase}/${key}` : key;

        return json({ success: true, key, publicUrl, timestamp: Date.now() }, 200);
      } catch (err) {
        return json({ error: 'Upload failed', detail: String(err) }, 500);
      }
    }

    return json({ error: 'Not found or method not allowed' }, 404);
  },
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
