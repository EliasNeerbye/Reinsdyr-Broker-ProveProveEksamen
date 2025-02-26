const createPageData = (req, options = {}) => {
    const pageData = {
        title: options.title ? options.title + " | Kukkik Ano" : "Kukkik Ano",
        isAuthenticated: req.isAuthenticated || false,
        cssLinks: ["/css/global.css"].concat(options.cssLinks || []),
        scriptLinks: ["/js/navFunctionality.js"].concat(options.scriptLinks || []),
    };

    return pageData;
};

module.exports = { createPageData };