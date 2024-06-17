import { Router } from "express";
import {
  WorkSpaceDetailsGetController,
  addWrokSapceControler,
  changeDomianPost,
  getDomainController,
  getErrorPage,
  homeGetController,
  loginGetController,
  loginPostController,
  registerGetController,
  updateSubDomain,
} from "../controller/HomeController.js";
import { checkCustomDomain } from "../middlewares/domainCheck.js";

const homeRouter = Router();

homeRouter.get("/login", loginGetController);
homeRouter.post("/login", loginPostController);

homeRouter.get("/register", registerGetController);
homeRouter.post("/register", addWrokSapceControler);
homeRouter.get("/workSpace/:workSpaceId", WorkSpaceDetailsGetController);
homeRouter.post("/workSpace/subDomain/:workSpaceId", updateSubDomain);

homeRouter.get("/workSpace/domain/:workSpaceId", getDomainController);

homeRouter.post("/workSpace/domain/update/:wordSpaceId", changeDomianPost);

homeRouter.get("/", checkCustomDomain, homeGetController);

homeRouter.get("/error", getErrorPage);

export default homeRouter;
