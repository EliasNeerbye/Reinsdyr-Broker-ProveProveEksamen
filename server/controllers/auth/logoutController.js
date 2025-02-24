const logout = async (req, res) => {
    try {
        if (!req.session.isLoggedIn) {
            return res.status(400).json({
                success: false,
                message: "Ingen aktiv brukerøkt funnet",
            });
        }

        req.session.destroy((err) => {
            if (err) {
                console.error("Feil ved utlogging:", err);
                return res.status(500).json({
                    success: false,
                    message: "Kunne ikke logge ut, prøv igjen senere",
                });
            }

            res.clearCookie("connect.sid", { path: "/" });

            return res.status(200).json({
                success: true,
                message: "Utlogging vellykket",
            });
        });
    } catch (error) {
        console.error("Utloggingsfeil:", error);
        res.status(500).json({
            success: false,
            message: "En serverfeil oppstod under utlogging",
        });
    }
};

module.exports = logout;
