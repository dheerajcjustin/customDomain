import WorkSpace from "../models/workSpace.js";

const mainHost = process.env.domainName;

export const checkCustomDomain = async (req, res, next) => {
  const currentDomain = req.get("host");
  console.log({ currentDomain, mainHost });
  const isCurrentDomainAndMainSame = currentDomain === mainHost;
  const isSubDomainOfMainDomain =
    !isCurrentDomainAndMainSame && currentDomain.endsWith(`.${mainHost}`);

  let subDomain = "";
  let workSpace = null;
  if (isSubDomainOfMainDomain) {
    subDomain = currentDomain.split(`.${mainHost}`)[0];
    workSpace = await WorkSpace.findOne({ subDomain });
  } else if (!isCurrentDomainAndMainSame) {
    workSpace = await WorkSpace.findOne({ domain: currentDomain });
  }

  if (workSpace?._id) {
    req.workSpace = workSpace;

    next();
  } else if (isCurrentDomainAndMainSame) {
    next();
  } else {
    res.status(404).send("not found");
  }
};
