const T = m => m[0].map((_, i) => m.map(row => row[i]))

const matmul = (a, b) => a.map((row, i) => b[0].map((_, j) =>
      row.reduce((acc, _, n) => acc + a[i][n] * b[n][j], 0)
    )
  )

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
  }

  pass(x) {
    const y = []

    // todo: bias
    for (const ws of this.weights) {
      let r = 0
      for (const inp of x) {
        for (const w of ws) {
          r += w * inp
        }
      }
      y.push(parseFloat(r.toFixed(4)))
      r = 0
    }

    return y
  }

}

const relu = xa => xa.map(x => x > 0 ? x : 0)

class NN {
  constructor() {
    this.input = new Linear(2, 4)
    this.hidden = new Linear(4, 4)
    this.output = new Linear(4, 2)
  }

  forward(x) {
    x = this.input.pass(x)
    x = relu(x)
    x = this.hidden.pass(x)
    x = relu(x)
    x = this.output.pass(x)
  }
}

const nn = new NN()

console.log(nn)
