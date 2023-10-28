const errorM = (err, req, res, next) => {
  return res.status(500).send({
    success: false,
    err,
  });
};
export default errorM;
