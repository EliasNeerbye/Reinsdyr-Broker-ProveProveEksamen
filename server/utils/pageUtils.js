const createPageData = (req, options = {}) => {
    const pageData = {
        title: options.title + " | Reinsdyr Broker" || "Reindeer Broker",
        isAuthenticated: req.isAuthenticated || false,
        cssLinks: ["/css/global.css", ...options.cssLinks] || ["/css/global.css"],
        scriptLinks: ["/js/navFunctionality.js", ...options.scriptLinks] || ["/js/navFunctionality.js"],
    };

    return pageData;
};

module.exports = { createPageData };
