/**
 * Webpack Dev Server Middleware for Access Restriction
 * This blocks direct browser access and only allows requests from host app
 */

const ALLOWED_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000'];

const ACCESS_DENIED_HTML = `
<!DOCTYPE html>
<html>
<head><title>Access Denied</title></head>
<body style="font-family: sans-serif; padding: 40px; text-align: center;">
    <h1>🔒 Access Denied</h1>
    <p>This remote application can only be accessed through the host application.</p>
    <p>Please visit <a href="http://localhost:3000">http://localhost:3000</a></p>
</body>
</html>
`;

const restrictAccessMiddleware = (req, res, next) => {
    const origin = req.headers.origin;
    const referer = req.headers.referer;

    // Allow same-origin requests (for dev server and HMR)
    if (!origin && !referer) {
        const secFetchMode = req.headers['sec-fetch-mode'];
        const secFetchDest = req.headers['sec-fetch-dest'];

        // Block direct navigation requests (typing URL in browser)
        if (secFetchMode === 'navigate' && secFetchDest === 'document') {
            res.status(403);
            res.setHeader('Content-Type', 'text/html');
            res.end(ACCESS_DENIED_HTML);
            return;
        }

        // Allow other requests (script loading, HMR websocket, etc.)
        next();
        return;
    }

    // Check if origin is allowed
    const isAllowed = ALLOWED_ORIGINS.some(allowed =>
        (origin && origin.startsWith(allowed)) ||
        (referer && referer.startsWith(allowed))
    );

    if (!isAllowed) {
        res.status(403);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            error: 'Access denied. Request must originate from host application.',
            allowedOrigins: ALLOWED_ORIGINS
        }));
        return;
    }

    next();
};

module.exports = {
    devServer: {
        setupMiddlewares(middlewares, devServer) {
            // Add restriction middleware at the very beginning
            middlewares.unshift({
                name: 'restrict-access',
                middleware: restrictAccessMiddleware,
            });
            return middlewares;
        },
    },
};
