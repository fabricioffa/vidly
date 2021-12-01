const router = require("express").Router();
const Customer = require("../models/Customer");
const { customerPostVerifier: postVerifier , customerPutVerifier: putVerifier } = require("../verifiers");

router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().select('-__v');

    if (!customers.length) return res.send("No customers enrroled yet. ");

    res.send(customers);
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  const { error } = postVerifier(req.body);

  if (error) {
    let errors = 'Atention!\n'
    for (const detail of error.details) {
      errors = `${errors + detail.message}\n`;
    }
    return res.status(400).send(errors);
  }

  try {
    const customer = await Customer.create({
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    });

    res.send(customer);
  } catch (err) {console.log(err)}
});

router.put("/:id", async (req, res) => {
  try {
    if (!await Customer.exists({ _id: req.params.id })) return res.status(404).send("Genre not found");

    const { error } = putVerifier(req.body);
    if (error) {
      let errors = 'Atention!\n'
      for (const detail of error.details) {
        errors = `${errors + detail.message}\n`;
      }
      return res.status(400).send(errors);
    }

    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id },
      {
        name: req.body.name ? req.body.name : customer.name,
        phone: req.body.phone ? req.body.phone : customer.phone,
        isGold: req.body.isGold ? req.body.isGold : customer.isGold,
      },
      { returnDocument: 'after' },
    ).select('-__v');

    res.send(customer);
  } catch (err) {console.log(err)}
});

router.delete("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndRemove(req.params.id).select('-__v');

    if (!customer) return res.status(404).send("Customer not found");

    res.send(customer);
  } catch (err) {console.log(err)}
});

router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select('-__v');

    if (!customer) return res.status(404).send("Customer not found");

    res.send(customer);
  } catch (err) {console.log(err)}
});



module.exports = router;
