import WorkSpace from "../models/workSpace.js";
import { Adddomain, verifyDomainMapping } from "../services/addDomain.js";
const mainHost = process.env.domainName;

export const loginGetController = (req, res) => {
  res.render("login");
};

export const homeGetController = (req, res) => {
  console.log("inside the  home consoller ");
  console.log("req?.workSpace?._id", req?.workSpace?._id);

  if (req?.workSpace?._id) {
    console.log(req.wordSpace);
    return res.render("workSpacePublic", req.wordSpace);
  }
  res.render("index");
};

export const registerGetController = (req, res) => {
  res.render("register");
};

export const updateSubDomain = async (req, res) => {
  const { workSpaceId } = req.params;
  const { subDomain } = req.body;
  const workSpace = WorkSpace.findOne({ subDomain });
  if (workSpace._id) {
    return res.redirect("/error", { message: "sub domain already in use" });
  }

  const newWorkSpace = await WorkSpace.findByIdAndUpdate(workSpaceId, {
    subDomain,
  });
  res.redirect(`/workSpace/${newWorkSpace._id.toHexString()}`);
};

export const WorkSpaceDetailsGetController = async (req, res) => {
  const { workSpaceId } = req.params;
  const work = await WorkSpace.findById(workSpaceId);
  res.render("workSpaceDetailsView", work);
};

export const addWrokSapceControler = async (req, res) => {
  console.log("*");
  console.log(req.body);
  console.log("*");

  const wordSpace = await WorkSpace.create(req.body);
  res.redirect(`/workSpace/${wordSpace._id.toHexString()}`);
};

export const loginPostController = async (req, res) => {
  const wordSpace = await WorkSpace.findOne({ email: req?.body?.email });
  console.log(wordSpace, req.body.email);
  res.redirect(`/workSpace/${wordSpace?._id?.toHexString()}`);
};

export const getDomainController = async (req, res) => {
  const { workSpaceId } = req.params;
  const wordSpace = await WorkSpace.findById(workSpaceId);
  res.render("changeDomainName", wordSpace);
};

export const changeDomianPost = async (req, res) => {
  try {
    const { workSpaceId } = req.params;
    const { domain: domainName } = req.body;
    console.log("domain name ", domainName);
    console.log("req. body ", req.body);
    const isMappedToOurIP = await verifyDomainMapping(domainName);
    if (!isMappedToOurIP) return res.send("verification failed");
    const domain = await Adddomain(domainName);
    const wordSpace = await WorkSpace.findByIdAndUpdate(
      workSpaceId,
      {
        domain: domainName,
      },
      { new: true }
    );

    res.json({ message: "domain name added ", wordSpace });
  } catch (error) {
    console.log(error);
  }
};

// http://localhost:5000/workSpace/666d62839d1c0d8d6abbef64

export const getErrorPage = async (req, res) => {
  res.render("errro", { message: "" });
};
