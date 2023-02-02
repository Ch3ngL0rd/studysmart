// Plinko game on the left
// Controls on the right

import React from "react"

import Matter from 'matter-js';


interface CanvasProps {
  width: number;
  height: number;
}

// 16 by 9

export const MatterStepOne = (props: CanvasProps) => {
  const boxRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const engineRef = React.useRef<Matter.Engine | null>(null);
  const renderRef = React.useRef<Matter.Render | null>(null);

  function wall(x: number, y: number, width: number, height: number) {
    return Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        fillStyle: 'blue'
      }
    })
  }

  function peg(x: number, y: number, radius: number) {
    return Matter.Bodies.circle(x, y, radius, {
      label: 'peg',
      restitution: 0.7,
      isStatic: true,
      render: {
        fillStyle: 'yellow'
      }
    })
  }

  function floor(x: number, y: number, width: number, height: number, score : number) {
    // attach score to rectangle
    const flr = Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      label: 'floor',
      render: {
        fillStyle: 'green'
      }
    })

    flr.score = score;
    return flr;
  }

  function lightPeg(event: Matter.IEventCollision<Matter.Engine>) {
    event.pairs.filter((pair: Matter.Pair) => pair.bodyA.label === 'peg')
      .forEach((pair: Matter.Pair) => {
        pair.bodyA.render.fillStyle = '#4c63f5'
      });
  }

  function removeBead(event: Matter.IEventCollision<Matter.Engine>) {
    event.pairs
      .filter((pair: Matter.Pair) => pair.bodyA.label === 'floor')
      .forEach((pair: Matter.Pair) => {
        console.log(pair.bodyA.score)
        Matter.World.remove(engineRef.current!.world, pair.bodyB);
      });
  }

  function dropBead() {
    if (engineRef.current === null) return;
    let bead = Matter.Bodies.circle(540 + Math.random() * 40 - 20, 10, 10, {
      restitution: 0.7,
      label: 'bead',
      render: {
        fillStyle: 'white',
        strokeStyle: 'black',
        lineWidth: 1,
      }
    });

    // stops collision between two beads
    bead.collisionFilter.group = -1;

    // ranodmise velocity
    Matter.Body.setVelocity(bead, {
      x: Math.random() * 1 - 0.5,
      y: 0,
    });

    Matter.Body.setAngularVelocity(bead, Math.random() * 0.1 - 0.05);

    Matter.World.add(engineRef.current.world, bead);
  }

  React.useEffect(() => {
    if (!boxRef.current || !canvasRef.current) return;
    let Engine = Matter.Engine;
    let Render = Matter.Render;
    let World = Matter.World;
    let Bodies = Matter.Bodies;

    let engine = Engine.create({});
    engineRef.current = engine;

    let render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: 1080,
        height: 720,
        background: 'rgba(255, 0, 0, 0.5)',
        wireframes: false,
      }
    });
    renderRef.current = render;

    Matter.World.add(engine.world, [
      wall(540, 5, 1080, 10),
      wall(540, 715, 1080, 10),
      wall(5, 360, 10, 720),
      wall(1075, 360, 10, 720),
    ]);

    for (let x = 0; x < 15; x += 1) {
      let divider = wall(x * 72, 720, 10, 200);
      let bucket_floor = floor(x * 72 + 36 + 10 / 2, 710, 72, 10, x);
      Matter.World.add(engine.world, divider);
      Matter.World.add(engine.world, bucket_floor);
    }

    // creates a pyramid of dots seperated by 80 pixels distance veritcla and horizontal
    for (let y = 3; y < 14; y++) {
      for (let x = 0; x < y; x++) {
        let xPosition = 580 + x * 70 - y * 35;
        let yPosition = 10 + y * 50 - 4 * 20;
        Matter.World.add(engine.world, peg(xPosition, yPosition, 10));
      }
    }

    // adds colisions between beads and floor
    // removes beads when they collie with floor

    Matter.Events.on(engine, "collisionStart", lightPeg);
    Matter.Events.on(engine, "collisionStart", removeBead);

    Matter.Runner.run(engine);
    Render.run(render);
  }, [boxRef, canvasRef]);


  return (
    <div
      ref={boxRef}
      className="grid grid-cols-5">
      <div className="col-span-4">
        <canvas ref={canvasRef} />
      </div>

      <div className="col-span-1">
        <button onClick={dropBead}>Drop</button>
      </div>
    </div>
  );
};


// Ratio is 4:1
export default function Plinko() {

  React.useEffect(() => {
    // drwa
  }, [])

  return (
    <main>
      <MatterStepOne width={0} height={0} />
    </main>
  )
}
