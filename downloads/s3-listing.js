/**
 * This scripts exposes S3 directory listings via an unauthenticated API.
 */

/** (String) -> hex-encoded String */
async function SHA256(value) {
    const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
    return toHex(hash);
}

/** (Uint8Array, String) -> ArrayBuffer */
async function HMAC_SHA256(key, value) {
    const k = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const v = new TextEncoder().encode(value);
    return await crypto.subtle.sign("HMAC", k, v);
}

/** ArrayBuffer -> hex-encoded String */
function toHex(ab) {
    return Array.from(new Uint8Array(ab)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function listBucket(env, prefix) {

    const timestamp = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, "");
    const date = timestamp.substr(0, 8);

    // e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 == empty request body
    const canonicalRequest = `\
GET
/
delimiter=%2F&prefix=${encodeURIComponent(prefix)}
host:${new URL(env.S3_ENDPOINT).hostname}
x-amz-content-sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
x-amz-date:${timestamp}

host;x-amz-content-sha256;x-amz-date
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`;
    const canonicalRequestHash = await SHA256(canonicalRequest);

    const stringToSign = `\
AWS4-HMAC-SHA256
${timestamp}
${date}/${env.REGION}/s3/aws4_request
${canonicalRequestHash}`;
    const s1 = new TextEncoder().encode(`AWS4${env.SECRET_ACCESS_KEY}`)
    const s2 = await HMAC_SHA256(s1, date);
    const s3 = await HMAC_SHA256(s2, env.REGION);
    const s4 = await HMAC_SHA256(s3, "s3");
    const s5 = await HMAC_SHA256(s4, "aws4_request");
    const s6 = await HMAC_SHA256(s5, stringToSign);
    const sig = toHex(s6);
    const authHeader = `AWS4-HMAC-SHA256 Credential=${env.ACCESS_KEY_ID}/${date}/${env.REGION}/s3/aws4_request,SignedHeaders=host;x-amz-content-sha256;x-amz-date,Signature=${sig}`;

    return await fetch(env.S3_ENDPOINT + `?delimiter=/&prefix=${prefix}`, { 
        headers: {
            "Authorization": authHeader,
            "x-amz-content-sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "x-amz-date": timestamp, 
        }
    });
    
}

export default {
    async fetch(request, env) {
        if (request.method === "OPTIONS") {
            return handleOptions(request);
        } else {
            const prefix = new URL(request.url).searchParams.get("prefix") || "";
            let response = await listBucket(env, prefix);
            response = new Response(response.body, response);
            response.headers.set("Access-Control-Allow-Origin", "*");
            return response;
        }
  }
}


// adapted from https://developers.cloudflare.com/workers/examples/cors-header-proxy/
async function handleOptions(request) {
    if (
        request.headers.get("Origin") !== null &&
        request.headers.get("Access-Control-Request-Method") !== null &&
        request.headers.get("Access-Control-Request-Headers") !== null
    ) {
        // Handle CORS preflight requests.
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
                "Access-Control-Max-Age": "86400",
                "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers"),
            },
        });
        } 
    else {
        // Handle standard OPTIONS request.
        return new Response(null, {
            headers: {
                Allow: "GET, HEAD, OPTIONS",
            },
        });
    }
}
