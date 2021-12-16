import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  onValue,
  update,
  remove,
  child,
  get
} from "firebase/database";
export class Tik_Tok_Toe {
  constructor() {
    this.firebaseConfig = {
      apiKey: "AIzaSyD0gyAu30K2TrW4cN2UtpCDf_fmtfvg1_Q",
      authDomain: "my-project-c86c2.firebaseapp.com",
      databaseURL: "https://my-project-c86c2.firebaseio.com",
      projectId: "my-project-c86c2",
      storageBucket: "my-project-c86c2.appspot.com",
      messagingSenderId: "917329553165",
      appId: "1:917329553165:web:b6e85ce1206f64b0",
      measurementId: "G-D9WE4YEK4W"
    };

    this.app = initializeApp(this.firebaseConfig);
    this.db = getDatabase(this.app);
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");

    this.root = document.getElementById("demo");
    this.button = document.querySelector("#reset");

    this.input = document.querySelector("#input");
  }

  init() {
    this.platfArr = [
      { a: 100, b: 300, c: 100, d: 0 },
      { a: 200, b: 300, c: 200, d: 0 },
      { a: 300, b: 100, c: 0, d: 100 },
      { a: 300, b: 200, c: 0, d: 200 }
    ];
    this.arrX = [
      { a: 90, b: 10, c: 90, d: 10 },
      { a: 190, b: 110, c: 90, d: 10 },
      { a: 290, b: 210, c: 90, d: 10 },
      { a: 90, b: 10, c: 190, d: 110 },
      { a: 190, b: 110, c: 190, d: 110 },
      { a: 290, b: 210, c: 190, d: 110 },
      { a: 90, b: 10, c: 290, d: 210 },
      { a: 190, b: 110, c: 290, d: 210 },
      { a: 290, b: 210, c: 290, d: 210 }
    ];
    this.arrO = [
      { x: 50, y: 50 },
      { x: 150, y: 50 },
      { x: 250, y: 50 },
      { x: 50, y: 150 },
      { x: 150, y: 150 },
      { x: 250, y: 150 },
      { x: 50, y: 250 },
      { x: 150, y: 250 },
      { x: 250, y: 250 }
    ];
    this.click = [
      { x1: 0, y1: 0, x2: 100, y2: 100 },
      { x1: 100, y1: 0, x2: 200, y2: 100 },
      { x1: 200, y1: 0, x2: 300, y2: 100 },
      { x1: 0, y1: 100, x2: 100, y2: 200 },
      { x1: 100, y1: 100, x2: 200, y2: 200 },
      { x1: 200, y1: 100, x2: 300, y2: 200 },
      { x1: 0, y1: 200, x2: 100, y2: 300 },
      { x1: 100, y1: 200, x2: 200, y2: 300 },
      { x1: 200, y1: 200, x2: 300, y2: 300 }
    ];
    this.win = [
      [0, 1, 2],
      [0, 3, 6],
      [0, 4, 8],
      [1, 4, 7],
      [2, 4, 6],
      [2, 5, 8],
      [3, 4, 5],
      [6, 7, 8]
    ];
    this.allIndex = [];
    this.indexX = [];
    this.indexO = [];
    this.bool = Array.from(Array(8), () => new Array(3));
    this.gool = Array.from(Array(8), () => new Array(3));
    this.boolen = true;
    this.boolX = true;
    this.boolO = false;
    this.gradient = this.ctx.createLinearGradient(0, 0, 170, 0);
    this.gradient.addColorStop("0", "magenta");
    this.gradient.addColorStop("0.5", "blue");
    this.gradient.addColorStop("1.0", "red");

    this.update();
    // Melumatlari ekrana yazdir
    this.draw();

    this.sId = this.readSession("ID");
  }

  reset() {
    this.init();
    let date = new Date();
    let time = date.getMinutes();
    update(ref(this.db, "nik/" + this.readSession("ID") + "/X"), {
      bool: true,
      indexX: [],
      date: time
    });
    update(ref(this.db, "nik/" + this.readSession("ID") + "/O"), {
      bool: false,
      indexO: [],
      date: time
    });
  }

  readSession(name) {
    return sessionStorage.getItem(name);
  }

  update() {
    this.button.addEventListener(
      "click",
      (this.func = (e) => {
        this.reset();
      }),
      false
    );
    this.canvas.addEventListener(
      "click",
      // Play
      (this.func = (e) => {
        onValue(ref(this.db, "nik/" + this.readSession("ID")), (snapshot) => {
          let dbData = snapshot.val();
          if (dbData) {
            this.boolX = dbData["X"].bool;
            this.boolO = dbData["O"].bool;
            if (dbData["X"].indexX && dbData["O"].indexO) {
              this.allIndex = dbData["X"].indexX.concat(dbData["O"].indexO);
            }
          }
        });

        this.click.forEach((n) => {
          if (
            e.offsetX > n.x1 &&
            e.offsetY > n.y1 &&
            e.offsetX < n.x2 &&
            e.offsetY < n.y2
          ) {
            this.index = this.click.indexOf(n);
            if (this.allIndex.length == 9) {
              this.winner("Game Over");
            } else {
              if (this.readSession("player") == "X" && this.boolX) {
                this.indexX.push(this.index);
                update(ref(this.db, "nik/" + this.readSession("ID") + "/X"), {
                  bool: false,
                  indexX: this.indexX
                });
                update(ref(this.db, "nik/" + this.readSession("ID") + "/O"), {
                  bool: true
                });
              } else if (this.readSession("player") == "O" && this.boolO) {
                this.indexO.push(this.index);
                update(ref(this.db, "nik/" + this.readSession("ID") + "/O"), {
                  bool: false,
                  indexO: this.indexO
                });
                update(ref(this.db, "nik/" + this.readSession("ID") + "/X"), {
                  bool: true
                });
              }
            }
          }
        });

        // CHECK STEPS
        for (let i = 0; i < this.win.length; i++) {
          for (let j = 0; j < this.win[i].length; j++) {
            this.bool[i][j] = this.indexX.includes(this.win[i][j]);
            this.gool[i][j] = this.indexO.includes(this.win[i][j]);
          }
        }

        // WINNER
        for (let i = 0; i < this.bool.length; i++) {
          if (this.bool[i].every((x) => x === true)) {
            update(ref(this.db, "nik/" + this.readSession("ID") + "/X"), {
              winner: "X",
              bool: false
            });
            update(ref(this.db, "nik/" + this.readSession("ID") + "/O"), {
              winner: "X",
              bool: false
            });
            this.winner("X win");
            break;
          } else if (this.gool[i].every((e) => e === true)) {
            update(ref(this.db, "nik/" + this.readSession("ID") + "/X"), {
              winner: "O",
              bool: false
            });
            update(ref(this.db, "nik/" + this.readSession("ID") + "/O"), {
              winner: "O",
              bool: false
            });
            this.winner("O win");
            break;
          }
        }
      }),
      false
    );
  }

  winner(name) {
    onValue(ref(this.db, "nik/" + this.readSession("ID")), (snapshot) => {
      let dbData = snapshot.val();
      // console.log(dbData["X"].winner, dbData["O"].winner);
      this.root.innerHTML = dbData["X"].winner + " win";
    });
    this.boolen = false;
  }

  draw() {
    onValue(ref(this.db, "nik/" + this.readSession("ID")), (snapshot) => {
      let dbData = snapshot.val();
      if (dbData) {
        const { canvas, ctx } = this;

        // Platforma
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Lines
        this.platfArr.forEach((x) => {
          ctx.beginPath();
          ctx.fillStyle = "orange";
          ctx.strokeStyle = this.gradient;
          ctx.lineWidth = 5;
          ctx.lineCap = "butt";
          ctx.moveTo(x.a, x.b);
          ctx.lineTo(x.c, x.d);
          ctx.stroke();
        });

        // X
        if (dbData["X"].indexX) {
          this.indexX = dbData["X"].indexX;
          this.indexX.forEach((e) => {
            ctx.beginPath();
            ctx.strokeStyle = "#8c8c8c";
            ctx.lineWidth = 8;
            ctx.lineCap = "round";
            ctx.miterLimit = 5;
            ctx.moveTo(this.arrX[e].a, this.arrX[e].c);
            ctx.lineTo(this.arrX[e].b, this.arrX[e].d);
            ctx.moveTo(this.arrX[e].a, this.arrX[e].d);
            ctx.lineTo(this.arrX[e].b, this.arrX[e].c);
            ctx.stroke();
          });
        }

        // O
        if (dbData["O"]) {
          if (dbData["O"].indexO) {
            this.indexO = dbData["O"].indexO;
            this.indexO.forEach((e) => {
              ctx.beginPath();
              ctx.strokeStyle = "#006699";
              ctx.arc(this.arrO[e].x, this.arrO[e].y, 40, 0, 2 * Math.PI);
              ctx.stroke();
            });
          }
        }
      }
    });
  }
}
