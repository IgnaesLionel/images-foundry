const express = require("express");
const { createCanvas, loadImage } = require("canvas");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello my dear!");
});

app.get("/og-image", async (req, res) => {
  const canvas = createCanvas(1280, 630); // create
  const ctx = canvas.getContext("2d");

  const bgImage = await loadImage("./bird.jpg");

  // center fill
  const hRatio = canvas.width / bgImage.width;
  const vRatio = canvas.height / bgImage.height;
  const ratio = Math.max(hRatio, vRatio);
  const centerShift_x = (canvas.width - bgImage.width * ratio) / 2;
  const centerShift_y = (canvas.height - bgImage.height * ratio) / 2;

  function roundedRect(ctx, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  //create background image
  ctx.drawImage(
    bgImage,
    0,
    0,
    bgImage.width,
    bgImage.height,
    centerShift_x,
    centerShift_y,
    bgImage.width * ratio,
    bgImage.height * ratio
  );

  // create black rectangle
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000000aa";
  ctx.fill();

  //simple png
  const eagle = await loadImage("./eagle.png");
  ctx.drawImage(eagle, 900, 200, eagle.width / 2, eagle.height / 2);

  //rounded image
  const bird2 = await loadImage("./bird2.jpg");
  ctx.save();
  roundedRect(ctx, 0, 0, 336, 528, 1000);
  ctx.clip();
  ctx.drawImage(bird2, 0, 0, 336, 528);
  ctx.restore();
  ctx.font = "48px serif";
  ctx.fillText("Hello world", 10, 50);
  ctx.fillText("2Hello world", 110, 150);
  canvas.createPNGStream().pipe(res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
