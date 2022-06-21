const nj = require('numjs')

const relu = x => {
  const d2 = x.shape.length > 1 

  if (x.tolist) {
    x = x.tolist()
  }

  if (d2) {
    return nj.array(x.map(ei => ei.map(ej => ej > 0 ? ej : 0)))
  } else {
    return nj.array(x.map(e => e > 0 ? 1 : 0))
  }
}

const relu_dx = x => {
  const d2 = x.shape.length > 1 

  if (x.tolist) {
    x = x.tolist()
  }

  if (d2) {
    return nj.array(x.map(ei => ei.map(ej => ej > 0 ? 1 : 0)))
  } else {
    return nj.array(x.map(e => e > 0 ? 1 : 0))
  }
}

const getWeights = (inN, outN) => {
  const weights = []
  for (let j = 0; j < outN; j++) {
    weights.push([])
    for (let i = 0; i < inN; i++) {
      weights[weights.length - 1].push(
        parseFloat((Math.random() * 1.8 - 0.9).toFixed(4))
      )
    }
  }

  return nj.array(weights)
}

const SE = (x, y) => {
  return (y.subtract(x).pow(2))
}

const SE_dx = (x, y) => {
  return (x.multiply(1).subtract((y.multiply(1))))
}

const MSE = squared_error => {
  const sum = squared_error.sum()
  const mse = sum / squared_error.shape[0]
  return mse
}

const MSE_dx = (x, y, x_init) => {
  const s = -1/x.shape[0] * 2

  const di = y.subtract(x)
  const sd = di.dot(x_init)

  const grad = sd.dot(s)

  return grad.get(0)
}

let l1 = getWeights(2, 2)
let l2 = getWeights(2, 2) 

const EPOCHS = 100
const lr = 0.01

const losses = []

for (let i = 0; i < EPOCHS; i++) {
  let x = nj.array([0.3, 0.5])
  let y = nj.array([1, 0])

  // forward
  const l1_o = x.dot(l1.T)
  const l1_o_relu = relu(l1_o)
  const l2_o = l1_o_relu.dot(l2.T)
  const se = SE(l2_o, y)
  const loss = MSE(se)

  losses.push(loss)

  // backward
  const l2_o_grad_init = SE_dx(l2_o, y).reshape(1, l2.shape[0])
  const l2_o_grad = l1_o_relu.reshape(l1.shape[0], 1).dot(l2_o_grad_init).T

  const l2_x = x.dot(l2.T).reshape(l2.shape[0], 1)
  const l1_o_grad = l2_x.reshape(x.shape[0], 1).dot(l2_o_grad_init).T

  // sgd
  l1 = l1.subtract(l1_o_grad.multiply(lr))
  l2 = l2.subtract(l2_o_grad.multiply(lr))
}

console.log(losses)
console.log(losses[losses.length-1])





// ****** TRASH GOES HERE ******
/*
// l1w = 0.6279
// l2w = 0.7310
// l1o = 0.1884 -> 0.6279 * 0.3
// l2o = 0.1377

// l1w = 0.7310
// l2w = 0.6279
// l1o = 0.2193
// l2o = 0.1377

const test_dx_l2 = MSE_dx(nj.array([0.1377]), nj.array([1]), nj.array([0.1884]))
console.log('TEST dx L2', test_dx_l2)
const test_dx_l1 = MSE_dx(nj.array([0.1337]), nj.array([1]), nj.array([0.2193]))
console.log('TEST dx L1', test_dx_l1)
*/
