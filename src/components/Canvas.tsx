import React, {useRef, useEffect} from 'react';

import Pos from '../Pos';

interface CanvasData {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  offset: Pos;
  scale: number;
}

function drawAxis({ctx, width, height, offset}: CanvasData) {
  const xMiddle = width / 2 + offset.x;
  const yMiddle = height / 2 - offset.y;
  ctx.moveTo(0, yMiddle);
  ctx.lineTo(width, yMiddle);
  ctx.stroke();

  ctx.moveTo(xMiddle, 0);
  ctx.lineTo(xMiddle, height);
  ctx.stroke();
}

function convertPos({width, height, offset, scale}: CanvasData, pos: Pos) {
  return {
    x: width / 2 + (pos.x * scale) + offset.x,
    y: height / 2 - (pos.y * scale) - offset.y
  };
}

function getRange(size: number, scale: number, offset: number) {
  return {
    start: -(size / 2 + offset) / scale,
    end: (size / 2 - offset) / scale
  };
}

function drawFunction(data: CanvasData, f: (x: number) => number) {
  const {ctx, width, height, offset, scale} = data;

  const x = getRange(width, scale, offset.x);
  let prevPos: Pos | null = null;

  ctx.beginPath();
  for (let i = x.start; i < x.end; i += (x.end - x.start) / (width ** 2)) {
    const drawPos = convertPos(data, {x: i, y: f(i)});

    if (prevPos !== null && Math.abs(drawPos.y - prevPos.y) < height) {
      ctx.lineTo(drawPos.x, drawPos.y);
    } else {
      ctx.moveTo(drawPos.x, drawPos.y);
    }

    prevPos = drawPos;
  }

  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawFunctionGrid(data: CanvasData, f: (x: number, y: number) => number) {
  const {ctx, width, height, offset, scale} = data;

  const x = getRange(width, scale, offset.x);
  const y = getRange(height, scale, offset.y);
  const factor = 500;

  for (let i = x.start; i < x.end; i += (x.end - x.start) / factor) {
    for (let j = y.start; j < y.end; j += (y.end - y.start) / factor) {
      const drawPos = convertPos(data, {x: i, y: j});
      if (f(i, j) >= 0) {
        ctx.fillRect(drawPos.x, drawPos.y, width / factor, height / factor);
      }
    }
  }
}

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = 1000;
  const canvasHeight = 800;

  useEffect(() => {
    const ctx = canvasRef.current!.getContext('2d')!;
    const canvasData = {
      ctx,
      width: canvasWidth,
      height: canvasHeight,
      offset: {x: 0, y: 0},
      scale: 10,
    };

    drawAxis(canvasData);
    //drawFunction(canvasData, x => x + 10);
    //drawFunction(canvasData, x => Math.sin(x / 10) * 30);
    //drawFunction(canvasData, x => Math.cos(x / 10) * 30);
    drawFunction(canvasData, x => Math.abs(Math.tan(x)));
    //drawFunction(canvasData, x => x);
    //drawFunctionGrid(canvasData, (x, y) => x ** 2 + y ** 2 - 16);
    //drawFunction(canvasData, x => 1 / (1 + Math.exp(-x)));

  }, [canvasRef]);

  return <canvas ref={canvasRef} height={canvasHeight} width={canvasWidth} />;
}
