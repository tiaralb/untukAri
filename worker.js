// Cloudflare Worker untuk Birthday Wishes API
// Deploy ini sebagai Cloudflare Worker

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    const url = new URL(request.url);

    try {
      // GET - Load all wishes
      if (request.method === 'GET' && url.pathname === '/api/wishes') {
        return await handleGetWishes(env);
      }

      // POST - Add new wish
      if (request.method === 'POST' && url.pathname === '/api/wishes') {
        return await handlePostWish(request, env);
      }

      return new Response('Not Found', { 
        status: 404,
        headers: corsHeaders 
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};

// Get all wishes from KV
async function handleGetWishes(env) {
  try {
    // List all keys with 'wish:' prefix
    const list = await env.BIRTHDAY_WISHES.list({ prefix: 'wish:' });
    
    // Fetch all wishes
    const wishPromises = list.keys.map(key => 
      env.BIRTHDAY_WISHES.get(key.name)
    );
    
    const wishStrings = await Promise.all(wishPromises);
    const wishes = wishStrings
      .filter(w => w !== null)
      .map(w => JSON.parse(w))
      .sort((a, b) => b.timestamp - a.timestamp); // Sort newest first

    // If no wishes exist, create default ones
    if (wishes.length === 0) {
      const defaultWishes = [
        {
          id: 'default-1',
          name: 'YAYA',
          message: 'hehe ini testing',
          relation: 'keluarga',
          timestamp: Date.now() - 4000
        },
        
      ];

      // Save default wishes to KV
      for (const wish of defaultWishes) {
        await env.BIRTHDAY_WISHES.put(
          `wish:${wish.id}`,
          JSON.stringify(wish)
        );
      }

      return new Response(JSON.stringify({ wishes: defaultWishes }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    return new Response(JSON.stringify({ wishes }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to load wishes',
      message: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Add new wish to KV
async function handlePostWish(request, env) {
  try {
    const body = await request.json();
    
    // Validate input
    if (!body.name || !body.message) {
      return new Response(JSON.stringify({ 
        error: 'Name and message are required' 
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // Sanitize input (basic XSS protection)
    const sanitize = (str) => {
      return str
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .substring(0, 500); // Max 500 characters
    };

    const wish = {
      id: `wish-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: sanitize(body.name.trim()),
      message: sanitize(body.message.trim()),
      relation: sanitize(body.relation || 'Teman'),
      timestamp: Date.now()
    };

    // Save to KV
    await env.BIRTHDAY_WISHES.put(
      `wish:${wish.id}`,
      JSON.stringify(wish)
    );

    return new Response(JSON.stringify({ 
      success: true,
      wish 
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to save wish',
      message: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}