const nj = require('numjs')

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
  }

  pass_grad = 0

  pass(x) {
    x = nj.array(x)
    this.pass_grad = x
    const y = x.dot(this.weights.T)
    return y
  }

}

const relu = xa => nj.array(xa.tolist().map(x => x > 0 ? x : 0))

const relu_grad = xa => nj.array(xa.tolist().map(x => x > 0 ? 1 : 0))

const SE = (xa, tg) => xa.tolist().map(x => 0.5 * ((tg - x)**2))
  .reduce((a, c) => a + c, 0)


// torch does 1/N instead of 1/2N
const MSE = (xa, tg) => 1/(2*xa.length) * (xa.map((x, i) => (tg[i] - x)**2)
  .reduce((a, c) => a + c, 0))

const MSE_grad = (xa, tg, xa_init) => -1/(xa.length) * (xa.map((x, i) => xa_init[i]*(tg[i] - x))
  .reduce((a, c) => a + c, 0))


class NN {
  constructor() {
    this.input = new Linear(2, 2)
    this.hidden = new Linear(2, 2)
    this.output = new Linear(2, 2)
  }

  forward(x) {
    x = this.input.pass(x)
    x = relu(x)
    x = this.hidden.pass(x)
    x = relu(x)
    x = this.output.pass(x)
    return x
  }
}

const nn = new NN()

const EPOCHS = 1

for (let i = 0; i < EPOCHS; i++) {
  const data = [0.3, 0.5]
  const label = [0.7, 0.9]

  const out = nn.forward(data)
  const loss = MSE(out.tolist(), label)

  const outXinit = nn.output.pass_grad.tolist()
  console.log('X init', outXinit)

  const loss_grad = MSE_grad(out.tolist(), label, outXinit)

  console.log('out', out.tolist())
  console.log('label', label)
  console.log('loss', loss)
  console.log('loss grad', loss_grad)
  
}

