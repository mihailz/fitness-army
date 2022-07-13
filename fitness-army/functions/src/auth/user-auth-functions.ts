import {NextFunction, Request, Response} from "express";
import admin = require("firebase-admin")

// eslint-disable-next-line max-len
export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const {authorization} = req.headers;

  if (!authorization) {
    return res.status(401).send({message: "Unauthorized!"});
  }

  if (!authorization.startsWith("Bearer")) {
    return res.status(401).send({message: "Unauthorized!"});
  }

  const bearerTokenKeyValue = authorization.split("Bearer ");
  if (bearerTokenKeyValue.length != 2) {
    return res.status(401).send({message: "Unauthorized!"});
  }

  const token = bearerTokenKeyValue[1];

  try {
    // eslint-disable-next-line max-len
    const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(token);
    console.log("decodedToken: ", JSON.stringify(decodedToken));
    // eslint-disable-next-line max-len
    res.locals = {...res.locals, uid: decodedToken.uid, role: decodedToken.role, email: decodedToken.email};
    return next();
  } catch (error) {
    return res.status(401).send({message: "Unauthorized!"});
  }
}

export function isAuthorized(roles: Array<"admin-and-coach" | "coach" | "user">) {
  return (req: Request, res: Response, next: NextFunction) => {
    const {role} = res.locals;

    if (!role) {
      return res.status(403).send();
    }

    if (roles.includes(role)) {
      return next();
    }

    return res.status(403).send();
  };
}
