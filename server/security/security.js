export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        console.log("Session user in app.js: " + req.session.user)
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
  };

export const isAuthurized = (req, res, next) => {
    if (req.session.role === "ROLE_ADMIN") {
        next();
    } else {
        res.status(403).send("Forbidden");
    }
};