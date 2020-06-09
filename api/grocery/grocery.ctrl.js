const models = require('../../models');

const index = function (req, res) {
  req.query.limit = req.query.limit || 10;
  const limit = parseInt(req.query.limit, 10); 
  if (Number.isNaN(limit)) {
    return res.status(400).end();
  }

  models.Grocery
      .findAll({
        limit: limit
      })
      .then(groceries => {
        res.json(groceries);
      });
};

const show = function(req, res) {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).end();

  models.Grocery.findOne({
    where: {id}
  }).then(grocery => {
    if (!grocery) return res.status(404).end();
    res.json(grocery);
  });
}

const destroy = (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).end();

  models.Grocery.destroy({
    where: { id }
  }).then(() => {
    res.status(204).end();
  });
}

const create = (req, res) =>{
  const name = req.body.name;
  const price = req.body.price;
  console.log('name: ', name, ', price: ', price);
  if (!name || !price) return res.status(400).end();

  models.Grocery.create({ name, price })
      .then((grocery) => {
        res.status(201).json(grocery);
      })
      .catch((err) => {
        if (err.name === 'SequelizeUniqueConstraintError')  {
          return res.status(409).end();
        }
        res.status(500).end();
      });
}

const update =  (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).end();

  const name = req.body.name;
  const price = req.body.price;
  if (!name || !price) return res.status(400).end();

  models.Grocery.findOne({ where: { id } })
      .then(grocery => {
        if (!grocery) return res.status(404).end();

        grocery.name = name;
        grocery.price = price;
        grocery.save()
            .then(_ => {
              res.json(grocery);
            })
            .catch(err => {
              if (err.name === 'SequelizeUniqueConstraintError')  {
                return res.status(409).end();
              }
              res.status(500).end();
            })
      });
}

const authorize = (req, res) =>{
  console.log(`authorization_params: ${JSON.stringify(req.body.authorization_params, null, 4)}`);
  console.log(`request_context: ${JSON.stringify(req.body.request_context, null, 4)}`);

  // do something here with request.body.authorization_params and request.body.request_context

  const response = {
    "context": {},
    "authorization_decision": {
      "decision": "Permit"
    }
  };

  res.status(201).json(response);
}



module.exports = {
  index,
  show,
  destroy,
  create,
  update,
  authorize,
};
