const nj = require('numjs')
const m = require('mathjs')

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
  return (x.multiply(2).subtract((y.multiply(2))))
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

let l1 = nj.array([[-0.6279, -0.4686], [-0.0907, 0.6363]]) // getWeights(2, 2)
let l2 = nj.array([[0.731, 0.6026], [-0.1873, -0.6037]])  // getWeights(2, 2) 

const EPOCHS = 1
const lr = 0.01

const losses = []

for (let i = 0; i < EPOCHS; i++) {
  const x = nj.array([0.3, 0.5])
  const y = nj.array([1, 0])

  console.log('data', x.tolist())
  console.log('labels', y.tolist())

  // forward

  const l1_o = x.dot(l1.T)
  // const l1_o_relu = relu(l1_o)
  // const l2_o = l1_o_relu.dot(l2.T)
  const l2_o = l1_o.dot(l2.T)
  const se = SE(l2_o, y)
  const loss = MSE(se)

  losses.push(loss)

  console.log('L1', l1.tolist())
  console.log('L1 out', l1_o.tolist())
  // console.log('L1 out relu', l1_o_relu.tolist())
  console.log('L2', l2.tolist())
  console.log('L2 out', l2_o.tolist())
  console.log('loss', loss)

  // backward
  console.log('---------------')

  // const l2_o_loss_grad = SE_dx(l2_o, y)
  
  const l2_o_grad_m = MSE_dx(l2_o, y, l1_o)
  const l1_o_grad_m = MSE_dx(l2_o, y, x.dot(l2.T))

  const l2_o_grad = l2.multiply(l2_o_grad_m)
  const l1_o_grad = l1.multiply(l1_o_grad_m)

  console.log('l2 grad', l2_o_grad.tolist())
  console.log('l1 grad', l1_o_grad.tolist())
  // console.log('l1 relu grad', l1_o_relu_grad.tolist())

  // sgd
  console.log('+++++++++++++++')

  l1 = l1.subtract(l1_o_grad.multiply(lr))
  l2 = l2.subtract(l2_o_grad.multiply(lr))
}

console.log(losses)
console.log(losses[losses.length-1])


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
console.log('\n\n')
 *
*/

/*
class Linear {
  weights = []

  inN = 0
  outN = 0

  constructor(inN, outN) {
    this.inN = inN
    this.outN = outN
    for (let j = 0; j < outN; j++) {
      this.weights.push([])
      for (let i = 0; i < inN; i++) {
        this.weights[this.weights.length - 1].push(
          parseFloat((Math.random() * 1.8 - 0.9).toFixed(4))
        )
      }
    }

    this.weights = nj.array(this.weights)
    console.log('W', this.weights.tolist())
  }

  pass_x = 0
  pass_y = 0
  grad = 0

  pass(x) {
    x = nj.array(x)
    this.pass_x = x
    const y = x.dot(this.weights.T)
    this.pass_y = y
    return y
  }

}

const relu = xa => nj.array(xa.tolist().map(x => x > 0 ? x : 0))

const relu_grad = xa => nj.array(xa.tolist().map(x => x > 0 ? 1 : 0))

const SE = (xa, tg) => xa.tolist().map(x => 0.5 * ((tg - x)**2))
  .reduce((a, c) => a + c, 0)
const dumb_MSE = (xa, tg) => 1/(xa.length) * (xa.map((x, i) => (tg[i] - x)**2)
  .reduce((a, c) => a + c, 0))
const dumb_MSE_grad = (xa, tg, xa_init) => -1/(xa.length) * (xa.map((x, i) => xa_init[i]*(tg[i] - x))
  .reduce((a, c) => a + c, 0))


// torch does 1/N instead of 1/2N
const MSE = (xa, tg) => tg.subtract(xa).pow(2).sum() * (1/(xa.shape[0]))


class NN {
  constructor() {
    this.input = new Linear(2, 2)
    // this.hidden = new Linear(1, 1)
    this.output = new Linear(2, 2)
  }

  forward(x) {
    x = this.input.pass(x)
    x = relu(x)
    //console.log('FIRST LAYER RELU', x.tolist())
    //x = this.hidden.pass(x)
    //console.log('SECOND LAYER', x.tolist())
    //x = relu(x)
    //console.log('SECOND LAYER RELU', x.tolist())
    x = this.output.pass(x)
    console.log('LAST LAYER', x.tolist())
    return x
  }

  backward() {

  }
}

const nn = new NN()

const EPOCHS = 1

const mse_l2_grad = (l1_w, l2_w, x1, y, l_o) => {
  // l2 grad -2*l1_w*x1*(-l1_w*l2_w*x1 + y)/N

  const p2 = (nj.negative(l1_w).dot(l2_w.T).T.dot(x1).add(y))
  const sd1 = l_o.shape[0] - p2.shape[0]
  if (sd1) { // todo zeros
    l_o = nj.concatenate(l_o, nj.zeros(sd1))
  }
  const m1 = l_o.dot(p2)
  const m2 = m1.dot(-2)
  
  const d1 = m2.divide(y.shape[0])

  return d1.get(0)
}

const mse_l1_grad = (l1_w, l2_w, x1, y, l_o) => {
  // l1 grad -2*l2_w*x1*(-l1_w*l2_w*x1 + y)/N

  const p2 = (nj.negative(l1_w).dot(l2_w.T).T.dot(x1).add(y))
  const sd1 = l_o.shape[0] - p2.shape[0]
  if (sd1) { // todo zeros
    l_o = nj.concatenate(l_o, nj.zeros(sd1))
  }
  const m1 = l_o.dot(p2)
  const m2 = m1.dot(-2)
  
  const d1 = m2.divide(y.shape[0])

  return d1.get(0)
}

const mse_l1_grad = (l1_w,l2_w,x1,y) => ((l2_w.dot(x1).dot((-l1_w.dot(l2_w).dot(x1).add(y)))).divide(2)).dot(-2)

for (let i = 0; i < EPOCHS; i++) {
  const data = [0.3, 0.5]
  const label = [0.7, 0.9]

  const out = nn.forward(data)
  const loss = MSE(out, nj.array(label))

  console.log('----------------')

  console.log('inp w', nn.input.weights.tolist())
  console.log('FIRST PASS Y', nn.input.pass_y.tolist())
  console.log('out w', nn.output.weights.tolist())
  console.log('SECOND PASS Y', nn.output.pass_y.tolist())
  console.log('data', data)
  const l2_grad = mse_l2_grad(nn.input.weights, nn.output.weights, nj.array(data), nj.array(label), nn.output.pass_y)
  console.log(l2_grad)

  console.log('+++++++++++++++')
  console.log('out', out.tolist())
  console.log('label', label)
  console.log('loss', loss)
  console.log('loss grad', l2_grad)
  console.log('---------------')

}
*/
