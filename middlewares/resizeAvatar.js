const Jimp = require("jimp");

const resizeAvartar = async (req, res, next) => {
  const path = req.file.path;

  try {
    const avatar = await Jimp.read(path);
    avatar.resize(250, 250);
    await avatar.writeAsync(path);
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = resizeAvartar;