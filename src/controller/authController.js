import { generateAccessToken, generateRefreshToken, authenticateToken, verifyRefreshToken } from '../security/auth/jwtTokenProvider.js';


  // validate token on the server side
    export const validate = async (req, res) => {
        try {
        console.log("Validate")
        authenticateToken(req, res, () => {
            // This runs only if authenticateToken succeeds
            res.status(200).json({ valid: true, user: req.user });
        });
        } catch (err) {
        console.error("Error :", err);
        res.status(400).json({ error: err.message });
        }
    }

    // refresh token func by cheking token and that token is valid
    export const refreshFunc = async (req, res) => {
        try {
            // console.log("cookies:", req.cookies);
            const token = req.cookies.refreshToken;
        if (!token) return res.sendStatus(401);

            const user = verifyRefreshToken(token);
        if (!user) return res.sendStatus(403);
// Refreshtoken mb?
        const newAccessToken = generateAccessToken(user);
            res.json({ accessToken: newAccessToken });
        } catch (err) {
        console.error("Error :", err);
            res.status(400).json({ error: err.message });
        }
    }

    // logout deleteing cookie refresh token on the server side 
    export const logout = async (req, res) => {
        try {
        console.log("logout")

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
        });

        return res.status(200).json({ message: "Logg out successfully" });
        } catch (err) {
        console.error("Error :", err);
        res.status(400).json({ error: err.message });
        }
    }
