import { PortfolioView } from "@/components/portfolio-view"
export default function Page() {
  return (
    <>
      <PortfolioView />
    </>
  )
}

// "use client";

// import { useEffect, useRef } from "react";
// import Spline from "@splinetool/react-spline";
// import type { Application } from "@splinetool/runtime";

// export default function SplineDemo() {
//   const sectionRef = useRef<HTMLElement>(null);
//   const appRef = useRef<Application | null>(null);

//   useEffect(() => {
//     let frame = 0;

//     // 同步滚动进度
//     function update() {
//       const section = sectionRef.current;
//       const app = appRef.current;
//       if (!section || !app) return;

//       const cube = app.findObjectByName("paper");
//       if (!cube) throw new Error("找不到 paper");

//       const rect = section.getBoundingClientRect();
//       const distance = rect.height - window.innerHeight;
//       const progress = Math.min(
//         1,
//         Math.max(0, -rect.top / distance),
//       );

//       cube.position.y = 150 * progress;
//       cube.rotation.y = Math.PI * progress;

//       const scale = 1 + 0.5 * progress;
//       cube.scale.x = scale;
//       cube.scale.y = scale;
//       cube.scale.z = scale;
//     }

//     // 合并滚动更新
//     function scheduleUpdate() {
//       cancelAnimationFrame(frame);
//       frame = requestAnimationFrame(update);
//     }

//     window.addEventListener("scroll", scheduleUpdate);
//     window.addEventListener("resize", scheduleUpdate);

//     return () => {
//       cancelAnimationFrame(frame);
//       window.removeEventListener("scroll", scheduleUpdate);
//       window.removeEventListener("resize", scheduleUpdate);
//     };
//   }, []);

//   return (
//     <main>
//       <section ref={sectionRef} style={{ height: "300vh" }}>
//         <div
//           style={{
//             position: "sticky",
//             top: 0,
//             height: "100vh",
//           }}
//         >
//           <Spline
//             scene="https://www.lawted.tech/3D/scene.splinecode"
//             onLoad={(app) => {
//               appRef.current = app;
//             }}
//           />
//           <p style={{ position: "absolute", bottom: 24, left: 24 }}>
//             向下滚动，观察方块
//           </p>
//         </div>
//       </section>
//     </main>
//   );
// }