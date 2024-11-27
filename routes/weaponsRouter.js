const router = require("express").Router();
const WeaponService = require("../services/weaponService");
const logError = require("../utils/logger");

router.get("/", async (_, res) => {
  try {
    const response = await WeaponService().getAll();
    res.status(200).json(response);
  } catch (err) {
    logError("GET Weapon", err);
    res.status(err.statusCode ?? 500).json({ message: err.message });
  }
});

router.get("/:id/maxBuildQuantity", async (req, res) => {
  try {
    const response = await WeaponService().getMaxBuildQuantity(
      parseInt(req.params.id)
    );
    res.status(200).json(response);
  } catch (err) {
    logError("GET MaxBuildQuantity", err);
    res.status(err.statusCode ?? 500).json({ message: err.message });
  }
});

module.exports = router;
