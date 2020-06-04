const hello = function (req, res) {
    res.json({ "result": "hello, world!" });
};

module.exports = {
  hello,
};
