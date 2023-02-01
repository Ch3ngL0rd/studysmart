// Plinko game on the left
// Controls on the right

import React from "react"

import Matter from 'matter-js';

export const MatterStepOne = () => {
  const boxRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

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
      label:'peg',
      restitution: 0.5,
      isStatic: true,
      render: {
        fillStyle: 'yellow'
      }
    })
  }

  function bead() {
    return Matter.Bodies.circle(289, 40, 10, {
      restitution: 0.5,
      render: {
        fillStyle: 'white'
      }
    });
  }

  function lightPeg(event: Matter.IEventCollision<Matter.Engine>) {
    event.pairs.filter((pair : Matter.Pair) => pair.bodyA.label === 'peg')
    .forEach((pair : Matter.Pair) => {
      pair.bodyA.render.fillStyle = '#4c63f5'
    });
  }



  React.useEffect(() => {
    if (!boxRef.current || !canvasRef.current) return;
    let Engine = Matter.Engine;
    let Render = Matter.Render;
    let World = Matter.World;
    let Bodies = Matter.Bodies;

    let engine = Engine.create({});

    let render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: 560,
        height: 800,
        background: 'rgba(255, 0, 0, 0.5)',
        wireframes: false
      }
    });

    Matter.World.add(engine.world, [
      wall(280, 0, 560, 20),
      wall(280, 800, 560, 20),
      wall(0, 400, 20, 800),
      wall(560, 400, 20, 800),
    ]);

    for (let x = 0; x <= 560; x += 80) {
      let divider = wall(x, 610, 20, 360);
      Matter.World.add(engine.world, divider);
    }

    let isStaggerRow = false;
    for (let y = 200; y <= 400; y += 40) {
      let startX = isStaggerRow ? 80 : 40;
      for (let x = startX; x <= 520; x += 80) {
        Matter.World.add(engine.world, peg(x, y, 10));
      }
      isStaggerRow = !isStaggerRow;
    }

    function dropBead() {
      let droppedBead = bead();
      // ranodmise velocity
      Matter.Body.setVelocity(droppedBead, {
        x: Math.random() * 1 - 0.5,
        y: 0,
      });

      Matter.Body.setAngularVelocity(droppedBead, Math.random() * 0.1 - 0.05);

      Matter.World.add(engine.world, droppedBead);
    }

    let dropBeadInterval = setInterval(dropBead, 100);

    Matter.Events.on(engine, "collisionStart", lightPeg);

    Matter.Runner.run(engine);
    Render.run(render);
  }, [boxRef, canvasRef]);

  return (
    <div
      ref={boxRef}
      style={{
        width: 1000,
        height: 1000
      }}
    >
      <canvas ref={canvasRef} />
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
      <h1>Plinko</h1>
      <MatterStepOne />
    </main>
  )
}
